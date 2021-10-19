const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const { UuAppWorkspace } = require("uu_appg01_server").Workspace;
const { UriBuilder } = require("uu_appg01_server").Uri;
const { UuTerrClient } = require("uu_territory_clientg01");
const { Schemas, Jokes } = require("../constants");

const Path = require("path");
const Errors = require("../../api/errors/jokes-error");
const InstanceChecker = require("../components/instance-checker");

const Warnings = {
  SetStateUnsupportedKeys: {
    CODE: `${Errors.SetState.UC_CODE}unsupportedKeys`,
  },
};

class SetStateAbl {
  constructor() {
    this.validator = new Validator(Path.join(__dirname, "../../", "api", "validation_types", "jokes-types.js"));
    this.dao = DaoFactory.getDao(Schemas.JOKES);
  }

  async setState(uri, dtoIn, session) {
    const awid = uri.getAwid();
    let uuAppErrorMap = {};
    let dtoOut = {};

    // HDS 1
    const allowedStates = new Set([Jokes.States.ACTIVE, Jokes.States.UNDER_CONSTRUCTION]);
    let jokes = await InstanceChecker.ensureInstanceAndState(awid, Errors, allowedStates, uuAppErrorMap);

    // HDS 2
    let validationResult = this.validator.validate("jokesSetStateDtoInType", dtoIn);

    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      Warnings.SetStateUnsupportedKeys.CODE,
      Errors.SetState.InvalidDtoIn
    );

    // HDS 3
    const uuObject = { awid, ...dtoIn };

    try {
      jokes = await this.dao.updateByAwid(uuObject);
    } catch (e) {
      throw new Errors.SetState.JokesUpdateByAwidDaoFailed({ uuAppErrorMap }, e);
    }

    dtoOut.jokes = jokes;

    // HDS 4
    const workspace = await UuAppWorkspace.get(awid);

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
        throw new Errors.UpdateAwscStateFailed({ uuAppErrorMap }, e);
      }

      dtoOut.artifact = awsc.artifact;
      dtoOut.context = awsc.context;
    }

    // HDS 5
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }
}

module.exports = new SetStateAbl();
