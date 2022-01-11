"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const Errors = require("../../api/errors/joke-error");
const Warnings = require("../../api/warnings/joke-warning");
const InstanceChecker = require("../components/instance-checker");
const Constants = require("../constants");

const DEFAULTS = {
  sortBy: "name",
  order: "asc",
  pageIndex: 0,
  pageSize: 100,
};

class ListAbl {
  constructor() {
    this.validator = Validator.load();
    this.dao = DaoFactory.getDao(Constants.Schemas.JOKE);
  }

  async list(awid, dtoIn) {
    let uuAppErrorMap = {};

    // hds 1, A1, hds 1.1, A2
    await InstanceChecker.ensureInstanceAndState(
      awid,
      new Set([Constants.Jokes.States.ACTIVE]),
      Errors.List,
      uuAppErrorMap
    );

    // hds 2, 2.1
    const validationResult = this.validator.validate("jokeListDtoInType", dtoIn);
    // hds 2.2, 2.3, A4, A5
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      uuAppErrorMap,
      Warnings.List.UnsupportedKeys.code,
      Errors.List.InvalidDtoIn
    );

    // hds 2.4
    if (!dtoIn.sortBy) dtoIn.sortBy = DEFAULTS.sortBy;
    if (!dtoIn.order) dtoIn.order = DEFAULTS.order;
    if (!dtoIn.pageInfo) dtoIn.pageInfo = {};
    if (!dtoIn.pageInfo.pageSize) dtoIn.pageInfo.pageSize = DEFAULTS.pageSize;
    if (!dtoIn.pageInfo.pageIndex) dtoIn.pageInfo.pageIndex = DEFAULTS.pageIndex;

    // hds 3
    let list;
    if (dtoIn.categoryIdList) {
      list = await this.dao.listByCategoryIdList(awid, dtoIn.categoryIdList, dtoIn.sortBy, dtoIn.order, dtoIn.pageInfo);
    } else {
      list = await this.dao.list(awid, dtoIn.sortBy, dtoIn.order, dtoIn.pageInfo);
    }

    // hds 4
    list.uuAppErrorMap = uuAppErrorMap;
    return list;
  }
}

module.exports = new ListAbl();
