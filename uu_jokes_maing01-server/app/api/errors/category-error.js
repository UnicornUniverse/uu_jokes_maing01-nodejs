"use strict";

const UuJokesError = require("./uu-jokes-error");
const CATEGORY_ERROR_PREFIX = `${UuJokesError.ERROR_PREFIX}category/`;

const Create = {
  UC_CODE: `${CATEGORY_ERROR_PREFIX}create/`,
  JokesInstanceDoesNotExist: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}jokesInstanceDoesNotExist`;
      this.message = "JokesInstance does not exist.";
    }
  },
  JokesInstanceNotInProperState: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}jokesInstanceNotInProperState`;
      this.message = "JokesInstance is not in proper state [active|underConstruction].";
    }
  },
  InvalidDtoIn: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  CategoryNameNotUnique: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}categoryNameNotUnique`;
      this.message = "Category name is not unique in awid.";
    }
  },
  CategoryDaoCreateFailed: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}categoryDaoCreateFailed`;
      this.message = "Create category by category DAO create failed.";
    }
  },
};

const Get = {
  UC_CODE: `${CATEGORY_ERROR_PREFIX}get/`,
  JokesInstanceDoesNotExist: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${Get.UC_CODE}jokesInstanceDoesNotExist`;
      this.message = "JokesInstance does not exist.";
    }
  },
  JokesInstanceNotInProperState: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${Get.UC_CODE}jokesInstanceNotInProperState`;
      this.message = "JokesInstance is not in proper state [active|underConstruction].";
    }
  },
  JokesInstanceIsUnderConstruction: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${Get.UC_CODE}jokesInstanceIsUnderConstruction`;
      this.message = "JokesInstance is in state underConstruction.";
    }
  },
  InvalidDtoIn: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${Get.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  CategoryDoesNotExist: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${Get.UC_CODE}categoryDoesNotExist`;
      this.message = "Category does not exist.";
    }
  },
};

const Update = {
  UC_CODE: `${CATEGORY_ERROR_PREFIX}update/`,
  JokesInstanceDoesNotExist: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}jokesInstanceDoesNotExist`;
      this.message = "JokesInstance does not exist.";
    }
  },
  JokesInstanceNotInProperState: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}jokesInstanceNotInProperState`;
      this.message = "JokesInstance is not in proper state [active|underConstruction].";
    }
  },
  InvalidDtoIn: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  CategoryNameNotUnique: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}categoryNameNotUnique`;
      this.message = "Category name is not unique in awid.";
    }
  },
  CategoryDaoUpdateFailed: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}categoryDaoUpdateFailed`;
      this.message = "Update category by category Dao update failed.";
    }
  },
};

const Delete = {
  UC_CODE: `${CATEGORY_ERROR_PREFIX}delete/`,
  JokesInstanceDoesNotExist: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}jokesInstanceDoesNotExist`;
      this.message = "JokesInstance does not exist.";
    }
  },
  JokesInstanceNotInProperState: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}jokesInstanceNotInProperState`;
      this.message = "JokesInstance is not in proper state [active|underConstruction].";
    }
  },
  InvalidDtoIn: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  JokeDaoGetCountByCategoryFailed: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}jokeDaoGetCountByCategoryFailed`;
      this.message = "Get count by joke Dao getCountByCategory failed.";
    }
  },
  RelatedJokesExist: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}relatedJokesExist`;
      this.message = "Category contains jokes.";
    }
  },
  JokeDaoRemoveCategoryFailed: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}jokeDaoRemoveCategoryFailed`;
      this.message = "Removing category by joke Dao removeCategory failed.";
    }
  },
};

const List = {
  UC_CODE: `${CATEGORY_ERROR_PREFIX}list/`,
  JokesInstanceDoesNotExist: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${List.UC_CODE}jokesInstanceDoesNotExist`;
      this.message = "JokesInstance does not exist.";
    }
  },
  JokesInstanceNotInProperState: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${List.UC_CODE}jokesInstanceNotInProperState`;
      this.message = "JokesInstance is not in proper state [active|underConstruction].";
    }
  },
  JokesInstanceIsUnderConstruction: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${List.UC_CODE}jokesInstanceIsUnderConstruction`;
      this.message = "JokesInstance is in state underConstruction.";
    }
  },
  InvalidDtoIn: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${List.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
};

module.exports = {
  Create,
  Get,
  Update,
  Delete,
  List,
};
