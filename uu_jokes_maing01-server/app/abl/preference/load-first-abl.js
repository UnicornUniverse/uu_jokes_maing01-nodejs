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
class LoadFirstAbl {
  constructor() {
    this.validator = Validator.load();
  }

  async loadFirst(uri, dtoIn, session) {
    let uuAppErrorMap = {};

    // hds 1 - validate dtoIn
    const validationResult = this.validator.validate("preferenceLoadFirstDtoInType", dtoIn);
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      Warnings.PreferenceLoadFirst.UnsupportedKeys.CODE,
      Errors.PreferenceLoadFirst.InvalidDtoIn
    );

    // hds 2 - parse uuMtUri
    let uuMtUri;

    try {
      uuMtUri = UriBuilder.parse(dtoIn.mtMainBaseUri).toUri();
    } catch (e) {
      throw new Errors.PreferenceLoadFirst.UriCouldNotBeParsed(uuAppErrorMap, e, { uri: dtoIn.mtMainBaseUri });
    }

    // hds 3 - create component instance
    const userPropertyProxy = new PreferenceProperty(uuMtUri, session);
    await userPropertyProxy.setToken(uri);

    // hds 4 - call uuMt
    let uuMtProperty;
    try {
      uuMtProperty = await userPropertyProxy.loadFirst(dtoIn.codeList);
    } catch (e) {
      throw new Errors.PreferenceLoadFirst.LoadFirstFailed(uuAppErrorMap, e);
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
module.exports = new LoadFirstAbl();
//@@viewOff:exports
