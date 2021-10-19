const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory, ObjectStoreError } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const { UuAppWorkspace } = require("uu_appg01_server").Workspace;
const { UuTerrClient } = require("uu_territory_clientg01");
const { UriBuilder } = require("uu_appg01_server").Uri;

const Path = require("path");
const Errors = require("../../api/errors/jokes-error");
const { Schemas, Jokes } = require("../constants");
const InstanceChecker = require("../components/instance-checker");

const Warnings = {
  PlugInBtUnsupportedKeys: {
    CODE: `${Errors.Init.UC_CODE}unsupportedKeys`,
  },
};

const CODE_PARAM = "code";
const ID_PARAM = "id";
const AWSC_CODE_PREFIX = "uuJokes";
const APP_TYPE_CODE = "uu-jokes-maing01";
const AWSC_CREATE_FAILED_CODE = "uu-businessterritory-maing01/uuAwsc/create/createFailed";
const NOT_UNIQUE_ID_CODE = "uu-app-datastore/dao/notUniqueId";

class PlugInBtAbl {
  constructor() {
    this.validator = new Validator(Path.join(__dirname, "../../", "api", "validation_types", "jokes-types.js"));
    this.dao = DaoFactory.getDao(Schemas.JOKES);
  }

  async plugInBt(uri, dtoIn, session) {
    const awid = uri.getAwid();

    // HDS 1
    const allowedStates = new Set([Jokes.States.ACTIVE, Jokes.States.UNDER_CONSTRUCTION]);
    let jokes = await InstanceChecker.ensureInstanceAndState(awid, Errors, allowedStates, uuAppErrorMap);

    // HDS 2
    let validationResult = this.validator.validate("jokesPlugInBtDtoInType", dtoIn);

    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      Warnings.PlugInBtUnsupportedKeys.code,
      Errors.PlugInBtAbl.InvalidDtoIn
    );

    // HDS 3
    let uuBtUri;

    try {
      uuBtUri = UriBuilder.parse(dtoIn.uuBtLocationUri).toUri();
    } catch (e) {
      // HDS 3.1
      throw new Errors.PlugInBt.UuBtLocationUriParseFailed({ uuAppErrorMap }, { uri: dtoIn.uuBtLocationUri }, e);
    }

    // HDS 4
    const uuBtBaseUri = uuBtUri.getBaseUri().toString();
    const uuBtUriParams = uuBtUri.getParameters();

    if (!uuBtUriParams.code && !uuBtUriParams.id) {
      throw new Errors.PlugInBt.UuBtLocationNotSpecified({ uuAppErrorMap }, { uri: dtoIn.uuBtLocationUri });
    }

    // HDS 5
    const awsc = await this._createAwsc(awid, uuBtBaseUri, dtoIn, uuBtUriParams, uuAppErrorMap, uri, session);

    // HDS 6
    try {
      await this._connectArtifact(uri, uuBtUri, awsc.id, session);
    } catch (e) {
      throw new Errors.PlugInBt.ConnectAwscFailed({ uuAppErrorMap }, { awscId: awsc.id, appUri: uri.toString() }, e);
    }

    // HDS 7
    jokes.artifactId = awsc.id;

    try {
      jokes = await this.dao.updateByAwid(jokes);
    } catch (e) {
      if (e instanceof ObjectStoreError) {
        throw new Errors.PlugInBt.JokesDaoUpdateFailed({ uuAppErrorMap }, e);
      }

      throw e;
    }

    // HDS 8
    return { jokes, uuAppErrorMap };
  }

  // TODO Move helpers to reusable app component
  async _createAwsc(awid, uuBtBaseUri, dtoIn, uuBtUriParams, uuAppErrorMap, uri, session) {
    const uuTerritoryClient = new UuTerrClient({
      baseUri: uuBtBaseUri,
      session,
      appUri: uri.getBaseUri(),
    });

    let location;
    if (uuBtUriParams[CODE_PARAM]) {
      location = { locationCode: uuBtUriParams[CODE_PARAM] };
    } else {
      location = { location: uuBtUriParams[ID_PARAM] };
    }

    const awscCode = `${AWSC_CODE_PREFIX}/${awid}`;
    const awscCreateDtoIn = {
      awid: awid,
      code: awscCode,
      name: dtoIn.name,
      permissionMatrix: dtoIn.permissionMatrix,
      typeCode: APP_TYPE_CODE,
      ...location,
    };

    let awsc;
    try {
      // HDS 6.1.A
      awsc = await uuTerritoryClient.Awsc.create(awscCreateDtoIn);
    } catch (e) {
      // HDS 6.1.B

      const awscCreateErrorMap = (e.dtoOut && e.dtoOut.uuAppErrorMap) || {};

      const isDup =
        awscCreateErrorMap[AWSC_CREATE_FAILED_CODE] &&
        awscCreateErrorMap[AWSC_CREATE_FAILED_CODE].cause &&
        awscCreateErrorMap[AWSC_CREATE_FAILED_CODE].cause[NOT_UNIQUE_ID_CODE];

      // HDS 6.1.B.1
      if (isDup) {
        // HDS 6.1.B.1.A.
        ValidationHelper.addWarning(
          uuAppErrorMap,
          AWSC_CREATE_FAILED_CODE,
          awscCreateErrorMap[AWSC_CREATE_FAILED_CODE].message,
          awscCreateErrorMap[AWSC_CREATE_FAILED_CODE].cause
        );

        awsc = await uuTerritoryClient.Awsc.get({ code: awscCode });
      } else {
        // HDS 6.1.B.1.B.
        throw new Errors.Init.CreateAwscFailed(
          { uuAppErrorMap: { ...uuAppErrorMap, ...awscCreateErrorMap } },
          { uuBtBaseUri: uuBtBaseUri, awid },
          e
        );
      }
    }

    return awsc;
  }

  async _connectArtifact(appUri, uuBtUri, awscId, session) {
    const appBaseUri = appUri.getBaseUri();
    const artifactUri = UriBuilder.parse(uuBtUri)
      .setUseCase(null)
      .clearParameters()
      .setParameter(ID_PARAM, awscId)
      .toUri()
      .toString();

    return await UuAppWorkspace.connectArtifact(appBaseUri, { artifactUri }, session);
  }
}
module.exports = new PlugInBtAbl();
