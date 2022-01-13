"use strict";
//@@viewOn:imports
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const { Validator } = require("uu_appg01_server").Validation;
const { UriBuilder } = require("uu_appg01_server").Uri;

const PreferenceProperty = require("../../component/preference-property");
const Errors = require("../../api/errors/preference-error");
const Warnings = require("../../api/warnings/preference-warning");
//@@viewOff:imports

//@@viewOn:constants
//@@viewOff:constants

//@@viewOn:abl
class CreateOrUpdateAbl {
  constructor() {
    this.validator = Validator.load();
  }

  async createOrUpdate(uri, dtoIn, session) {
    let uuAppErrorMap = {};

    // hds 1 - validate dtoIn
    const validationResult = this.validator.validate("preferenceCreateOrUpdateDtoInType", dtoIn);
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      Warnings.PreferenceCreateOrUpdate.UnsupportedKeys.CODE,
      Errors.PreferenceCreateOrUpdate.InvalidDtoIn
    );

    // hds 2 - parse uuMtUri
    let uuMtUri;

    try {
      uuMtUri = UriBuilder.parse(dtoIn.mtMainBaseUri).toUri();
    } catch (e) {
      throw new Errors.PreferenceCreateOrUpdate.UriCouldNotBeParsed(uuAppErrorMap, e, { uri: dtoIn.mtMainBaseUri });
    }

    // hds 3 - create component instance
    const userPropertyProxy = new PreferenceProperty(uuMtUri, session);
    await userPropertyProxy.setToken(uri);

    // hds 4 - call uuMt
    let result;
    try {
      result = await userPropertyProxy.createOrUpdate(dtoIn.code, dtoIn.data, dtoIn.scope);
    } catch (e) {
      throw new Errors.PreferenceCreateOrUpdate.CreateOrUpdateFailed(uuAppErrorMap, e);
    }

    // hds 5
    return {
      ...result,
      uuAppErrorMap,
    };
  }
}
//@@viewOff:abl

//@@viewOn:exports
module.exports = new CreateOrUpdateAbl();
//@@viewOff:exports
