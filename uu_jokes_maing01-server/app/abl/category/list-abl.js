"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const InstanceChecker = require("../../component/instance-checker");
const Errors = require("../../api/errors/category-error");
const Warnings = require("../../api/warnings/category-warning");
const { Profiles, Schemas, Jokes } = require("../constants");

const DEFAULTS = {
  order: "asc",
  pageIndex: 0,
  pageSize: 100,
};

class ListAbl {
  constructor() {
    this.validator = Validator.load();
    this.dao = DaoFactory.getDao(Schemas.CATEGORY);
    this.jokeDao = DaoFactory.getDao(Schemas.JOKE);
  }
  async list(awid, dtoIn, authorizationResult) {
    let uuAppErrorMap = {};

    // hds 1
    const allowedStateRules = {
      [Profiles.AUTHORITIES]: new Set([Jokes.States.ACTIVE, Jokes.States.UNDER_CONSTRUCTION, Jokes.States.CLOSED]),
      [Profiles.EXECUTIVES]: new Set([Jokes.States.ACTIVE, Jokes.States.UNDER_CONSTRUCTION]),
      [Profiles.READERS]: new Set([Jokes.States.ACTIVE]),
    };

    await InstanceChecker.ensureInstanceAndState(
      awid,
      allowedStateRules,
      authorizationResult,
      Errors.List,
      uuAppErrorMap
    );

    // hds 2, 2.1
    const validationResult = this.validator.validate("categoryListDtoInType", dtoIn);
    // hds 2.2, 2.3, A4, A5
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      uuAppErrorMap,
      Warnings.List.UnsupportedKeys.code,
      Errors.List.InvalidDtoIn
    );

    // hds 2.4
    if (!dtoIn.pageInfo) dtoIn.pageInfo = {};
    if (!dtoIn.pageInfo.pageSize) dtoIn.pageInfo.pageSize = DEFAULTS.pageSize;
    if (!dtoIn.pageInfo.pageIndex) dtoIn.pageInfo.pageIndex = DEFAULTS.pageIndex;
    if (!dtoIn.order) dtoIn.order = DEFAULTS.order;

    // hds 3
    const list = await this.dao.list(awid, dtoIn.order, dtoIn.pageInfo);

    // hds 4
    const dtoOut = {
      ...list,
      uuAppErrorMap,
    };

    return dtoOut;
  }
}

module.exports = new ListAbl();
