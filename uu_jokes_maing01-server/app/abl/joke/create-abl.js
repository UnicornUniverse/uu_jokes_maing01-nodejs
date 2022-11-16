"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory, ObjectStoreError } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const { BinaryComponent, AppBinaryStoreError } = require("uu_appbinarystoreg02");
const Errors = require("../../api/errors/joke-error");
const Warnings = require("../../api/warnings/joke-warning");
const InstanceChecker = require("../../component/instance-checker");
const Joke = require("../../component/joke");
const { Profiles, Schemas, Jokes } = require("../constants");

class CreateAbl {
  constructor() {
    this.validator = Validator.load();
    this.dao = DaoFactory.getDao(Schemas.JOKE);
    this.binaryComponent = new BinaryComponent();
  }

  async create(awid, dtoIn, session, authorizationResult) {
    let uuAppErrorMap = {};

    // hds 1, 1.1
    const validationResult = this.validator.validate("jokeCreateDtoInType", dtoIn);
    // hds 1.2, 1.3, A1, A2
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      uuAppErrorMap,
      Warnings.Create.UnsupportedKeys.code,
      Errors.Create.InvalidDtoIn
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
      Errors.Create,
      uuAppErrorMap
    );

    const addedValues = {
      averageRating: 0,
      ratingCount: 0,
      visibility: authorizationResult.getAuthorizedProfiles().includes(Profiles.AUTHORITIES),
      uuIdentity: session.getIdentity().getUuIdentity(),
      uuIdentityName: session.getIdentity().getName(),
    };

    const uuObject = {
      ...dtoIn,
      ...addedValues,
    };

    // hds 3
    if ("text" in dtoIn && dtoIn.text.trim().length === 0 && !dtoIn.image) {
      throw new Errors.Create.InvalidText(uuAppErrorMap, { text: dtoIn.text });
    }

    // hds 4
    if (dtoIn.image) {
      const image = await Joke.checkAndGetImageAsStream(dtoIn.image, Errors.Create, uuAppErrorMap);

      try {
        const binary = await this.binaryComponent.create(awid, {
          data: image,
          filename: dtoIn.image.filename,
          contentType: dtoIn.image.contentType,
        });
        uuObject.image = binary.code;
      } catch (e) {
        if (e instanceof AppBinaryStoreError) {
          throw new Errors.Create.UuBinaryCreateFailed({ uuAppErrorMap }, e);
        } else {
          throw e;
        }
      }
    }

    // hds 5
    if (dtoIn.categoryIdList && dtoIn.categoryIdList.length) {
      const { validCategories, invalidCategories } = await Joke.checkCategoriesExistence(awid, dtoIn.categoryIdList);
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

    // hds 6
    uuObject.awid = awid;
    let joke;

    try {
      joke = await this.dao.create(uuObject);
    } catch (e) {
      if (e instanceof ObjectStoreError) {
        throw new Errors.Create.JokeDaoCreateFailed({ uuAppErrorMap }, e);
      }
      throw e;
    }

    // hds 7
    const dtoOut = {
      ...joke,
      uuAppErrorMap,
    };

    return dtoOut;
  }
}

module.exports = new CreateAbl();
