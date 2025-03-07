"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const { BinaryComponent, AppBinaryStoreError } = require("uu_appbinarystoreg02");
const Errors = require("../../api/errors/joke-error");
const Warnings = require("../../api/warnings/joke-warning");
const InstanceChecker = require("../../component/instance-checker");
const { Profiles, Schemas, Jokes } = require("../constants");

class DeleteAbl {
  constructor() {
    this.validator = Validator.load();
    this.dao = DaoFactory.getDao(Schemas.JOKE);
    this.jokeRatingDao = DaoFactory.getDao(Schemas.JOKE_RATING);
    this.binaryComponent = new BinaryComponent();
  }

  async delete(awid, dtoIn, session, authorizationResult) {
    let uuAppErrorMap = {};

    // hds 1, 1.1
    const validationResult = this.validator.validate("jokeDeleteDtoInType", dtoIn);
    // hds 1.2, 1.3, A1, A2
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      uuAppErrorMap,
      Warnings.Delete.UnsupportedKeys.code,
      Errors.Delete.InvalidDtoIn
    );

    // hds 2
    const allowedStateRules = {
      [Profiles.AUTHORITIES]: new Set([Jokes.States.ACTIVE, Jokes.States.UNDER_CONSTRUCTION]),
      [Profiles.EXECUTIVES]: new Set([Jokes.States.ACTIVE, Jokes.States.UNDER_CONSTRUCTION]),
    };

    await InstanceChecker.ensureInstanceAndState(
      awid,
      allowedStateRules,
      authorizationResult,
      Errors.Delete,
      uuAppErrorMap
    );

    // hds 3
    const joke = await this.dao.get(awid, dtoIn.id);
    if (!joke) {
      throw new Errors.Delete.JokeDoesNotExist({ uuAppErrorMap }, { jokeId: dtoIn.id });
    }

    // hds 4
    const uuIdentity = session.getIdentity().getUuIdentity();
    const isAuthorities = authorizationResult.getAuthorizedProfiles().includes(Profiles.AUTHORITIES);
    if (uuIdentity !== joke.uuIdentity && !isAuthorities) {
      throw new Errors.Delete.UserNotAuthorized({ uuAppErrorMap });
    }

    // hds 5
    await this.jokeRatingDao.deleteByJokeId(awid, joke.id);

    // hds 6
    if (joke.image) {
      try {
        await this.binaryComponent.delete(awid, { code: joke.image });
      } catch (e) {
        if (e instanceof AppBinaryStoreError) {
          throw new Errors.Delete.UuBinaryDeleteFailed({ uuAppErrorMap }, e);
        } else {
          throw e;
        }
      }
    }

    // hds 7
    await this.dao.delete(awid, dtoIn.id);

    // hds 8
    return { uuAppErrorMap };
  }
}

module.exports = new DeleteAbl();
