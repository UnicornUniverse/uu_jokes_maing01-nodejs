"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;

const Errors = require("../../api/errors/jokes-error");
const InstanceChecker = require("../../component/instance-checker");
const Constants = require("../constants");

class GetAbl {
  constructor() {
    this.validator = Validator.load();
    this.dao = DaoFactory.getDao(Constants.Schemas.JOKES);
  }

  async get(uri, uuAppErrorMap = {}) {
    const jokes = await InstanceChecker.ensureInstance(uri.getAwid(), Errors.Get, uuAppErrorMap);
    return { ...jokes, uuAppErrorMap };
  }
}

module.exports = new GetAbl();
