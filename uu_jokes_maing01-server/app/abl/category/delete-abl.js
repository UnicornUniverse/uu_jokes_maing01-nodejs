"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory, ObjectStoreError } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
// TODO Fix
//const JokesInstanceAbl = require("./jokes-instance-abl");
const Errors = require("../../api/errors/category-error");
const Path = require("path");

const WARNINGS = {
  deleteUnsupportedKeys: {
    code: `${Errors.Delete.UC_CODE}unsupportedKeys`,
  },
};

class DeleteAbl {
  constructor() {
    // Isn't it better, without using new Validator and Path?
    this.validator = Validator.load();
    //this.validator = new Validator(Path.join(__dirname, "..", "..", "api", "validation_types", "category-types.js"));
    this.dao = DaoFactory.getDao("category");
    this.jokeDao = DaoFactory.getDao("joke");
  }

  async delete(awid, dtoIn) {
    // hds 1, A1, hds 1.1, A2
    // TODO Add InstanceChecker
    // await JokesInstanceAbl.checkInstance(
    //   awid,
    //   Errors.Delete.JokesInstanceDoesNotExist,
    //   Errors.Delete.JokesInstanceNotInProperState
    // );

    // hds 2, 2.1
    let validationResult = this.validator.validate("categoryDeleteDtoInType", dtoIn);
    // hds 2.2, 2.3, A3, A4
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.deleteUnsupportedKeys.code,
      Errors.Delete.InvalidDtoIn
    );

    // hds 3
    if (!dtoIn.forceDelete) {
      // hds 3.1
      let count;
      try {
        count = await this.jokeDao.getCountByCategoryId(awid, dtoIn.id);
      } catch (e) {
        //  A5
        if (e instanceof ObjectStoreError) {
          throw new Errors.Delete.JokeDaoGetCountByCategoryFailed({ uuAppErrorMap }, e);
        }
        throw e;
      }
      if (count !== 0) {
        // A6
        throw new Errors.Delete.RelatedJokesExist({ uuAppErrorMap }, { relatedJokes: count });
      }
    } else {
      // hds 3.2
      try {
        await this.jokeDao.removeCategory(awid, dtoIn.id);
      } catch (e) {
        if (e instanceof ObjectStoreError) {
          // A7
          throw new Errors.Delete.JokeDaoRemoveCategoryFailed({ uuAppErrorMap }, e);
        }
        throw e;
      }
    }

    // hds 4
    await this.dao.delete(awid, dtoIn.id);

    // hds 5
    return { uuAppErrorMap };
  }
}

module.exports = new DeleteAbl();
