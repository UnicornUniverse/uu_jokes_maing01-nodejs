const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const { UuAppWorkspace } = require("uu_appg01_server").Workspace;
const { UriBuilder } = require("uu_appg01_server").Uri;
const { UuTerrClient } = require("uu_territory_clientg01");
const { Profiles, Schemas, Jokes } = require("../constants");

const Path = require("path");
const Errors = require("../../api/errors/jokes-error");
const Warnings = require("../../api/warnings/jokes-warnings");
const InstanceChecker = require("../../component/instance-checker");

class SetStateAbl {
  constructor() {
    this.validator = new Validator(Path.join(__dirname, "../../", "api", "validation_types", "jokes-types.js"));
    this.dao = DaoFactory.getDao(Schemas.JOKES);
  }

  async setState(uri, dtoIn, session, authorizationResult) {
    const awid = uri.getAwid();
    let uuAppErrorMap = {};
    let dtoOut = {};

    // hds 1
    const validationResult = this.validator.validate("jokesSetStateDtoInType", dtoIn);
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      uuAppErrorMap,
      Warnings.SetState.UnsupportedKeys.code,
      Errors.SetState.InvalidDtoIn
    );

    // hds 2
    // note: "closed" state is allowed for educational reasons in order to have
    // the possibility to test the state and still go back
    const allowedStateRules = {
      [Profiles.AUTHORITIES]: new Set([Jokes.States.ACTIVE, Jokes.States.UNDER_CONSTRUCTION, Jokes.States.CLOSED]),
    };
    await InstanceChecker.ensureInstanceAndState(
      awid,
      allowedStateRules,
      authorizationResult,
      Errors.SetState,
      uuAppErrorMap
    );

    // hds 3
    let jokes;
    const uuObject = { awid, ...dtoIn };
    try {
      jokes = await this.dao.updateByAwid(uuObject);
    } catch (e) {
      throw new Errors.SetState.JokesUpdateByAwidDaoFailed({ uuAppErrorMap }, e);
    }

    dtoOut.jokes = jokes;

    // hds 4
    const workspace = await UuAppWorkspace.get(awid);

    // hds 5
    if (workspace.authorizationStrategy === "artifact") {
      const artifactUri = UriBuilder.parse(workspace.artifactUri).toUri();

      const setStateDtoIn = {
        id: artifactUri.getParameters().id,
        state: jokes.state,
        stateData: {
          ...dtoIn.stateData,
        },
        loadContext: true,
      };

      let awsc;

      try {
        awsc = await UuTerrClient.Awsc.setState(setStateDtoIn, {
          baseUri: artifactUri.getBaseUri(),
          session,
          appUri: uri.getBaseUri(),
        });
      } catch (e) {
        throw new Errors.SetState.UpdateAwscStateFailed({ uuAppErrorMap }, e);
      }

      dtoOut.artifact = awsc.artifact;
      dtoOut.context = awsc.context;
    }

    // hds 6
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }
}

module.exports = new SetStateAbl();
