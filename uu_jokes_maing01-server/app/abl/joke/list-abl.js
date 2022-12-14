"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const Errors = require("../../api/errors/joke-error");
const Warnings = require("../../api/warnings/joke-warning");
const InstanceChecker = require("../../component/instance-checker");
const { Profiles, Schemas, Jokes } = require("../constants");

const DEFAULTS = {
  sortBy: "name",
  order: "asc",
  pageIndex: 0,
  pageSize: 100,
};

class ListAbl {
  constructor() {
    this.validator = Validator.load();
    this.dao = DaoFactory.getDao(Schemas.JOKE);
  }

  async list(awid, dtoIn, session, authorizationResult) {
    let uuAppErrorMap = {};

    // hds 1, 1.1
    const validationResult = this.validator.validate("jokeListDtoInType", dtoIn);
    // hds 1.2, 1.3, A1, A2
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      uuAppErrorMap,
      Warnings.List.UnsupportedKeys.code,
      Errors.List.InvalidDtoIn
    );

    // hds 1.4
    if (!dtoIn.sortBy) dtoIn.sortBy = DEFAULTS.sortBy;
    if (!dtoIn.order) dtoIn.order = DEFAULTS.order;
    if (!dtoIn.pageInfo) dtoIn.pageInfo = {};
    if (!dtoIn.pageInfo.pageSize) dtoIn.pageInfo.pageSize = DEFAULTS.pageSize;
    if (!dtoIn.pageInfo.pageIndex) dtoIn.pageInfo.pageIndex = DEFAULTS.pageIndex;

    // hds 2
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

    // hds 3
    const profiles = authorizationResult.getUuIdentityProfileList();

    let criteria = {
      visibility: dtoIn.visibility,
    };

    if (dtoIn.categoryIdList) {
      criteria.categoryIdList = dtoIn.categoryIdList;
    }

    if (!profiles.includes(Profiles.AUTHORITIES)) {
      if (!profiles.includes(Profiles.EXECUTIVES)) {
        criteria.visibility = true;
      } else {
        criteria.uuIdentity = session.getIdentity().getUuIdentity();
        criteria.onlyOwnOrVisible = true;
      }
    }

    let sortBy = dtoIn.sortBy === "createTs" ? "sys.cts" : dtoIn.sortBy;
    sortBy = sortBy ?? "name";
    let order = dtoIn.order ?? "asc";

    const list = await this.dao.list(awid, criteria, sortBy, order, dtoIn.pageInfo);

    // hds 4
    const dtoOut = {
      ...list,
      uuAppErrorMap,
    };

    return dtoOut;
  }
}

module.exports = new ListAbl();
