const InitAbl = require("../../abl/jokes/init-abl");
const PlugInBtAbl = require("../../abl/jokes/plug-in-bt-abl");
const GetAbl = require("../../abl/jokes/get-abl");
const LoadAbl = require("../../abl/jokes/load-abl");
const UpdateAbl = require("../../abl/jokes/update-abl");
const SetStateAbl = require("../../abl/jokes/set-state-abl");
const MigrateAbl = require("../../abl/jokes/migrate-abl");

class JokesController {
  static init(ucEnv) {
    return InitAbl.init(ucEnv.getUri(), ucEnv.getDtoIn(), ucEnv.getSession());
  }

  static plugInBt(ucEnv) {
    return PlugInBtAbl.plugInBt(ucEnv.getUri(), ucEnv.getDtoIn(), ucEnv.getSession(), ucEnv.getAuthorizationResult());
  }

  static get(ucEnv) {
    return GetAbl.get(ucEnv.getUri());
  }

  static load(ucEnv) {
    return LoadAbl.load(ucEnv.getUri(), ucEnv.getSession());
  }

  static update(ucEnv) {
    return UpdateAbl.update(ucEnv.getUri(), ucEnv.getDtoIn(), ucEnv.getSession(), ucEnv.getAuthorizationResult());
  }

  static setState(ucEnv) {
    return SetStateAbl.setState(ucEnv.getUri(), ucEnv.getDtoIn(), ucEnv.getSession(), ucEnv.getAuthorizationResult());
  }

  static migrate(ucEnv) {
    return MigrateAbl.migrate(ucEnv.getDtoIn());
  }
}

module.exports = JokesController;
