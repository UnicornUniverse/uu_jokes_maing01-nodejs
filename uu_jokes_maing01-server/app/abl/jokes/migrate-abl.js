const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const { Schemas } = require("../constants");

const Path = require("path");
const Errors = require("../../api/errors/jokes-error");

const Warnings = {
  MigrateUnsupportedKeys: {
    CODE: `${Errors.Migrate.UC_CODE}unsupportedKeys`,
  },
};

class MigrateAbl {
  constructor() {
    this.validator = new Validator(Path.join(__dirname, "../../", "api", "validation_types", "jokes-types.js"));
  }

  async migrate(dtoIn) {
    let uuAppErrorMap = {};
    let dtoOut = {};

    // HDS 2
    let validationResult = this.validator.validate("jokesMigrateDtoInType", dtoIn);

    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      Warnings.MigrateUnsupportedKeys.CODE,
      Errors.Migrate.InvalidDtoIn
    );

    // HDS 3
    const categoryDao = DaoFactory.getDao(Schemas.CATEGORY);
    const categoryIndexes = await categoryDao.getIndexes();

    // We have added collation to index (awid, name).
    // The previous index without collaction is obsolete.
    const obsoleteIndex = categoryIndexes.itemList.find(
      (index) => index.key.awid === 1 && index.key.name === 1 && index.unique && index.collation === undefined
    );

    if (obsoleteIndex) {
      try {
        await categoryDao.dropIndex(obsoleteIndex.key);
      } catch (e) {
        throw new Errors.Migrate.SchemaDaoMigrateSchemaFailed({ uuAppErrorMap }, e);
      }
    }

    // HDS 4
    const promises = Object.values(Schemas).map(async (schema) => DaoFactory.getDao(schema).createSchema());

    try {
      await Promise.all(promises);
    } catch (e) {
      throw new Errors.Migrate.SchemaDaoMigrateSchemaFailed({ uuAppErrorMap }, e);
    }

    // HDS 5
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }
}

module.exports = new MigrateAbl();
