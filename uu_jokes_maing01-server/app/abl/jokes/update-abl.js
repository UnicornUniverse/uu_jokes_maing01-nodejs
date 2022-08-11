const { Validator } = require("uu_appg01_server").Validation;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { UuAppWorkspace } = require("uu_appg01_server").Workspace;
const { UuTerrClient } = require("uu_territory_clientg01");
const { UriBuilder } = require("uu_appg01_server").Uri;
const Path = require("path");

const Errors = require("../../api/errors/jokes-error");
const Warnings = require("../../api/warnings/jokes-warnings");
const InstanceChecker = require("../../component/instance-checker");
const { Profiles, Schemas, Jokes } = require("../constants");

class UpdateAbl {
  constructor() {
    this.validator = new Validator(Path.join(__dirname, "../../", "api", "validation_types", "jokes-types.js"));
    this.dao = DaoFactory.getDao(Schemas.JOKES);
  }

  async update(uri, dtoIn, session, authorizationResult) {
    const awid = uri.getAwid();
    let uuAppErrorMap = {};
    let dtoOut = {};

    // hds 1
    const validationResult = this.validator.validate("jokesUpdateDtoInType", dtoIn);
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      uuAppErrorMap,
      Warnings.Update.UnsupportedKeys.code,
      Errors.Update.InvalidDtoIn
    );

    // hds 2
    const allowedStateRules = {
      [Profiles.AUTHORITIES]: new Set([Jokes.States.ACTIVE, Jokes.States.UNDER_CONSTRUCTION]),
    };
    await InstanceChecker.ensureInstanceAndState(
      awid,
      allowedStateRules,
      authorizationResult,
      Errors.Update,
      uuAppErrorMap
    );

    // hds 3
    const uuObject = { awid, ...dtoIn };

    let jokes;
    try {
      jokes = await this.dao.updateByAwid(uuObject);
    } catch (e) {
      throw new Errors.Update.JokesDaoUpdateByAwidFailed({ uuAppErrorMap }, e);
    }

    dtoOut.jokes = jokes;

    // hds 4
    const workspace = await UuAppWorkspace.get(awid);

    // hds 5
    if (workspace.authorizationStrategy === "artifact") {
      const artifactUri = UriBuilder.parse(workspace.artifactUri).toUri();

      const setBasicAttributesDtoIn = {
        id: artifactUri.getParameters().id,
        name: jokes.name,

        stateData: {
          name: jokes.name,
          ...dtoIn.stateData,
        },
        loadContext: true,
      };

      let awsc;

      try {
        awsc = await UuTerrClient.Awsc.setBasicAttributes(setBasicAttributesDtoIn, {
          baseUri: artifactUri.getBaseUri(),
          session,
          appUri: uri.getBaseUri(),
        });
      } catch (e) {
        throw new Errors.Update.UpdateBasicAttributesFailed({ uuAppErrorMap }, e);
      }

      dtoOut.artifact = awsc.artifact;
      dtoOut.context = awsc.context;
    }

    // hds 6
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }
}

module.exports = new UpdateAbl();
