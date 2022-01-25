"use strict";

const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const InstanceChecker = require("../../component/instance-checker");
const Errors = require("../../api/errors/category-error");
const Warnings = require("../../api/warnings/category-warning");
const { Profiles, Schemas, Jokes } = require("../constants");

class GetAbl {
  constructor() {
    this.validator = Validator.load();
    this.dao = DaoFactory.getDao(Schemas.CATEGORY);
    this.jokeDao = DaoFactory.getDao(Schemas.JOKE);
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
    const validationResult = this.validator.validate("categoryGetDtoInType", dtoIn);
    // hds 2.2, 2.3, A4, A5
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      uuAppErrorMap,
      Warnings.Get.UnsupportedKeys.code,
      Errors.Get.InvalidDtoIn
    );

    // hds 3
    let category;
    if (dtoIn.id) {
      category = await this.dao.get(awid, dtoIn.id);
    } else {
      category = await this.dao.getByName(awid, dtoIn.name);
    }
    // A6
    if (!category) {
      let paramMap = {};
      if (dtoIn.id) paramMap.categoryId = dtoIn.id;
      if (dtoIn.name) paramMap.categoryName = dtoIn.name;
      throw new Errors.Get.CategoryDoesNotExist({ uuAppErrorMap }, paramMap);
    }

    // hds 4
    const dtoOut = { ...category, uuAppErrorMap };

    return dtoOut;
  }
}

module.exports = new GetAbl();
