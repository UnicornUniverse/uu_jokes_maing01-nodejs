const UuJokesError = require("./uu-jokes-error");
const JOKES_ERROR_PREFIX = `${UuJokesError.ERROR_PREFIX}jokes/`;

const Init = {
  UC_CODE: `${UuJokesError.ERROR_PREFIX}sys/uuAppWorkspace/init/`,

  InvalidDtoIn: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${Init.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },

  SchemaDaoCreateSchemaFailed: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${Init.UC_CODE}schemaDaoCreateSchemaFailed`;
      this.message = "Create schema by Dao createSchema failed.";
    }
  },

  JokesDaoCreateFailed: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${Init.UC_CODE}jokesDaoCreateFailed`;
      this.message = "Create jokes by DAO method failed.";
    }
  },

  UuBtLocationUriInvalid: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${Init.UC_CODE}uuBtLocationUriInvalid`;
      this.message = "It seems like provided uuBt locationUri is invalid.";
    }
  },

  UuBtLocationNotSpecified: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${Init.UC_CODE}uuBtLocationNotSpecified`;
      this.message = "Provided locationUri does not contain code or id in parameters to specify location.";
    }
  },

  CreateAwscFailed: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${Init.UC_CODE}createAwscFailed`;
      this.message = "Create uuAwsc failed.";
    }
  },

  ConnectAwscFailed: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${Init.UC_CODE}connectAwscFailed`;
      this.message = "uuAwsc was not connected.";
    }
  },

  JokesDaoUpdateFailed: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${Init.UC_CODE}jokesDaoUpdateFailed`;
      this.message = "Jokes DAO update failed.";
    }
  },

  SetProfileFailed: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${Init.UC_CODE}setProfileFailed`;
      this.message = "Set uuAppProfile failed.";
    }
  },
};

const PlugInBt = {
  UC_CODE: `${UuJokesError.ERROR_PREFIX}sys/uuAppWorkspace/plugInBt/`,

  JokesDoesNotExist: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${PlugInBt.UC_CODE}jokesDoesNotExist`;
      this.message = "UuObject jokes does not exist.";
    }
  },

  JokesNotInCorrectState: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${PlugInBt.UC_CODE}jokesNotInCorrectState`;
      this.message = "UuObject jokes is not in correct state.";
    }
  },

  InvalidDtoIn: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${PlugInBt.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },

  UuBtLocationUriInvalid: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${PlugInBt.UC_CODE}uuBtLocationUriInvalid`;
      this.message = "It seems like provided uuBt locationUri is invalid.";
    }
  },

  UuBtLocationNotSpecified: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${PlugInBt.UC_CODE}uuBtLocationNotSpecified`;
      this.message = "Provided locationUri does not contain code or id in parameters to specify location.";
    }
  },

  CreateAwscFailed: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${PlugInBt.UC_CODE}createAwscFailed`;
      this.message = "Create uuAwsc failed.";
    }
  },

  ConnectAwscFailed: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${PlugInBt.UC_CODE}connectAwscFailed`;
      this.message = "uuAwsc was not connected.";
    }
  },

  JokesDaoUpdateFailed: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${PlugInBt.UC_CODE}jokesDaoUpdateByAwidFailed`;
      this.message = "Jokes DAO updateByAwid failed.";
    }
  },
};

const Load = {
  UC_CODE: `${JOKES_ERROR_PREFIX}load/`,

  JokesDoesNotExist: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${Load.UC_CODE}jokesDoesNotExist`;
      this.message = "UuObject jokes does not exist.";
    }
  },

  UuAwscLoadFailed: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${Load.UC_CODE}awscLoadFailed`;
      this.message = "UuAwsc loading from territory failed.";
    }
  },
};

const Update = {
  UC_CODE: `${JOKES_ERROR_PREFIX}update/`,

  InvalidDtoIn: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },

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

  JokesDaoUpdateByAwidFailed: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}jokesDaoUpdateByAwidFailed`;
      this.message = "Update uuObject jokes by jokes DAO updateByAwid failed.";
    }
  },

  UpdateBasicAttributesFailed: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}updateBasicAttributesFailed`;
      this.message = "Update of basic attributes failed.";
    }
  },
};

const SetState = {
  UC_CODE: `${JOKES_ERROR_PREFIX}setState/`,

  InvalidDtoIn: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${SetState.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },

  JokesDoesNotExist: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${SetState.UC_CODE}jokesDoesNotExist`;
      this.message = "UuObject jokes does not exist.";
    }
  },

  JokesNotInCorrectState: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${SetState.UC_CODE}jokesNotInCorrectState`;
      this.message = "UuObject jokes is not in correct state.";
    }
  },

  JokesUpdateByAwidDaoFailed: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${SetState.UC_CODE}jokesUpdateByAwidDaoFailed`;
      this.message = "Update uuObject jokes by Jokes DAO updateByAwid failed.";
    }
  },

  UpdateAwscStateFailed: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${SetState.UC_CODE}updateAwscStateFailed`;
      this.message = "Update awsc state failed.";
    }
  },
};

const Migrate = {
  UC_CODE: `${JOKES_ERROR_PREFIX}migrate/`,

  InvalidDtoIn: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${Migrate.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },

  JokesDoesNotExist: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${Migrate.UC_CODE}jokesDoesNotExist`;
      this.message = "Jokes does not exist.";
    }
  },

  JokesIsNotInCorrectState: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${Migrate.UC_CODE}jokesIsNotInCorrectState`;
      this.message = "Jokes is in final state.";
    }
  },

  SchemaDaoMigrateSchemaFailed: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${Migrate.UC_CODE}schemaDaoCreateSchemaFailed`;
      this.message = "Migration of schema by Dao createSchema failed.";
    }
  },
};

module.exports = {
  Init,
  Load,
  Update,
  SetState,
  Migrate,
  PlugInBt,
};
