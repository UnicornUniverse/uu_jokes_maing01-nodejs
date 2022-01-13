"use strict";

const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory, ObjectStoreError, DuplicateKey } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
// TODO Fix
//const JokesInstanceAbl = require("./jokes-instance-abl");
const Errors = require("../../api/errors/category-error");
const Path = require("path");

const WARNINGS = {
  updateUnsupportedKeys: {
    code: `${Errors.Update.UC_CODE}unsupportedKeys`,
  },
};

class UpdateAbl {
  constructor() {
    // Isn't it better, without using new Validator and Path?
    this.validator = Validator.load();
    //this.validator = new Validator(Path.join(__dirname, "..", "..", "api", "validation_types", "category-types.js"));
    this.dao = DaoFactory.getDao("category");
    this.jokeDao = DaoFactory.getDao("joke");
  }
  async update(awid, dtoIn) {
    // hds 1, A1, hds 1.1, A2
    // TODO Add InstanceChecker
    // await JokesInstanceAbl.checkInstance(
    //   awid,
    //   Errors.Update.JokesInstanceDoesNotExist,
    //   Errors.Update.JokesInstanceNotInProperState
    // );

    // hds 2, 2.1
    let validationResult = this.validator.validate("categoryUpdateDtoInType", dtoIn);
    // hds 2.2, 2.3, A3, A4
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.updateUnsupportedKeys.code,
      Errors.Update.InvalidDtoIn
    );

    // hds 3
    let category;
    dtoIn.awid = awid;
    try {
      category = await this.dao.update(dtoIn);
    } catch (e) {
      if (e instanceof DuplicateKey) {
        // A5
        throw new Errors.Update.CategoryNameNotUnique({ uuAppErrorMap }, { categoryName: dtoIn.name });
      }
      if (e instanceof ObjectStoreError) {
        // A6
        throw new Errors.Update.CategoryDaoUpdateFailed({ uuAppErrorMap }, e);
      }
      throw e;
    }

    // hds 4
    category.uuAppErrorMap = uuAppErrorMap;
    return category;
  }
}

module.exports = new UpdateAbl();
