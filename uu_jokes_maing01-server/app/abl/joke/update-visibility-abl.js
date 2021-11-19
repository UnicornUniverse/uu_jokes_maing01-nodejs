"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory, ObjectStoreError } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
// TODO Add InstanceChecker
const Errors = require("../api/errors/joke-error");
const Path = require("path");

const WARNINGS = {
  updateVisibilityUnsupportedKeys: {
    code: `${Errors.UpdateVisibility.UC_CODE}unsupportedKeys`,
  },
};

class JokeAbl {
  constructor() {
    this.validator = new Validator(Path.join(__dirname, "..", "api", "validation_types", "joke-types.js"));
    this.dao = DaoFactory.getDao("joke");
  }

  async updateVisibility(awid, dtoIn) {
    // hds 1, A1, hds 1.1, A2
    // TODO Add InstanceChecker
    // await JokesInstanceAbl.checkInstance(
    //   awid,
    //   Errors.UpdateVisibility.JokesInstanceDoesNotExist,
    //   Errors.UpdateVisibility.JokesInstanceNotInProperState
    // );

    // hds 2, 2.1
    let validationResult = this.validator.validate("jokeUpdateVisibilityDtoInType", dtoIn);
    // hds 2.2, 2.3, A3, A4
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.updateVisibilityUnsupportedKeys.code,
      Errors.UpdateVisibility.InvalidDtoIn
    );

    // hds 3
    let joke;
    try {
      joke = await this.dao.updateVisibility(awid, dtoIn.id, dtoIn.visibility);
    } catch (e) {
      if (e instanceof ObjectStoreError) {
        // A5
        throw new Errors.UpdateVisibility.JokeDaoUpdateVisibilityFailed({ uuAppErrorMap }, e);
      }
      throw e;
    }

    // hds 4
    joke.uuAppErrorMap = uuAppErrorMap;
    return joke;
  }
}

module.exports = new JokeAbl();
