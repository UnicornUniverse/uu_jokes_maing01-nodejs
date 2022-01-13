const Errors = require("../errors/joke-error.js");

const Warnings = {
  Create: {
    UnsupportedKeys: {
      code: `${Errors.Create.UC_CODE}unsupportedKeys`,
    },
    CategoryDoesNotExist: {
      code: `${Errors.Create.UC_CODE}categoryDoesNotExist`,
      message: "One or more categories with given categoryId do not exist.",
    },
  },
  Update: {
    UnsupportedKeys: {
      code: `${Errors.Update.UC_CODE}unsupportedKeys`,
    },
    CategoryDoesNotExist: {
      code: `${Errors.Update.UC_CODE}categoryDoesNotExist`,
      message: "One or more categories with given categoryId do not exist.",
    },
  },
  Get: {
    UnsupportedKeys: {
      code: `${Errors.Get.UC_CODE}unsupportedKeys`,
    },
  },
  List: {
    UnsupportedKeys: {
      code: `${Errors.List.UC_CODE}unsupportedKeys`,
    },
  },
  AddRating: {
    UnsupportedKeys: {
      code: `${Errors.AddRating.UC_CODE}unsupportedKeys`,
    },
  },
  UpdateVisibility: {
    UnsupportedKeys: {
      code: `${Errors.UpdateVisibility.UC_CODE}unsupportedKeys`,
    },
  },
  Delete: {
    UnsupportedKeys: {
      code: `${Errors.Delete.UC_CODE}unsupportedKeys`,
    },
  },
};

module.exports = Warnings;
