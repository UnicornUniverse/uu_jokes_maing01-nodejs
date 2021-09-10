const { Validator } = require("uu_appg01_server").Validation;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { UuAppWorkspace } = require("uu_appg01_server").Workspace;
const { UuTerrClient } = require("uu_territory_clientg01");
const { UriBuilder } = require("uu_appg01_server").Uri;
const Path = require("path");

const Errors = require("../../api/errors/jokes-error");
const InstanceChecker = require("../components/instance-checker");
const { Schemas, Jokes } = require("../constants");

const Warnings = {
  UpdateUnsupportedKeys: {
    CODE: `${Errors.Update.UC_CODE}unsupportedKeys`,
  },
};

class UpdateAbl {
  constructor() {
    this.validator = new Validator(Path.join(__dirname, "../../", "api", "validation_types", "jokes-types.js"));
    this.dao = DaoFactory.getDao(Schemas.JOKES);
  }

  async update(uri, dtoIn, session) {
    const awid = uri.getAwid();
    let uuAppErrorMap = {};
    let dtoOut = {};

    // HDS 1
    const allowedStates = new Set([Jokes.States.ACTIVE, Jokes.States.UNDER_CONSTRUCTION]);
    let jokes = await InstanceChecker.ensureInstanceAndState(awid, Errors, allowedStates, uuAppErrorMap);

    // HDS 2
    let validationResult = this.validator.validate("jokesUpdateDtoInType", dtoIn);

    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      Warnings.UpdateUnsupportedKeys.CODE,
      Errors.Update.InvalidDtoIn
    );

    // HDS 3
    const uuObject = { awid, ...dtoIn };

    try {
      jokes = await this.dao.updateByAwid(uuObject);
    } catch (e) {
      throw new Errors.Update.JokesDaoUpdateByAwidFailed({ uuAppErrorMap }, e);
    }

    dtoOut.jokes = jokes;

    // HDS 4
    const workspace = await UuAppWorkspace.get(awid);

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
        throw new Errors.UpdateBasicAttributesFailed({ uuAppErrorMap }, e);
      }

      dtoOut.artifact = awsc.artifact;
      dtoOut.context = awsc.context;
    }

    // HDS 5
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }
}

module.exports = new UpdateAbl();
