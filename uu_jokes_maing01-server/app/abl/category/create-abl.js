"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory, ObjectStoreError, DuplicateKey } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
// TODO Fix
//const JokesInstanceAbl = require("./jokes-instance-abl");
const Errors = require("../../api/errors/category-error");
const Path = require("path");

const WARNINGS = {
  createUnsupportedKeys: {
    code: `${Errors.Create.UC_CODE}unsupportedKeys`,
  },
};
const DEFAULT_ICON = "mdi-label";

class CreateAbl {
  constructor() {
    // Isn't it better, without using new Validator and Path?
    this.validator = Validator.load();
    //this.validator = new Validator(Path.join(__dirname, "..", "..", "api", "validation_types", "category-types.js"));
    this.dao = DaoFactory.getDao("category");
    this.jokeDao = DaoFactory.getDao("joke");
  }

  async create(awid, dtoIn) {
    // hds 1, A1, hds 1.1, A2
    // TODO Add InstanceChecker
    // await JokesInstanceAbl.checkInstance(
    //   awid,
    //   Errors.Create.JokesInstanceDoesNotExist,
    //   Errors.Create.JokesInstanceNotInProperState
    // );

    // hds 2, 2.1
    let validationResult = this.validator.validate("categoryCreateDtoInType", dtoIn);
    // hds 2.2, 2.3, A3, A4
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.createUnsupportedKeys.code,
      Errors.Create.InvalidDtoIn
    );
    // hds 2.4
    if (!dtoIn.icon) dtoIn.icon = DEFAULT_ICON;
    dtoIn.awid = awid;

    // hds 3
    let category;
    try {
      category = await this.dao.create(dtoIn);
    } catch (e) {
      if (e instanceof DuplicateKey) {
        // A5
        throw new Errors.Create.CategoryNameNotUnique({ uuAppErrorMap }, { categoryName: dtoIn.name });
      }
      if (e instanceof ObjectStoreError) {
        // A6
        throw new Errors.Create.CategoryDaoCreateFailed({ uuAppErrorMap }, e);
      }
      throw e;
    }

    // hds 4
    category.uuAppErrorMap = uuAppErrorMap;
    return category;
  }
}

module.exports = new CreateAbl();
