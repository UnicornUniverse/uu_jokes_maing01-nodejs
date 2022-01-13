const LoadFirstAbl = require("../../abl/preference/load-first-abl");
const CreateOrUpdateAbl = require("../../abl/preference/create-or-update-abl");
const DeleteAbl = require("../../abl/preference/delete-abl");

class PreferenceController {
  static loadFirst(ucEnv) {
    return LoadFirstAbl.loadFirst(ucEnv.getUri(), ucEnv.getDtoIn(), ucEnv.getSession());
  }

  static createOrUpdate(ucEnv) {
    return CreateOrUpdateAbl.createOrUpdate(ucEnv.getUri(), ucEnv.getDtoIn(), ucEnv.getSession());
  }

  static delete(ucEnv) {
    return DeleteAbl.delete(ucEnv.getUri(), ucEnv.getDtoIn(), ucEnv.getSession());
  }
}

module.exports = PreferenceController;
