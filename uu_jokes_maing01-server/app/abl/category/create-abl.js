"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory, ObjectStoreError, DuplicateKey } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const InstanceChecker = require("../../component/instance-checker");
const Errors = require("../../api/errors/category-error");
const Warnings = require("../../api/warnings/category-warning");
const { Schemas, Profiles, Jokes } = require("../constants");

const DEFAULT_ICON = "mdi-label";

class CreateAbl {
  constructor() {
    this.validator = Validator.load();
    this.dao = DaoFactory.getDao(Schemas.CATEGORY);
    this.jokeDao = DaoFactory.getDao(Schemas.JOKE);
  }

  async create(awid, dtoIn, authorizationResult) {
    let uuAppErrorMap = {};

    // hds 1
    const allowedStateRules = {
      [Profiles.AUTHORITIES]: new Set([Jokes.States.ACTIVE, Jokes.States.UNDER_CONSTRUCTION]),
      [Profiles.EXECUTIVES]: new Set([Jokes.States.ACTIVE, Jokes.States.UNDER_CONSTRUCTION]),
    };

    await InstanceChecker.ensureInstanceAndState(
      awid,
      allowedStateRules,
      authorizationResult,
      Errors.Create,
      uuAppErrorMap
    );

    // hds 2, 2.1
    const validationResult = this.validator.validate("categoryCreateDtoInType", dtoIn);
    // hds 2.2, 2.3, A3, A4
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      uuAppErrorMap,
      Warnings.Create.UnsupportedKeys.code,
      Errors.Create.InvalidDtoIn
    );

    // hds 2.4
    if (!dtoIn.icon) dtoIn.icon = DEFAULT_ICON;

    // hds 3
    const uuObject = {
      ...dtoIn,
      awid,
    };

    let category;
    try {
      category = await this.dao.create(uuObject);
    } catch (e) {
      if (e instanceof DuplicateKey) {
        // 3.1
        throw new Errors.Create.CategoryNameNotUnique({ uuAppErrorMap }, { categoryName: dtoIn.name });
      }
      if (e instanceof ObjectStoreError) {
        // 3.2
        throw new Errors.Create.CategoryDaoCreateFailed({ uuAppErrorMap }, e);
      }
      throw e;
    }

    // hds 4
    const dtoOut = {
      ...category,
      uuAppErrorMap,
    };

    return dtoOut;
  }
}

module.exports = new CreateAbl();
