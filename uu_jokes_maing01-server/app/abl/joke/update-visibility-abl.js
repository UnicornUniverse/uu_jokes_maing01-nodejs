"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory, ObjectStoreError } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const Errors = require("../../api/errors/joke-error");
const Warnings = require("../../api/warnings/joke-warning");
const InstanceChecker = require("../components/instance-checker");
const Constants = require("../constants");

class JokeAbl {
  constructor() {
    this.validator = Validator.load();
    this.dao = DaoFactory.getDao(Constants.Schemas.JOKE);
  }

  async updateVisibility(awid, dtoIn) {
    let uuAppErrorMap = {};

    // hds 1, A1, hds 1.1, A2
    await InstanceChecker.ensureInstanceAndState(
      awid,
      new Set([Constants.Jokes.States.ACTIVE]),
      Errors.UpdateVisibility,
      uuAppErrorMap
    );

    // hds 2, 2.1
    const validationResult = this.validator.validate("jokeUpdateVisibilityDtoInType", dtoIn);
    // hds 2.2, 2.3, A3, A4
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      uuAppErrorMap,
      Warnings.UpdateVisibility.UnsupportedKeys.code,
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
    const dtoOut = {
      ...joke,
      uuAppErrorMap,
    };

    return dtoOut;
  }
}

module.exports = new JokeAbl();
