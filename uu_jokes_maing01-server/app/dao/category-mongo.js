"use strict";

const { UuObjectDao } = require("uu_appg01_server").ObjectStore;
const { ObjectId } = require("bson");

class CategoryMongo extends UuObjectDao {
  async createSchema() {
    await super.createIndex({ awid: 1, _id: 1 }, { unique: true });
    await super.createIndex({ awid: 1, name: 1 }, { unique: true });
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

  async list(awid, order, pageInfo) {
    let sort = { name: order === "asc" ? 1 : -1 };
    return await super.find({ awid }, pageInfo, sort);
  }

  async listByCategoryIdList(awid, categoryIdList, pageInfo) {
    let query = {
      awid,
      _id: {
        $in: categoryIdList.map((id) => {
          if (!ObjectId.isValid(id)) return id;
          return new ObjectId(id);
        }),
      },
    };
    return await super.find(query, pageInfo);
  }
}

module.exports = CategoryMongo;
