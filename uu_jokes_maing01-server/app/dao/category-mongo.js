"use strict";
const { ObjectId } = require("bson");
const UuJokesDao = require("./uu-jokes-dao");

class CategoryMongo extends UuJokesDao {
  constructor(...args) {
    super(...args);
    this._collation = { locale: "en", strength: 1 };
  }

  async createSchema() {
    await super.createIndex({ awid: 1, _id: 1 }, { unique: true });
    await super.createIndex({ awid: 1, name: 1 }, { unique: true, collation: this.collation });
  }

  async create(uuObject) {
    return await super.insertOne(uuObject);
  }

  async get(awid, id) {
    return await super.findOne({ awid, id });
  }

  async getByName(awid, name) {
    return await super.findOne({ awid, name });
  }

  async update(uuObject) {
    let filter = { id: uuObject.id, awid: uuObject.awid };
    return await super.findOneAndUpdate(filter, uuObject, "NONE");
  }

  async delete(awid, id) {
    await super.deleteOne({ awid, id });
  }

  async list(awid, criteria, order, pageInfo, projection = {}) {
    const filter = { awid };

    if (criteria?.idList) {
      filter._id = { $in: criteria.idList.map((id) => new ObjectId(id)) };
    }

    const sort = { name: order === "asc" ? 1 : -1 };
    console.log("PageInfo:", JSON.stringify(pageInfo));
    return await super.find(filter, pageInfo, sort, projection);
  }

  async listByIdList(awid, categoryIdList) {
    const filter = {
      awid,
      _id: {
        $in: categoryIdList.map((id) => new ObjectId(id)),
      },
    };

    return await super.find(filter);
  }
}

module.exports = CategoryMongo;
