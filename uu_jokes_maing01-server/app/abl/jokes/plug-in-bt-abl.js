const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory, ObjectStoreError } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const { UriBuilder } = require("uu_appg01_server").Uri;
const Path = require("path");

const UuBtPlugIn = require("../../component/uu-bt-plug-in");
const Errors = require("../../api/errors/jokes-error");
const Warnings = require("../../api/warnings/jokes-warnings");
const { Profiles, Schemas, Jokes } = require("../constants");
const InstanceChecker = require("../../component/instance-checker");

class PlugInBtAbl {
  constructor() {
    this.validator = new Validator(Path.join(__dirname, "../../", "api", "validation_types", "jokes-types.js"));
    this.dao = DaoFactory.getDao(Schemas.JOKES);
  }

  async plugInBt(uri, dtoIn, session, authorizationResult) {
    let uuAppErrorMap = {};
    const awid = uri.getAwid();

    // hds 1
    const allowedStateRules = {
      [Profiles.AUTHORITIES]: new Set([Jokes.States.ACTIVE, Jokes.States.UNDER_CONSTRUCTION]),
    };
    let jokes = await InstanceChecker.ensureInstanceAndState(
      awid,
      allowedStateRules,
      authorizationResult,
      Errors.PlugInBt,
      uuAppErrorMap
    );

    // hds 2
    const validationResult = this.validator.validate("jokesPlugInBtDtoInType", dtoIn);
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      uuAppErrorMap,
      Warnings.PlugInBt.UnsupportedKeys.code,
      Errors.PlugInBt.InvalidDtoIn
    );

    // hds 3
    let uuBtUri;
    try {
      uuBtUri = UriBuilder.parse(dtoIn.uuBtLocationUri).toUri();
    } catch (e) {
      throw new Errors.PlugInBt.UuBtLocationUriParseFailed({ uuAppErrorMap }, { uri: dtoIn.uuBtLocationUri }, e);
    }

    const uuBtBaseUri = uuBtUri.getBaseUri().toString();
    const uuBtUriParams = uuBtUri.getParameters();

    if (!uuBtUriParams.code && !uuBtUriParams.id) {
      throw new Errors.PlugInBt.UuBtLocationNotSpecified({ uuAppErrorMap }, { uri: dtoIn.uuBtLocationUri });
    }

    // hds 4
    const awsc = await UuBtPlugIn.createAwsc(
      awid,
      uuBtBaseUri,
      { name: jokes.name, description: jokes.description },
      uuBtUriParams,
      uuAppErrorMap,
      Errors.PlugInBt.CreateAwscFailed,
      uri,
      session
    );

    // hds 5
    try {
      await UuBtPlugIn.connectArtifact(uri, uuBtUri, awsc.id, session);
    } catch (e) {
      throw new Errors.PlugInBt.ConnectAwscFailed({ uuAppErrorMap }, { awscId: awsc.id, appUri: uri.toString() }, e);
    }

    // hds 6
    jokes.artifactId = awsc.id;
    jokes.uuBtBaseUri = uuBtBaseUri;

    try {
      jokes = await this.dao.updateByAwid(jokes);
    } catch (e) {
      if (e instanceof ObjectStoreError) {
        throw new Errors.PlugInBt.JokesDaoUpdateFailed({ uuAppErrorMap }, e);
      }

      throw e;
    }

    // hds 7
    return { ...jokes, uuAppErrorMap };
  }
}
module.exports = new PlugInBtAbl();
