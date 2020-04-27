"use strict";

const JokeAbl = require("../../abl/joke-abl.js");

class JokeController {
  static create(ucEnv) {
    return JokeAbl.create(ucEnv.getUri().getAwid(), ucEnv.parameters, ucEnv.session, ucEnv.getAuthorizationResult());
  }

  static get(ucEnv) {
    return JokeAbl.get(ucEnv.getUri().getAwid(), ucEnv.parameters, ucEnv.getAuthorizationResult());
  }

  static update(ucEnv) {
    return JokeAbl.update(ucEnv.getUri().getAwid(), ucEnv.parameters, ucEnv.session, ucEnv.getAuthorizationResult());
  }

  static updateVisibility(ucEnv) {
    return JokeAbl.updateVisibility(ucEnv.getUri().getAwid(), ucEnv.parameters);
  }

  static delete(ucEnv) {
    return JokeAbl.delete(ucEnv.getUri().getAwid(), ucEnv.parameters, ucEnv.session, ucEnv.getAuthorizationResult());
  }

  static list(ucEnv) {
    return JokeAbl.list(ucEnv.getUri().getAwid(), ucEnv.parameters, ucEnv.getAuthorizationResult());
  }

  static addRating(ucEnv) {
    return JokeAbl.addRating(ucEnv.getUri().getAwid(), ucEnv.parameters, ucEnv.session);
  }
}

module.exports = JokeController;
