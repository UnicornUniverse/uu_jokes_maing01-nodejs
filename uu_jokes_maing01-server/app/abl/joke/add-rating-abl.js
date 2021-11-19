"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory, ObjectStoreError } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
// TODO Add InstanceChecker
const Errors = require("../api/errors/joke-error");
const Path = require("path");

const WARNINGS = {
  addRatingUnsupportedKeys: {
    code: `${Errors.AddRating.UC_CODE}unsupportedKeys`,
  },
};

class AddRatingAbl {
  constructor() {
    this.validator = new Validator(Path.join(__dirname, "..", "api", "validation_types", "joke-types.js"));
    this.dao = DaoFactory.getDao("joke");
    this.jokeRatingDao = DaoFactory.getDao("jokeRating");
  }

  async addRating(awid, dtoIn, session) {
    // hds 1, A1, hds 1.1, A2
    // TODO Add InstanceChecker
    // await JokesInstanceAbl.checkInstance(
    //   awid,
    //   Errors.AddRating.JokesInstanceDoesNotExist,
    //   Errors.AddRating.JokesInstanceNotInProperState
    // );

    // hds 2, 2.1
    let validationResult = this.validator.validate("jokeAddRatingDtoInType", dtoIn);
    // hds 2.2, 2.3, A3, A4
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.addRatingUnsupportedKeys.code,
      Errors.AddRating.InvalidDtoIn
    );

    // hds 3
    let joke;
    let jokeId = dtoIn.id;
    joke = await this.dao.get(awid, jokeId);
    // A5
    if (!joke) throw new Errors.AddRating.JokeDoesNotExist({ uuAppErrorMap }, { jokeId: jokeId });
    jokeId = joke.id;

    // hds 4, A6
    let uuIdentity = session.getIdentity().getUuIdentity();
    if (uuIdentity === joke.uuIdentity) {
      throw new Errors.AddRating.UserNotAuthorized({ uuAppErrorMap });
    }

    // hds 5
    let rating = dtoIn.rating;
    let ratingUuObject = await this.jokeRatingDao.getByJokeIdAndUuIdentity(awid, jokeId, uuIdentity);
    let oldRating;
    if (ratingUuObject) {
      oldRating = ratingUuObject.value;
      // hds 5.1
      try {
        ratingUuObject.value = rating;
        await this.jokeRatingDao.update(ratingUuObject);
      } catch (e) {
        if (e instanceof ObjectStoreError) {
          // A7
          throw new Errors.AddRating.JokeRatingDaoUpdateFailed({ uuAppErrorMap }, e);
        }
        throw e;
      }
    } else {
      // hds 5.2
      try {
        await this.jokeRatingDao.create({ awid, jokeId, uuIdentity, value: rating });
      } catch (e) {
        if (e instanceof ObjectStoreError) {
          // A8
          throw new Errors.AddRating.JokeRatingDaoCreateFailed({ uuAppErrorMap }, e);
        }
        throw e;
      }
    }

    // hds 6
    let newRating;
    if (oldRating) {
      newRating = (joke.averageRating * joke.ratingCount - oldRating + rating) / joke.ratingCount;
    } else {
      newRating = (joke.averageRating * joke.ratingCount + rating) / (joke.ratingCount + 1);
      // hds 7
      joke.ratingCount += 1;
    }
    joke.averageRating = newRating;

    // hds 8
    try {
      joke = await this.dao.update(joke);
    } catch (e) {
      if (e instanceof ObjectStoreError) {
        throw new Errors.AddRating.JokeDaoUpdateFailed({ uuAppErrorMap }, e);
      }
      throw e;
    }

    // hds 9
    joke.uuAppErrorMap = uuAppErrorMap;
    return joke;
  }
}

module.exports = new AddRatingAbl();
