"use strict";
const Constants = require("../abl/constants");
const { DaoFactory } = require("uu_appg01_server").ObjectStore;

class InstanceChecker {
  constructor() {
    this.dao = DaoFactory.getDao("jokesInstance");
  }

  async checkInstance(awid, instanceDoesNotExistError, instanceIsNotInProperStateError) {
    let jokesInstance = await this.dao.getByAwid(awid);

    if (!jokesInstance) {
      throw new instanceDoesNotExistError();
    }
    if (!Constants.Jokes.NonFinalStates.has(jokesInstance.state)) {
      throw new instanceIsNotInProperStateError();
    }
  }
}

module.exports = new InstanceChecker();
