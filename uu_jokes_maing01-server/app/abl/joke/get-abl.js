"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
// TODO Add InstanceChecker
const Errors = require("../api/errors/joke-error");
const Path = require("path");

const WARNINGS = {
  getUnsupportedKeys: {
    code: `${Errors.Get.UC_CODE}unsupportedKeys`,
  },
};

class GetAbl {
  constructor() {
    this.validator = new Validator(Path.join(__dirname, "..", "api", "validation_types", "joke-types.js"));
    this.dao = DaoFactory.getDao("joke");
    this.jokeRatingDao = DaoFactory.getDao("jokeRating");
  }

  async get(awid, dtoIn, authorizationResult) {
    // hds 1, A1, hds 1.1, A2
    // TODO Add InstanceChecker
    // let jokesInstance = await JokesInstanceAbl.checkInstance(
    //   awid,
    //   Errors.Get.JokesInstanceDoesNotExist,
    //   Errors.Get.JokesInstanceNotInProperState
    // );
    // A3
    // let authorizedProfiles = authorizationResult.getAuthorizedProfiles();
    // if (
    //   jokesInstance.state === JokesInstanceAbl.STATE_UNDER_CONSTRUCTION &&
    //   !authorizedProfiles.includes(JokesInstanceAbl.AUTHORITIES) &&
    //   !authorizedProfiles.includes(JokesInstanceAbl.EXECUTIVES)
    // ) {
    //   throw new Errors.Get.JokesInstanceIsUnderConstruction({}, { state: jokesInstance.state });
    // }

    // hds 2, 2.1
    let validationResult = this.validator.validate("jokeGetDtoInType", dtoIn);
    // hds 2.2, 2.3, A4, A5
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.getUnsupportedKeys.code,
      Errors.Get.InvalidDtoIn
    );

    // hds 3
    let joke = await this.dao.get(awid, dtoIn.id);
    if (!joke) {
      // A6
      throw new Errors.Get.JokeDoesNotExist(uuAppErrorMap, { jokeId: dtoIn.id });
    }

    // hds 4
    joke.uuAppErrorMap = uuAppErrorMap;
    return joke;
  }
}

module.exports = new GetAbl();
