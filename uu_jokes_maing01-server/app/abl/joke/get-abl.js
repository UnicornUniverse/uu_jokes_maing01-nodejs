"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const Errors = require("../../api/errors/joke-error");
const Warnings = require("../../api/warnings/joke-warning");
const InstanceChecker = require("../../component/instance-checker");
const { Profiles, Schemas, Jokes } = require("../constants");

class GetAbl {
  constructor() {
    this.validator = Validator.load();
    this.dao = DaoFactory.getDao(Schemas.JOKE);
  }

  async get(awid, dtoIn, authorizationResult) {
    let uuAppErrorMap = {};

    // hds 1
    const allowedStateRules = {
      [Profiles.AUTHORITIES]: new Set([Jokes.States.ACTIVE, Jokes.States.UNDER_CONSTRUCTION, Jokes.States.CLOSED]),
      [Profiles.EXECUTIVES]: new Set([Jokes.States.ACTIVE, Jokes.States.UNDER_CONSTRUCTION]),
      [Profiles.READERS]: new Set([Jokes.States.ACTIVE]),
    };

    await InstanceChecker.ensureInstanceAndState(
      awid,
      allowedStateRules,
      authorizationResult,
      Errors.Get,
      uuAppErrorMap
    );

    // hds 2, 2.1
    const validationResult = this.validator.validate("jokeGetDtoInType", dtoIn);
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
