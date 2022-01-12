"use strict";
const AppClient = require("uu_appg01_server").AppClient;
const UuMt = require("./uu-mt");

class PreferenceProperty extends UuMt {
  /**
   * Get userPreferenceProperty with given code of given user
   * @param code
   * @param scope
   * @returns {Promise<*>}
   */
  async delete(code, scope = "uuAppWorkspace") {
    const ucUri = this.getRequestUri(this.UUMT.USER_PREFERENCE_PROPERTY.DELETE);
    const dtoIn = {
      code,
      scope,
    };

    return await AppClient.post(ucUri, dtoIn, this.callOpts);
  }

  async loadFirst(codeList, scope = "uuAppWorkspace") {
    const ucUri = this.getRequestUri(this.UUMT.USER_PREFERENCE_PROPERTY.LOADFIRST);
    const dtoIn = {
      codeList,
    };

    return await AppClient.get(ucUri, dtoIn, this.callOpts);
  }

  /**
   * Creates or updates userPreferenceProperty of given user
   * @param code
   * @param data
   * @param scope
   * @returns {Promise<*>}
   */
  async createOrUpdate(code, data, scope = "uuAppWorkspace") {
    const ucUri = this.getRequestUri(this.UUMT.USER_PREFERENCE_PROPERTY.CREATEORUPDATE);
    const dtoIn = {
      scope,
      code,
      data,
    };

    return await AppClient.post(ucUri, dtoIn, this.callOpts);
  }
}

module.exports = PreferenceProperty;
