"use strict";
const UuJokesDao = require("./uu-jokes-dao");

class JokesInstanceMongo extends UuJokesDao {
  async createSchema() {
    await super.createIndex({ awid: 1 }, { unique: true });
  }

  async create(jokeInstance) {
    return await super.insertOne(jokeInstance);
  }

  async getByAwid(awid) {
    return await super.findOne({ awid });
  }

  async updateByAwid(jokeInstance) {
    return await super.findOneAndUpdate({ awid: jokeInstance.awid }, jokeInstance, "NONE");
  }
}

module.exports = JokesInstanceMongo;
