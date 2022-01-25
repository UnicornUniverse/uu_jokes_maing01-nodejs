"use strict";

const UuJokesError = require("./uu-jokes-error");
const JOKE_ERROR_PREFIX = `${UuJokesError.ERROR_PREFIX}joke/`;

const Create = {
  UC_CODE: `${JOKE_ERROR_PREFIX}create/`,
  JokesDoesNotExist: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}jokesDoesNotExist`;
      this.message = "UuObject jokes does not exist.";
    }
  },
  JokesNotInCorrectState: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}jokesNotInCorrectState`;
      this.message = "UuObject jokes is not in correct state.";
    }
  },
  InvalidDtoIn: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  InvalidText: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}invalidText`;
      this.message = "Invalid text - it cannot have no characters or be of zero length if image is not provided.";
    }
  },
  UuBinaryCreateFailed: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}uuBinaryCreateFailed`;
      this.message = "Create uuBinary failed.";
    }
  },
  JokeDaoCreateFailed: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}jokeDaoCreateFailed`;
      this.message = "Create joke by joke DAO create failed.";
    }
  },
  InvalidImage: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}invalidImage`;
      this.message = "Image is invalid or it is not an image.";
    }
  },
};

const Get = {
  UC_CODE: `${JOKE_ERROR_PREFIX}get/`,
  JokesDoesNotExist: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${Get.UC_CODE}jokesDoesNotExist`;
      this.message = "UuObject jokes does not exist.";
    }
  },
  JokesNotInCorrectState: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${Get.UC_CODE}jokesNotInCorrectState`;
      this.message = "UuObject jokes is not in correct state.";
    }
  },
  JokesInstanceIsUnderConstruction: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${Get.UC_CODE}jokesInstanceIsUnderConstruction`;
      this.message = "JokesInstance is in underConstruction state.";
    }
  },
  InvalidDtoIn: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${Get.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  JokeDoesNotExist: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${Get.UC_CODE}jokeDoesNotExist`;
      this.message = "Joke does not exist.";
    }
  },
};

const Update = {
  UC_CODE: `${JOKE_ERROR_PREFIX}update/`,
  JokesDoesNotExist: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}jokesDoesNotExist`;
      this.message = "UuObject jokes does not exist.";
    }
  },
  JokesNotInCorrectState: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}jokesNotInCorrectState`;
      this.message = "UuObject jokes is not in correct state.";
    }
  },
  InvalidDtoIn: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  InvalidInputCombination: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}invalidInputCombination`;
      this.message = "Invalid input combination - it is not possible to update and delete image at the same time.";
    }
  },
  TextCannotBeRemoved: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}textCannotBeRemoved`;
      this.message = "Text cannot be removed if joke would end up without both text and image.";
    }
  },
  ImageCannotBeDeleted: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}imageCannotBeDeleted`;
      this.message = "Image cannot be deleted if joke would end up without both text and image.";
    }
  },
  UserNotAuthorized: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}userNotAuthorized`;
      this.message = "User not authorized.";
    }
  },
  JokeDoesNotExist: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}jokeDoesNotExist`;
      this.message = "Joke does not exist.";
    }
  },
  UuBinaryCreateFailed: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}uuBinaryCreateFailed`;
      this.message = "Creating uuBinary failed.";
    }
  },
  UuBinaryUpdateBinaryDataFailed: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}uuBinaryUpdateBinaryDataFailed`;
      this.message = "Updating uuBinary data failed.";
    }
  },
  InvalidImage: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}invalidImage`;
      this.message = "Image is invalid or it is not an image.";
    }
  },
  JokeDaoUpdateFailed: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}jokeDaoUpdateFailed`;
      this.message = "Update joke by joke Dao update failed.";
    }
  },
};

const UpdateVisibility = {
  UC_CODE: `${JOKE_ERROR_PREFIX}updateVisibility/`,
  JokeDaoUpdateVisibilityFailed: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${UpdateVisibility.UC_CODE}jokeDaoUpdateVisibilityFailed`;
      this.message = "Update joke by joke Dao updateVisibility failed";
    }
  },
  JokesDoesNotExist: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${UpdateVisibility.UC_CODE}jokesDoesNotExist`;
      this.message = "UuObject jokes does not exist.";
    }
  },
  JokesNotInCorrectState: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${UpdateVisibility.UC_CODE}jokesNotInCorrectState`;
      this.message = "UuObject jokes is not in correct state.";
    }
  },
  InvalidDtoIn: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${UpdateVisibility.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
};

const Delete = {
  UC_CODE: `${JOKE_ERROR_PREFIX}delete/`,
  JokesDoesNotExist: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}jokesDoesNotExist`;
      this.message = "UuObject jokes does not exist.";
    }
  },
  JokesNotInCorrectState: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}jokesNotInCorrectState`;
      this.message = "UuObject jokes is not in correct state.";
    }
  },
  InvalidDtoIn: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  JokeDoesNotExist: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}jokeDoesNotExist`;
      this.message = "Joke does not exist.";
    }
  },
  UserNotAuthorized: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}userNotAuthorized`;
      this.message = "User not authorized.";
    }
  },
  UuBinaryDeleteFailed: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}uuBinaryDeleteFailed`;
      this.message = "Deleting uuBinary failed.";
    }
  },
};

const List = {
  UC_CODE: `${JOKE_ERROR_PREFIX}list/`,
  JokesDoesNotExist: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${List.UC_CODE}jokesDoesNotExist`;
      this.message = "UuObject jokes does not exist.";
    }
  },
  JokesNotInCorrectState: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${List.UC_CODE}jokesNotInCorrectState`;
      this.message = "UuObject jokes is not in correct state.";
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

const AddRating = {
  UC_CODE: `${JOKE_ERROR_PREFIX}addRating/`,
  JokesDoesNotExist: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${AddRating.UC_CODE}jokesDoesNotExist`;
      this.message = "UuObject jokes does not exist.";
    }
  },
  JokesNotInCorrectState: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${AddRating.UC_CODE}jokesNotInCorrectState`;
      this.message = "UuObject jokes is not in correct state.";
    }
  },
  InvalidDtoIn: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${AddRating.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  JokeDoesNotExist: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${AddRating.UC_CODE}jokeDoesNotExist`;
      this.message = "Joke does not exist.";
    }
  },
  UserNotAuthorized: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${AddRating.UC_CODE}userNotAuthorized`;
      this.message = "User is not authorized to rate the joke that they created.";
    }
  },
  JokeRatingDaoUpdateFailed: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${AddRating.UC_CODE}jokeRatingDaoUpdateFailed`;
      this.message = "Update jokeRating by jokeRating DAO update failed.";
    }
  },
  JokeRatingDaoCreateFailed: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${AddRating.UC_CODE}jokeRatingDaoCreateFailed`;
      this.message = "Create jokeRating by jokeRating DAO create failed.";
    }
  },
  JokeDaoUpdateFailed: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${AddRating.UC_CODE}jokeDaoUpdateFailed`;
      this.message = "Update joke by joke DAO update failed.";
    }
  },
};

module.exports = {
  Create,
  Get,
  Update,
  UpdateVisibility,
  Delete,
  List,
  AddRating,
};
