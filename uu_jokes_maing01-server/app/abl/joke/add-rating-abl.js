"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory, ObjectStoreError } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const Errors = require("../../api/errors/joke-error");
const Warnings = require("../../api/warnings/joke-warning");
const InstanceChecker = require("../../component/instance-checker");
const { Profiles, Schemas, Jokes } = require("../constants");

class AddRatingAbl {
  constructor() {
    this.validator = Validator.load();
    this.dao = DaoFactory.getDao(Schemas.JOKE);
    this.jokeRatingDao = DaoFactory.getDao(Schemas.JOKE_RATING);
  }

  async addRating(awid, dtoIn, session, authorizationResult) {
    let uuAppErrorMap = {};

    // hds 1
    const allowedStateRules = {
      [Profiles.AUTHORITIES]: new Set([Jokes.States.ACTIVE, Jokes.States.UNDER_CONSTRUCTION]),
      [Profiles.EXECUTIVES]: new Set([Jokes.States.ACTIVE, Jokes.States.UNDER_CONSTRUCTION]),
      [Profiles.READERS]: new Set([Jokes.States.ACTIVE]),
    };

    await InstanceChecker.ensureInstanceAndState(
      awid,
      allowedStateRules,
      authorizationResult,
      Errors.AddRating,
      uuAppErrorMap
    );

    // hds 2, 2.1
    const validationResult = this.validator.validate("jokeAddRatingDtoInType", dtoIn);
    // hds 2.2, 2.3, A3, A4
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      uuAppErrorMap,
      Warnings.AddRating.UnsupportedKeys.code,
      Errors.AddRating.InvalidDtoIn
    );

    // hds 3
    const joke = await this.dao.get(awid, dtoIn.id);
    if (!joke) throw new Errors.AddRating.JokeDoesNotExist({ uuAppErrorMap }, { jokeId: dtoIn.id });

    // hds 4
    const uuIdentity = session.getIdentity().getUuIdentity();
    if (uuIdentity === joke.uuIdentity) {
      throw new Errors.AddRating.UserNotAuthorized({ uuAppErrorMap });
    }

    // hds 5
    const { oldRating } = await this._createOrUpdateRating(awid, dtoIn.rating, dtoIn.id, uuIdentity, uuAppErrorMap);

    // hds 6
    const newAverageRating = this._getJokeAverageRating(joke, dtoIn.rating, oldRating);
    if (!oldRating) joke.ratingCount += 1;
    joke.averageRating = newAverageRating;

    // hds 7
    let updatedJoke;
    try {
      updatedJoke = await this.dao.update(joke);
    } catch (e) {
      if (e instanceof ObjectStoreError) {
        throw new Errors.AddRating.JokeDaoUpdateFailed({ uuAppErrorMap }, e);
      }
      throw e;
    }

    // hds 8
    const dtoOut = {
      ...updatedJoke,
      uuAppErrorMap,
    };

    return dtoOut;
  }

  /**
   * Creates or updates rating of particular uuIdentity and joke
   * @param {String} awid Used awid
   * @param {Number} rating Rating value
   * @param {String} jokeId Id of the joke
   * @param {String} uuIdentity UuIdentity of the user
   * @returns {Promise<[]>} New and old rating value
   */
  async _createOrUpdateRating(awid, rating, jokeId, uuIdentity, uuAppErrorMap) {
    const ratingUuObject = await this.jokeRatingDao.getByJokeIdAndUuIdentity(awid, jokeId, uuIdentity);
    let oldRating;
    if (ratingUuObject) {
      oldRating = ratingUuObject.value;
      // hds 5.1 - this is basically an update of existing rating of the particular identity and joke
      try {
        await this.jokeRatingDao.update({ ...ratingUuObject, value: rating });
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

    return { newRating: rating, oldRating };
  }

  /**
   * Gets new average rating
   * @param {Object} joke UuObject joke
   * @param {Number} oldRating Original rating
   * @returns {Number} New calculated average rating
   */
  _getJokeAverageRating(joke, rating, oldRating) {
    let newAverage;

    if (oldRating) {
      newAverage = (joke.averageRating * joke.ratingCount - oldRating + rating) / joke.ratingCount;
    } else {
      newAverage = (joke.averageRating * joke.ratingCount + rating) / (joke.ratingCount + 1);
    }

    return newAverage;
  }
}

module.exports = new AddRatingAbl();
