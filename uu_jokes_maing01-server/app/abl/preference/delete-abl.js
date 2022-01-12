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
class DeleteAbl {
  constructor() {
    this.validator = Validator.load();
  }

  async delete(uri, dtoIn, session) {
    let uuAppErrorMap = {};

    // hds 1 - validate dtoIn
    const validationResult = this.validator.validate("preferenceDeleteDtoInType", dtoIn);
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      Warnings.PreferenceDelete.UnsupportedKeys.CODE,
      Errors.PreferenceDelete.InvalidDtoIn
    );

    // hds 2 - parse uuMtUri
    let uuMtUri;

    try {
      uuMtUri = UriBuilder.parse(dtoIn.mtMainBaseUri).toUri();
    } catch (e) {
      throw new Errors.PreferenceDelete.UriCouldNotBeParsed(uuAppErrorMap, e, { uri: dtoIn.mtMainBaseUri });
    }

    // hds 3 - create component instance
    const userPropertyProxy = new PreferenceProperty(uuMtUri, session);
    await userPropertyProxy.setToken(uri);

    // hds 4 - call uuMt
    let uuMtProperty;

    try {
      uuMtProperty = await userPropertyProxy.delete(dtoIn.code, dtoIn.scope);
    } catch (e) {
      throw new Errors.PreferenceDelete.DeleteFailed(uuAppErrorMap, e);
    }

    // hds 5
    return {
      ...uuMtProperty,
      uuAppErrorMap,
    };
  }
}
//@@viewOff:abl

//@@viewOn:exports
module.exports = new DeleteAbl();
//@@viewOff:exports
