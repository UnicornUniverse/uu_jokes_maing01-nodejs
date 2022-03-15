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

  UuBtLocationUriParseFailed: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${Init.UC_CODE}uuBtLocationUriParseFailed`;
      this.message = "It seems like provided uuBt locationUri is not about to be parsed.";
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

  SysSetProfileFailed: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${Init.UC_CODE}sysSetProfileFailed`;
      this.message = "Set of Authorities profile failed.";
    }
  },
};

const PlugInBt = {
  UC_CODE: `${UuJokesError.ERROR_PREFIX}sys/uuAppWorkspace/plugInBt/`,

  InvalidDtoIn: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${PlugInBt.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },

  UuBtLocationUriParseFailed: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${PlugInBt.UC_CODE}uuBtLocationUriParseFailed`;
      this.message = "It seems like provided uuBt locationUri is not about to be parsed.";
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
      this.code = `${PlugInBt.UC_CODE}jokesDaoUpdateFailed`;
      this.message = "Jokes DAO update failed.";
    }
  },
};

const Load = {
  UC_CODE: `${JOKES_ERROR_PREFIX}load/`,

  JokesDoesNotExist: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${Load.UC_CODE}jokesDoesNotExist`;
      this.message = "Jokes does not exist.";
    }
  },

  UuAwscLoadFailed: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${Load.UC_CODE}uuAwscLoadFailed`;
      this.message = "Load uuAwsc failed.";
    }
  },

  JokesIsNotInCorrectState: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${Load.UC_CODE}jokesIsNotInCorrectState`;
      this.message = "Jokes is not a valid state.";
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
      this.message = "Jokes does not exist.";
    }
  },

  JokesIsNotInCorrectState: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}jokesIsNotInCorrectState`;
      this.message = "Jokes is not a valid state.";
    }
  },

  JokesDaoUpdateByAwidFailed: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}jokesDaoUpdateByAwidFailed`;
      this.message = "Updating uuJokes by jokes DAO updateByAwid failed.";
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
      this.message = "Jokes does not exist.";
    }
  },

  JokesIsNotInCorrectState: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${SetState.UC_CODE}jokesIsNotInCorrectState`;
      this.message = "Jokes is in final state.";
    }
  },

  JokesUpdateByAwidDaoFailed: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${SetState.UC_CODE}jokesUpdateByAwidDaoFailed`;
      this.message = "Updating Jokes by Jokes DAO updateByAwid failed.";
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
  PlugInBt
};
