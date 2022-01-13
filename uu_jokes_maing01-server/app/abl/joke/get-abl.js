"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const Errors = require("../../api/errors/joke-error");
const Warnings = require("../../api/warnings/joke-warning");
const InstanceChecker = require("../components/instance-checker");
const Constants = require("../constants");

class GetAbl {
  constructor() {
    this.validator = Validator.load();
    this.dao = DaoFactory.getDao(Constants.Schemas.JOKE);
  }

  async get(awid, dtoIn) {
    let uuAppErrorMap = {};

    // hds 1, A1, hds 1.1, A2
    await InstanceChecker.ensureInstanceAndState(
      awid,
      new Set([Constants.Jokes.States.ACTIVE]),
      Errors.Get,
      uuAppErrorMap
    );

    // hds 2, 2.1
    const validationResult = this.validator.validate("jokeGetDtoInType", dtoIn);
    // hds 2.2, 2.3, A4, A5
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      uuAppErrorMap,
      Warnings.Get.UnsupportedKeys.code,
      Errors.Get.InvalidDtoIn
    );

    // hds 3
    const joke = await this.dao.get(awid, dtoIn.id);
    if (!joke) {
      // A6
      throw new Errors.Get.JokeDoesNotExist(uuAppErrorMap, { jokeId: dtoIn.id });
    }

    // hds 4
    const dtoOut = {
      ...joke,
      uuAppErrorMap,
    };

    return dtoOut;
  }
}

module.exports = new GetAbl();
