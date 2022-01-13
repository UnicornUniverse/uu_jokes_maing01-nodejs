"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory, ObjectStoreError } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const { UuBinaryAbl } = require("uu_appg01_binarystore-cmd");
const Errors = require("../../api/errors/joke-error");
const Warnings = require("../../api/warnings/joke-warning");
const InstanceChecker = require("../components/instance-checker");
const Joke = require("../components/joke");
const Constants = require("../constants");

class CreateAbl {
  constructor() {
    this.validator = Validator.load();
    this.dao = DaoFactory.getDao(Constants.Schemas.JOKE);
  }

  async create(awid, dtoIn, session, authorizationResult) {
    let uuAppErrorMap = {};

    // hds 1, A1, hds 1.1, A2
    await InstanceChecker.ensureInstanceAndState(
      awid,
      new Set([Constants.Jokes.States.ACTIVE]),
      Errors.Create,
      uuAppErrorMap
    );

    // hds 2, 2.1
    const validationResult = this.validator.validate("jokeCreateDtoInType", dtoIn);
    // hds 2.2, 2.3, A3, A4
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      uuAppErrorMap,
      Warnings.Create.UnsupportedKeys.code,
      Errors.Create.InvalidDtoIn
    );

    // hds 3
    if ("text" in dtoIn && dtoIn.text.trim().length === 0) {
      throw new Errors.Create.InvalidName(uuAppErrorMap, { text: dtoIn.text });
    }

    // hds 4
    const addedValues = {
      averageRating: 0,
      ratingCount: 0,
      visibility: authorizationResult.getAuthorizedProfiles().includes(Constants.Profiles.AUTHORITIES),
      uuIdentity: session.getIdentity().getUuIdentity(),
      uuIdentityName: session.getIdentity().getName(),
    };

    const uuObject = {
      ...dtoIn,
      ...addedValues,
    };

    // hds 5.1, A5
    if (dtoIn.image) {
      const image = await Joke.checkAndGetImageAsStream(dtoIn.image, Errors.Create);

      // hds 5.2
      try {
        const binary = await UuBinaryAbl.createBinary(awid, { data: image });
        uuObject.image = binary.code;
      } catch (e) {
        // A6
        throw new Errors.Create.UuBinaryCreateFailed({ uuAppErrorMap }, e);
      }
    }

    // hds 6
    if (dtoIn.categoryIdList && dtoIn.categoryIdList.length) {
      const { validCategories, invalidCategories } = await Joke.checkCategoriesExistence(awid, dtoIn.categoryIdList);
      // A7
      if (invalidCategories.length > 0) {
        ValidationHelper.addWarning(
          uuAppErrorMap,
          Warnings.Create.CategoryDoesNotExist.code,
          Warnings.Create.CategoryDoesNotExist.message,
          { categoryIdList: invalidCategories }
        );
      }
      uuObject.categoryIdList = validCategories;
    } else {
      uuObject.categoryIdList = [];
    }

    // hds 7
    uuObject.awid = awid;
    let joke;

    try {
      joke = await this.dao.create(uuObject);
    } catch (e) {
      // A8
      if (e instanceof ObjectStoreError) {
        throw new Errors.Create.JokeDaoCreateFailed({ uuAppErrorMap }, e);
      }
      throw e;
    }

    // hds 8
    const dtoOut = {
      ...joke,
      uuAppErrorMap,
    };

    return dtoOut;
  }
}

module.exports = new CreateAbl();
