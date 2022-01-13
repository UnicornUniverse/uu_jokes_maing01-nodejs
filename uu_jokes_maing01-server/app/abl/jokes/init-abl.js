const { Validator } = require("uu_appg01_server").Validation;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { Profile } = require("uu_appg01_server").Workspace;
const { UriBuilder } = require("uu_appg01_server").Uri;
const Path = require("path");

const UuBtPlugIn = require("../../component/uu-bt-plug-in");
const Errors = require("../../api/errors/jokes-error");
const Warnings = require("../../api/warnings/jokes-warnings");
const { Schemas, Jokes, Profiles } = require("../constants");

const DEFAULT_NAME = "uuJokes";

class InitAbl {
  constructor() {
    this.validator = new Validator(Path.join(__dirname, "../../", "api", "validation_types", "jokes-types.js"));
    this.dao = DaoFactory.getDao(Schemas.JOKES);
  }

  async init(uri, dtoIn, session) {
    const awid = uri.getAwid();
    let uuAppErrorMap = {};
    let uuBtUri, uuBtBaseUri, uuBtUriParams;

    // hds 1
    const validationResult = this.validator.validate("jokesInitDtoInType", dtoIn);
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      Warnings.Init.UnsupportedKeys.code,
      Errors.Init.InvalidDtoIn
    );

    // 1.4
    dtoIn.state = dtoIn.state || Jokes.States.UNDER_CONSTRUCTION;
    dtoIn.name = dtoIn.name || DEFAULT_NAME;

    // hds 2
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

    // hds 3
    const promises = Object.values(Schemas).map(async (schema) => DaoFactory.getDao(schema).createSchema());
    try {
      await Promise.all(promises);
    } catch (e) {
      throw new Errors.Init.SchemaDaoCreateSchemaFailed({ uuAppErrorMap }, e);
    }

    // hds 4
    let jokes = await this.dao.getByAwid(awid);

    // hds 5
    if (!jokes) {
      const uuObject = {
        awid,
        state: dtoIn.uuBtLocationUri ? Jokes.States.INIT : dtoIn.state,
        name: dtoIn.name,
      };

      try {
        jokes = await this.dao.create(uuObject);
      } catch (e) {
        throw new Errors.Init.JokesDaoCreateFailed({ uuAppErrorMap }, e);
      }
    }

    // hds 6
    if (dtoIn.uuBtLocationUri) {
      // hds 6.1
      const awsc = await UuBtPlugIn.createAwsc(
        awid,
        uuBtBaseUri,
        dtoIn,
        uuBtUriParams,
        uuAppErrorMap,
        Errors.Init.CreateAwscFailed,
        uri,
        session
      );

      // hds 6.3
      try {
        await UuBtPlugIn.connectArtifact(uri, uuBtUri, awsc.id, session);
      } catch (e) {
        throw new Errors.Init.ConnectAwscFailed({ uuAppErrorMap }, { awscId: awsc.id, appUri: uri.toString() }, e);
      }

      // hds 6.4
      const toUpdate = { ...jokes, state: dtoIn.state, artifactId: awsc.id, uuBtBaseUri: uuBtBaseUri };
      try {
        jokes = await this.dao.updateByAwid(toUpdate);
      } catch (e) {
        throw new Errors.Init.JokesDaoUpdateFailed({ uuAppErrorMap }, e);
      }
    } else {
      try {
        await Profile.set(awid, Profiles.AUTHORITIES, dtoIn.uuAppProfileAuthorities);
      } catch (e) {
        throw new Errors.Init.SysSetProfileFailed({ uuAppErrorMap }, { role: dtoIn.uuAppProfileAuthorities }, e);
      }
    }

    // hds 7
    return { ...jokes, uuAppErrorMap };
  }
}
module.exports = new InitAbl();
