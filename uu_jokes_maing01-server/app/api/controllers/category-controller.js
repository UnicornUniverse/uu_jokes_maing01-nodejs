"use strict";
const CreateAbl = require("../../abl/category/create-abl");
const GetAbl = require("../../abl/category/get-abl");
const UpdateAbl = require("../../abl/category/update-abl");
const ListAbl = require("../../abl/category/list-abl");
const DeleteAbl = require("../../abl/category/delete-abl");

class CategoryController {
  static create(ucEnv) {
    return CreateAbl.create(ucEnv.getUri().getAwid(), ucEnv.parameters);
  }

  static get(ucEnv) {
    return GetAbl.get(ucEnv.getUri().getAwid(), ucEnv.parameters, ucEnv.getAuthorizationResult());
  }

  static update(ucEnv) {
    return UpdateAbl.update(ucEnv.getUri().getAwid(), ucEnv.parameters);
  }

  static delete(ucEnv) {
    return DeleteAbl.delete(ucEnv.getUri().getAwid(), ucEnv.parameters);
  }

  static list(ucEnv) {
    return ListAbl.list(ucEnv.getUri().getAwid(), ucEnv.parameters, ucEnv.getAuthorizationResult());
  }
}

module.exports = CategoryController;
