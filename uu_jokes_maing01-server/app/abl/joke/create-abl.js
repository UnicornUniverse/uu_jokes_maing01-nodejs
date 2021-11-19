"use strict";
const { Base64 } = require("uu_appg01_server").Utils;
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory, ObjectStoreError } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const { UuBinaryAbl } = require("uu_appg01_binarystore-cmd");
// TODO Add InstanceChecker
const { Profiles } = require("../constants");
const Errors = require("../../api/errors/joke-error");
const Path = require("path");
const FileHelper = require("../../helpers/file-helper");

const WARNINGS = {
  createUnsupportedKeys: {
    code: `${Errors.Create.UC_CODE}unsupportedKeys`,
  },
  createCategoryDoesNotExist: {
    code: `${Errors.Create.UC_CODE}categoryDoesNotExist`,
    message: "One or more categories with given categoryId do not exist.",
  },
};

class CreateAbl {
  constructor() {
    this.validator = new Validator(Path.join(__dirname, "..", "api", "validation_types", "joke-types.js"));
    this.dao = DaoFactory.getDao("joke");
    this.categoryDao = DaoFactory.getDao("category");
  }

  async create(awid, dtoIn, session, authorizationResult) {
    // hds 1, A1, hds 1.1, A2
    // TODO Add InstanceChecer
    // await JokesInstanceAbl.checkInstance(
    //   awid,
    //   Errors.Create.JokesInstanceDoesNotExist,
    //   Errors.Create.JokesInstanceNotInProperState
    // );

    // hds 2, 2.1
    let validationResult = this.validator.validate("jokeCreateDtoInType", dtoIn);
    // hds 2.2, 2.3, A3, A4
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.createUnsupportedKeys.code,
      Errors.Create.InvalidDtoIn
    );
    // hds 2.4
    dtoIn.averageRating = 0;
    dtoIn.ratingCount = 0;
    dtoIn.visibility = authorizationResult.getAuthorizedProfiles().includes(Profiles.AUTHORITIES);
    dtoIn.uuIdentity = session.getIdentity().getUuIdentity();
    dtoIn.uuIdentityName = session.getIdentity().getName();
    dtoIn.awid = awid;

    // hds 3.1, A5
    if (dtoIn.image) {
      //check if stream or base64
      if (dtoIn.image.readable) {
        //check if the stream is valid
        let { valid: isValidStream, stream } = await FileHelper.validateImageStream(dtoIn.image);
        if (!isValidStream) {
          throw new Errors.Create.InvalidPhotoContentType({ uuAppErrorMap });
        }
        dtoIn.image = stream;
      } else {
        //check if the base64 is valid
        let binaryBuffer = Base64.urlSafeDecode(dtoIn.image, "binary");
        if (!FileHelper.validateImageBuffer(binaryBuffer).valid) {
          throw new Errors.Create.InvalidPhotoContentType({ uuAppErrorMap });
        }

        dtoIn.image = FileHelper.toStream(binaryBuffer);
      }

      //hds 3.2
      try {
        let binary = await UuBinaryAbl.createBinary(awid, { data: dtoIn.image });
        dtoIn.image = binary.code;
      } catch (e) {
        // A6
        throw new Errors.Create.UuBinaryCreateFailed({ uuAppErrorMap }, e);
      }
    }

    // hds 4
    if (dtoIn.categoryList && dtoIn.categoryList.length) {
      let presentCategories = await this._checkCategoriesExistence(awid, dtoIn.categoryList);
      // A7
      if (dtoIn.categoryList.length > 0) {
        ValidationHelper.addWarning(
          uuAppErrorMap,
          WARNINGS.createCategoryDoesNotExist.code,
          WARNINGS.createCategoryDoesNotExist.message,
          { categoryList: [...new Set(dtoIn.categoryList)] }
        );
      }
      dtoIn.categoryList = [...new Set(presentCategories)];
    } else {
      dtoIn.categoryList = [];
    }

    // hds 5
    let joke;
    try {
      joke = await this.dao.create(dtoIn);
    } catch (e) {
      // A8
      if (e instanceof ObjectStoreError) {
        throw new Errors.Create.JokeDaoCreateFailed({ uuAppErrorMap }, e);
      }
      throw e;
    }

    // hds 6
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

module.exports = new CreateAbl();
