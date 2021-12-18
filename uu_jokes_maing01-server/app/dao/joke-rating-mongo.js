"use strict";
const { ObjectId } = require("bson");
const UuJokesDao = require("./uu-jokes-dao");

class JokeRatingMongo extends UuJokesDao {
  async createSchema() {
    await super.createIndex({ awid: 1, _id: 1 }, { unique: true });
    await super.createIndex({ awid: 1, jokeId: 1, uuIdentity: 1 }, { unique: true });
  }

  async create(uuObject) {
    uuObject.jokeId = new ObjectId(uuObject.jokeId);
    return await super.insertOne(uuObject);
  }

  async getByJokeIdAndUuIdentity(awid, jokeId, uuIdentity) {
    return await super.findOne({ awid, jokeId: new ObjectId(jokeId), uuIdentity });
  }

  async update(uuObject) {
    let filter = { id: uuObject.id, awid: uuObject.awid };
    return await super.findOneAndUpdate(filter, uuObject, "NONE");
  }

  async deleteByJokeId(awid, jokeId) {
    await super.deleteMany({ awid, jokeId });
  }
}

module.exports = JokeRatingMongo;
