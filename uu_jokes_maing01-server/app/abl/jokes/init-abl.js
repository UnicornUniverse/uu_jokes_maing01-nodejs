const { Validator } = require("uu_appg01_server").Validation;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { Profile, UuAppWorkspace } = require("uu_appg01_server").Workspace;
const { UuTerrClient } = require("uu_territory_clientg01");
const { UriBuilder } = require("uu_appg01_server").Uri;

const Path = require("path");
const Errors = require("../../api/errors/jokes-error");
const { Schemas, Jokes, Profiles } = require("../constants");

const Warnings = {
  InitUnsupportedKeys: {
    CODE: `${Errors.Init.UC_CODE}unsupportedKeys`,
  },
};

const DEFAULT_NAME = "uuJokes";
const CODE_PARAM = "code";
const ID_PARAM = "id";
const AWSC_CODE_PREFIX = "uuJokes";
const APP_TYPE_CODE = "uu-jokes-maing01";
const AWSC_CREATE_FAILED_CODE = "uu-businessterritory-maing01/uuAwsc/create/createFailed";
const NOT_UNIQUE_ID_CODE = "uu-app-datastore/dao/notUniqueId";

class InitAbl {
  constructor() {
    this.validator = new Validator(Path.join(__dirname, "../../", "api", "validation_types", "jokes-types.js"));
    this.dao = DaoFactory.getDao(Schemas.JOKES);
  }

  async init(uri, dtoIn, session) {
    const awid = uri.getAwid();
    let uuAppErrorMap = {};
    let uuBtUri, uuBtBaseUri, uuBtUriParams;

    // HDS 1 - Validate dtoIn
    const validationResult = this.validator.validate("jokesInitDtoInType", dtoIn);

    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      Warnings.InitUnsupportedKeys.CODE,
      Errors.Init.InvalidDtoIn
    );

    // HDS 2
    if (dtoIn.uuBtLocationUri) {
      try {
        uuBtUri = UriBuilder.parse(dtoIn.uuBtLocationUri).toUri();
      } catch (e) {
        throw new Errors.Init.UuBtLocationUriParseFailed({ uuAppErrorMap }, { uri: dtoIn.uuBtLocationUri }, e);
      }

      uuBtBaseUri = uuBtUri.getBaseUri().toString();
      uuBtUriParams = uuBtUri.getParameters();

      if (!uuBtUriParams.code && !uuBtUriParams.id) {
        throw new Errors.Init.UuBtLocationNotSpecified({ uuAppErrorMap }, { uri: dtoIn.uuBtLocationUri });
      }
    }

    // HDS 3
    const promises = Object.values(Schemas).map(async (schema) => DaoFactory.getDao(schema).createSchema());

    try {
      await Promise.all(promises);
    } catch (e) {
      throw new Errors.Init.SchemaDaoCreateSchemaFailed({ uuAppErrorMap }, e);
    }

    const uuObject = {
      awid,
      state: Jokes.States.INIT,
      name: dtoIn.name || DEFAULT_NAME,
    };

    let jokes;

    // HDS 4
    try {
      // TODO It is not idempotent!
      jokes = await this.dao.create(uuObject);
    } catch (e) {
      throw new Errors.Init.JokesDaoCreateFailed({ uuAppErrorMap }, e);
    }

    // HDS 5
    if (dtoIn.uuBtLocationUri) {
      // HDS 5.1
      const awsc = await this._createAwsc(awid, uuBtBaseUri, dtoIn, uuBtUriParams, uuAppErrorMap, uri, session);

      // HDS 5.3
      try {
        await this._connectArtifact(uri, uuBtUri, awsc.id, session);
      } catch (e) {
        throw new Errors.Init.ConnectAwscFailed({ uuAppErrorMap }, { awscId: awsc.id, appUri: uri.toString() }, e);
      }
    } else {
      // AD 5.A
      try {
        await Profile.set(awid, Profiles.AUTHORITIES, dtoIn.uuAppProfileAuthorities);
      } catch (e) {
        throw new Errors.Init.SysSetProfileFailed({ uuAppErrorMap }, { role: dtoIn.uuAppProfileAuthorities }, e);
      }
    }

    // HDS 7
    jokes.state = dtoIn.state || Jokes.States.UNDER_CONSTRUCTION;

    try {
      jokes = await this.dao.updateByAwid(jokes);
    } catch (e) {
      throw new Errors.Init.JokesDaoUpdateFailed({ uuAppErrorMap }, e);
    }

    return { ...jokes, uuAppErrorMap };
  }

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
      awsc = await uuTerritoryClient.Awsc.create(awscCreateDtoIn);
    } catch (e) {
      const awscCreateErrorMap = (e.dtoOut && e.dtoOut.uuAppErrorMap) || {};

      const isDup =
        awscCreateErrorMap[AWSC_CREATE_FAILED_CODE] &&
        awscCreateErrorMap[AWSC_CREATE_FAILED_CODE].cause &&
        awscCreateErrorMap[AWSC_CREATE_FAILED_CODE].cause[NOT_UNIQUE_ID_CODE];

      if (isDup) {
        ValidationHelper.addWarning(
          uuAppErrorMap,
          AWSC_CREATE_FAILED_CODE,
          awscCreateErrorMap[AWSC_CREATE_FAILED_CODE].message,
          awscCreateErrorMap[AWSC_CREATE_FAILED_CODE].cause
        );

        awsc = await uuTerritoryClient.Awsc.get({ code: awscCode });
      } else {
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
module.exports = new InitAbl();
