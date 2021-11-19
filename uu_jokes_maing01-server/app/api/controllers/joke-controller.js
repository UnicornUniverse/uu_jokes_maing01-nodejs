"use strict";
const CreateAbl = require("../../abl/joke/create-abl");
const UpdateAbl = require("../../abl/joke/update-abl");
const UpdateVisibilityAbl = require("../../abl/joke/update-visibility-abl");
const GetAbl = require("../../abl/joke/get-abl");
const DeleteAbl = require("../../abl/joke/delete-abl");
const ListAbl = require("../../abl/joke/list-abl");
const AddRatingAbl = require("../../abl/joke/add-rating-abl");

class JokeController {
  static create(ucEnv) {
    return CreateAbl.create(ucEnv.getUri().getAwid(), ucEnv.parameters, ucEnv.session, ucEnv.getAuthorizationResult());
  }

  static get(ucEnv) {
    return GetAbl.get(ucEnv.getUri().getAwid(), ucEnv.parameters, ucEnv.getAuthorizationResult());
  }

  static update(ucEnv) {
    return UpdateAbl.update(ucEnv.getUri().getAwid(), ucEnv.parameters, ucEnv.session, ucEnv.getAuthorizationResult());
  }

  static updateVisibility(ucEnv) {
    return UpdateVisibilityAbl.updateVisibility(ucEnv.getUri().getAwid(), ucEnv.parameters);
  }

  static delete(ucEnv) {
    return DeleteAbl.delete(ucEnv.getUri().getAwid(), ucEnv.parameters, ucEnv.session, ucEnv.getAuthorizationResult());
  }

  static list(ucEnv) {
    return ListAbl.list(ucEnv.getUri().getAwid(), ucEnv.parameters, ucEnv.getAuthorizationResult());
  }

  static addRating(ucEnv) {
    return AddRatingAbl.addRating(ucEnv.getUri().getAwid(), ucEnv.parameters, ucEnv.session);
  }
}

module.exports = JokeController;
