"use strict";
const UuJokesError = require("./uu-jokes-error");

const PreferenceDelete = {
  UC_CODE: `${UuJokesError.ERROR_PREFIX}preferenceDelete/`,

  InvalidDtoIn: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${PreferenceDelete.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },

  UriCouldNotBeParsed: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${PreferenceDelete.UC_CODE}UriCouldNotBeParsed`;
      this.message = "UuMtUri from dtoIn could not be parsed. It must be invalid.";
    }
  },

  DeleteFailed: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${PreferenceDelete.UC_CODE}deleteFailed`;
      this.message = "Delete userPreferenceProperty from uuMt failed.";
    }
  },
};

const PreferenceLoadFirst = {
  UC_CODE: `${UuJokesError.ERROR_PREFIX}preferenceLoadFirst/`,

  InvalidDtoIn: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${PreferenceLoadFirst.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },

  UriCouldNotBeParsed: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${PreferenceLoadFirst.UC_CODE}UriCouldNotBeParsed`;
      this.message = "UuMtUri from dtoIn could not be parsed. It must be invalid.";
    }
  },

  LoadFirstFailed: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${PreferenceLoadFirst.UC_CODE}getFailed`;
      this.message = "Load first userPreferenceProperty from uuMt failed.";
    }
  },
};

const PreferenceCreateOrUpdate = {
  UC_CODE: `${UuJokesError.ERROR_PREFIX}preferenceCreateOrUpdate/`,

  InvalidDtoIn: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${PreferenceCreateOrUpdate.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },

  UriCouldNotBeParsed: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${PreferenceCreateOrUpdate.UC_CODE}UriCouldNotBeParsed`;
      this.message = "UuMtUri from dtoIn could not be parsed. It must be invalid.";
    }
  },

  CreateOrUpdateFailed: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${PreferenceCreateOrUpdate.UC_CODE}createOrUpdateFailed`;
      this.message = "Create or update userPreferenceProperty in uuMt failed.";
    }
  },
};

module.exports = {
  PreferenceDelete,
  PreferenceLoadFirst,
  PreferenceCreateOrUpdate,
};
