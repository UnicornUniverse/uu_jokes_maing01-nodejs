"use strict";

const CategoryAbl = require("../../abl/category-abl.js");

class CategoryController {
  static create(ucEnv) {
    return CategoryAbl.create(ucEnv.getUri().getAwid(), ucEnv.parameters);
  }

  static get(ucEnv) {
    return CategoryAbl.get(ucEnv.getUri().getAwid(), ucEnv.parameters, ucEnv.getAuthorizationResult());
  }

  static update(ucEnv) {
    return CategoryAbl.update(ucEnv.getUri().getAwid(), ucEnv.parameters);
  }

  static delete(ucEnv) {
    return CategoryAbl.delete(ucEnv.getUri().getAwid(), ucEnv.parameters);
  }

  static list(ucEnv) {
    return CategoryAbl.list(ucEnv.getUri().getAwid(), ucEnv.parameters, ucEnv.getAuthorizationResult());
  }
}

module.exports = CategoryController;
