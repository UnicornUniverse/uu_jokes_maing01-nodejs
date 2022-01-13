"use strict";

const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
// TODO Fix
//const JokesInstanceAbl = require("./jokes-instance-abl");
const Errors = require("../../api/errors/category-error");
const Path = require("path");

const WARNINGS = {
  getUnsupportedKeys: {
    code: `${Errors.Get.UC_CODE}unsupportedKeys`,
  },
};

class GetAbl {
  constructor() {
    // Isn't it better, without using new Validator and Path?
    this.validator = Validator.load();
    //this.validator = new Validator(Path.join(__dirname, "..", "..", "api", "validation_types", "category-types.js"));
    this.dao = DaoFactory.getDao("category");
    this.jokeDao = DaoFactory.getDao("joke");
  }

  async get(awid, dtoIn, authorizationResult) {
    // TODO Add InstanceChecker
    // hds 1, A1, hds 1.1, A2
    // let jokesInstance = await JokesInstanceAbl.checkInstance(
    //   awid,
    //   Errors.Get.JokesInstanceDoesNotExist,
    //   Errors.Get.JokesInstanceNotInProperState
    // );
    // // A3
    // let authorizedProfiles = authorizationResult.getAuthorizedProfiles();
    // if (
    //   jokesInstance.state === JokesInstanceAbl.STATE_UNDER_CONSTRUCTION &&
    //   !authorizedProfiles.includes(JokesInstanceAbl.AUTHORITIES) &&
    //   !authorizedProfiles.includes(JokesInstanceAbl.EXECUTIVES)
    // ) {
    //   throw new Errors.Get.JokesInstanceIsUnderConstruction({}, { state: jokesInstance.state });
    // }

    // hds 2, 2.1
    let validationResult = this.validator.validate("categoryGetDtoInType", dtoIn);
    // hds 2.2, 2.3, A4, A5
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.getUnsupportedKeys.code,
      Errors.Get.InvalidDtoIn
    );

    // hds 3
    let category;
    if (dtoIn.id) {
      category = await this.dao.get(awid, dtoIn.id);
    } else {
      category = await this.dao.getByName(awid, dtoIn.name);
    }
    // A6
    if (!category) {
      let paramMap = {};
      if (dtoIn.id) paramMap.categoryId = dtoIn.id;
      if (dtoIn.name) paramMap.categoryName = dtoIn.name;
      throw new Errors.Get.CategoryDoesNotExist({ uuAppErrorMap }, paramMap);
    }

    // hds 4
    category.uuAppErrorMap = uuAppErrorMap;
    return category;
  }
}

module.exports = new GetAbl();
