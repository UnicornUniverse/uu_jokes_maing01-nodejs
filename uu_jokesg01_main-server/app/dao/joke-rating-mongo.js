"use strict";

const { UuObjectDao } = require("uu_appg01_server").ObjectStore;
const { ObjectId } = require("bson");

class JokeRatingMongo extends UuObjectDao {
  async createSchema() {
    await super.createIndex({ awid: 1, _id: 1 }, { unique: true });
    await super.createIndex({ awid: 1, jokeId: 1 });
    await super.createIndex({ awid: 1, jokeId: 1, uuIdentity: 1 }, { unique: true });
  }

  async create(uuObject) {
    if (uuObject.hasOwnProperty("jokeId")) {
      uuObject.jokeId = new ObjectId(uuObject.jokeId);
    }

    return await super.insertOne(uuObject);
  }

  async getByJokeAndIdentity(awid, jokeId, uuIdentity) {
    let filter = {
      awid,
      jokeId: new ObjectId(jokeId),
      uuIdentity
    };

    return await super.findOne(filter);
  }

  async update(uuObject) {
    let filter = { awid: uuObject.awid, id: uuObject.id };

    return await super.findOneAndUpdate(filter, uuObject, "NONE");
  }

  async deleteByJoke(awid, jokeId) {
    return await super.deleteOne({ awid, jokeId: new ObjectId(jokeId) });
  }
}

module.exports = JokeRatingMongo;