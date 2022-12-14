"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory, ObjectStoreError } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const InstanceChecker = require("../../component/instance-checker");
const Errors = require("../../api/errors/category-error");
const Warnings = require("../../api/warnings/category-warning");
const { Profiles, Schemas, Jokes } = require("../constants");

class DeleteAbl {
  constructor() {
    this.validator = Validator.load();
    this.dao = DaoFactory.getDao(Schemas.CATEGORY);
    this.jokeDao = DaoFactory.getDao(Schemas.JOKE);
  }

  async delete(awid, dtoIn, authorizationResult) {
    let uuAppErrorMap = {};

    // hds 1, 1.1
    const validationResult = this.validator.validate("categoryDeleteDtoInType", dtoIn);
    // hds 1.2, 1.3, A1, A2
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      uuAppErrorMap,
      Warnings.Delete.UnsupportedKeys.code,
      Errors.Delete.InvalidDtoIn
    );

    // hds 2
    const allowedStateRules = {
      [Profiles.AUTHORITIES]: new Set([Jokes.States.ACTIVE, Jokes.States.UNDER_CONSTRUCTION]),
      [Profiles.EXECUTIVES]: new Set([Jokes.States.ACTIVE, Jokes.States.UNDER_CONSTRUCTION]),
    };

    await InstanceChecker.ensureInstanceAndState(
      awid,
      allowedStateRules,
      authorizationResult,
      Errors.Delete,
      uuAppErrorMap
    );

    // hds 3
    if (!dtoIn.forceDelete) {
      // hds 3.1
      const count = await this.jokeDao.getCountByCategoryId(awid, dtoIn.id);
      if (count !== 0) {
        throw new Errors.Delete.RelatedJokesExist({ uuAppErrorMap }, { relatedJokes: count });
      }
    } else {
      // hds 3.2
      try {
        await this.jokeDao.removeCategory(awid, dtoIn.id);
      } catch (e) {
        if (e instanceof ObjectStoreError) {
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
