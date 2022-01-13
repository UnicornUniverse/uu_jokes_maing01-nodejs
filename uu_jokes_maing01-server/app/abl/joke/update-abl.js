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

class UpdateAbl {
  constructor() {
    this.validator = Validator.load();
    this.dao = DaoFactory.getDao(Constants.Schemas.JOKE);
  }

  async update(awid, dtoIn, session, authorizationResult) {
    let uuAppErrorMap = {};

    // hds 1, A1, hds 1.1, A2
    await InstanceChecker.ensureInstanceAndState(
      awid,
      new Set([Constants.Jokes.States.ACTIVE]),
      Errors.Update,
      uuAppErrorMap
    );

    // hds 2, 2.1
    const validationResult = this.validator.validate("jokeUpdateDtoInType", dtoIn);
    // hds 2.2, 2.3, A3, A4
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      uuAppErrorMap,
      Warnings.Update.UnsupportedKeys.code,
      Errors.Update.InvalidDtoIn
    );

    // hds 3
    const joke = await this.dao.get(awid, dtoIn.id);
    // A5
    if (!joke) {
      throw new Errors.Update.JokeDoesNotExist({ uuAppErrorMap }, { jokeId: dtoIn.id });
    }

    // hds 4
    const invalidText = "text" in dtoIn && dtoIn.text.trim().length === 0;
    if (invalidText && !dtoIn.image && !joke.image) {
      throw new Errors.Update.InvalidName(uuAppErrorMap, { text: dtoIn.text });
    }

    // hds 5
    if (dtoIn.deleteImage && invalidText && !joke.text) {
      throw new Errors.Update.ImageCannotBeDeleted(uuAppErrorMap);
    }

    // hds 6
    const uuIdentity = session.getIdentity().getUuIdentity();
    const isAuthorities = authorizationResult.getAuthorizedProfiles().includes(Constants.Profiles.AUTHORITIES);
    // A6
    if (uuIdentity !== joke.uuIdentity && !isAuthorities) {
      throw new Errors.Update.UserNotAuthorized({ uuAppErrorMap });
    }

    // hds 7
    const toUpdate = { ...dtoIn };
    delete toUpdate.deleteImage;
    // note: empty array is valid (possibility to remove all categories)
    if (dtoIn.categoryIdList) {
      const { validCategories, invalidCategories } = await Joke.checkCategoriesExistence(awid, dtoIn.categoryIdList);
      // A7
      if (invalidCategories.length > 0) {
        ValidationHelper.addWarning(
          uuAppErrorMap,
          Warnings.Update.CategoryDoesNotExist.code,
          Warnings.Update.CategoryDoesNotExist.message,
          { categoryIdList: invalidCategories }
        );
      }
      toUpdate.categoryIdList = validCategories;
    }

    // hds 8
    if (dtoIn.image) {
      let binary;
      const image = await Joke.checkAndGetImageAsStream(dtoIn.image, Errors.Update);
      if (!joke.image) {
        // hds 8.1
        try {
          binary = await UuBinaryAbl.createBinary(awid, { data: image });
        } catch (e) {
          // A8
          throw new Errors.Update.UuBinaryCreateFailed({ uuAppErrorMap }, e);
        }
      } else {
        // hds 8.2
        try {
          binary = await UuBinaryAbl.updateBinaryData(awid, {
            data: image,
            code: joke.image,
            revisionStrategy: "NONE",
          });
        } catch (e) {
          // A9
          throw new Errors.Update.UuBinaryUpdateBinaryDataFailed({ uuAppErrorMap }, e);
        }
      }
      toUpdate.image = binary.code;
    }

    // hds 9
    if (dtoIn.deleteImage && joke.image) {
      await UuBinaryAbl.deleteBinary(awid, {
        code: joke.image,
        revisionStrategy: "NONE",
      });
      toUpdate.image = null;
    }

    // hds 10
    toUpdate.awid = awid;
    let updatedJoke;
    try {
      updatedJoke = await this.dao.update(toUpdate);
    } catch (e) {
      if (e instanceof ObjectStoreError) {
        // A10
        throw new Errors.Update.JokeDaoUpdateFailed({ uuAppErrorMap }, e);
      }
      throw e;
    }

    // hds 11
    const dtoOut = {
      ...updatedJoke,
      uuAppErrorMap,
    };

    return dtoOut;
  }
}

module.exports = new UpdateAbl();
