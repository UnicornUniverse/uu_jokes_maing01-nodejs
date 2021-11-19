"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
// TODO Add InstanceChecker
const Errors = require("../api/errors/joke-error");
const Path = require("path");

const WARNINGS = {
  listUnsupportedKeys: {
    code: `${Errors.List.UC_CODE}unsupportedKeys`,
  },
};
const DEFAULTS = {
  sortBy: "name",
  order: "asc",
  pageIndex: 0,
  pageSize: 100,
};

class ListAbl {
  constructor() {
    this.validator = new Validator(Path.join(__dirname, "..", "api", "validation_types", "joke-types.js"));
    this.dao = DaoFactory.getDao("joke");
  }

  async list(awid, dtoIn, authorizationResult) {
    // hds 1, A1, hds 1.1, A2
    // TODO Add InstanceChecker
    // let jokesInstance = await JokesInstanceAbl.checkInstance(
    //   awid,
    //   Errors.List.JokesInstanceDoesNotExist,
    //   Errors.List.JokesInstanceNotInProperState
    // );
    // // A3
    // let authorizedProfiles = authorizationResult.getAuthorizedProfiles();
    // if (
    //   jokesInstance.state === JokesInstanceAbl.STATE_UNDER_CONSTRUCTION &&
    //   !authorizedProfiles.includes(JokesInstanceAbl.AUTHORITIES) &&
    //   !authorizedProfiles.includes(JokesInstanceAbl.EXECUTIVES)
    // ) {
    //   throw new Errors.List.JokesInstanceIsUnderConstruction({}, { state: jokesInstance.state });
    // }

    // hds 2, 2.1
    let validationResult = this.validator.validate("jokeListDtoInType", dtoIn);
    // hds 2.2, 2.3, A4, A5
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.listUnsupportedKeys.code,
      Errors.List.InvalidDtoIn
    );
    // hds 2.4
    if (!dtoIn.sortBy) dtoIn.sortBy = DEFAULTS.sortBy;
    if (!dtoIn.order) dtoIn.order = DEFAULTS.order;
    if (!dtoIn.pageInfo) dtoIn.pageInfo = {};
    if (!dtoIn.pageInfo.pageSize) dtoIn.pageInfo.pageSize = DEFAULTS.pageSize;
    if (!dtoIn.pageInfo.pageIndex) dtoIn.pageInfo.pageIndex = DEFAULTS.pageIndex;

    if (dtoIn.sortBy === "rating") {
      dtoIn.sortBy = "averageRating";
    }
    // hds 3
    let list;
    if (dtoIn.categoryList) {
      list = await this.dao.listByCategoryIdList(awid, dtoIn.categoryList, dtoIn.sortBy, dtoIn.order, dtoIn.pageInfo);
    } else {
      list = await this.dao.list(awid, dtoIn.sortBy, dtoIn.order, dtoIn.pageInfo);
    }

    // hds 4
    list.uuAppErrorMap = uuAppErrorMap;
    return list;
  }
}

module.exports = new ListAbl();
