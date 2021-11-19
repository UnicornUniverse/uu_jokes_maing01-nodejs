"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory, ObjectStoreError } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const { UuBinaryAbl } = require("uu_appg01_binarystore-cmd");
// TODO Add InstanceChecker
const { Profiles } = require("../constants");
const Errors = require("../../api/errors/joke-error");
const Path = require("path");

const WARNINGS = {
  updateUnsupportedKeys: {
    code: `${Errors.Update.UC_CODE}unsupportedKeys`,
  },
  updateCategoryDoesNotExist: {
    code: `${Errors.Update.UC_CODE}categoryDoesNotExist`,
    message: "One or more categories with given categoryId do not exist.",
  },
  updateVisibilityUnsupportedKeys: {
    code: `${Errors.UpdateVisibility.UC_CODE}unsupportedKeys`,
  },
};

class UpdateAbl {
  constructor() {
    this.validator = new Validator(Path.join(__dirname, "..", "..", "api", "validation_types", "joke-types.js"));
    this.dao = DaoFactory.getDao("joke");
    this.categoryDao = DaoFactory.getDao("category");
  }

  async update(awid, dtoIn, session, authorizationResult) {
    // hds 1, A1, hds 1.1, A2
    // TODO Add InstanceChecker
    // await JokesInstanceAbl.checkInstance(
    //   awid,
    //   Errors.Update.JokesInstanceDoesNotExist,
    //   Errors.Update.JokesInstanceNotInProperState
    // );

    // hds 2, 2.1
    let validationResult = this.validator.validate("jokeUpdateDtoInType", dtoIn);
    // hds 2.2, 2.3, A3, A4
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.updateUnsupportedKeys.code,
      Errors.Update.InvalidDtoIn
    );

    // hds 3
    let joke = await this.dao.get(awid, dtoIn.id);
    // A5
    if (!joke) {
      throw new Errors.Update.JokeDoesNotExist({ uuAppErrorMap }, { jokeId: dtoIn.id });
    }

    // hds 4
    let uuId = session.getIdentity().getUuIdentity();
    // A6
    if (uuId !== joke.uuIdentity && !authorizationResult.getAuthorizedProfiles().includes(Profiles.AUTHORITIES)) {
      throw new Errors.Update.UserNotAuthorized({ uuAppErrorMap });
    }

    // hds 5
    if (dtoIn.categoryList) {
      let presentCategories = await this._checkCategoriesExistence(awid, dtoIn.categoryList);
      // A7
      if (dtoIn.categoryList.length > 0) {
        ValidationHelper.addWarning(
          uuAppErrorMap,
          WARNINGS.updateCategoryDoesNotExist.code,
          WARNINGS.updateCategoryDoesNotExist.message,
          { categoryList: [...new Set(dtoIn.categoryList)] }
        );
      }
      dtoIn.categoryList = [...new Set(presentCategories)];
    }

    // hds 6
    if (dtoIn.image) {
      let binary;
      if (!joke.image) {
        // hds 6.1
        try {
          binary = await UuBinaryAbl.createBinary(awid, { data: dtoIn.image });
        } catch (e) {
          // A8
          throw new Errors.Update.UuBinaryCreateFailed({ uuAppErrorMap }, e);
        }
      } else {
        // hds 6.2
        try {
          binary = await UuBinaryAbl.updateBinaryData(awid, {
            data: dtoIn.image,
            code: joke.image,
            revisionStrategy: "NONE",
          });
        } catch (e) {
          // A9
          throw new Errors.Update.UuBinaryUpdateBinaryDataFailed({ uuAppErrorMap }, e);
        }
      }
      dtoIn.image = binary.code;
    }

    // hds 7
    try {
      dtoIn.awid = awid;
      joke = await this.dao.update(dtoIn);
    } catch (e) {
      if (e instanceof ObjectStoreError) {
        // A10
        throw new Errors.Update.JokeDaoUpdateFailed({ uuAppErrorMap }, e);
      }
      throw e;
    }

    // hds 8
    joke.uuAppErrorMap = uuAppErrorMap;
    return joke;
  }

  /**
   * Checks whether categories exist for specified awid and removes them from categoryList (so it, in the end, contains
   * only ids of categories, that do not exist).
   * @param {String} awid Used awid
   * @param {Array} categoryList An array with ids of categories
   * @returns {Promise<[]>} Ids of existing categories
   */
  async _checkCategoriesExistence(awid, categoryList) {
    let categories;
    let presentCategories = [];
    let categoryIndex;
    categories = await this.categoryDao.listByCategoryIdList(awid, categoryList);
    categories.itemList.forEach((category) => {
      categoryIndex = categoryList.indexOf(category.id.toString());
      if (categoryIndex !== -1) {
        presentCategories.push(category.id.toString());
        categoryList.splice(categoryIndex, 1);
      }
    });

    return presentCategories;
  }
}

module.exports = new UpdateAbl();
