"use strict";
const { ObjectId } = require("bson");
const { DbConnection } = require("uu_appg01_datastore");
const UuJokesDao = require("./uu-jokes-dao");
class JokeMongo extends UuJokesDao {
  constructor(...args) {
    super(...args);
    this._collation = { locale: "en", strength: 1 };
  }

  async createSchema() {
    await super.createIndex({ awid: 1, _id: 1 }, { unique: true });
    await super.createIndex({ awid: 1, categoryIdList: 1 });
    await super.createIndex({ awid: 1, name: 1 }, { collation: this.collation });
    await super.createIndex({ awid: 1, averageRating: 1 });
  }

  async create(uuObject) {
    if (uuObject.categoryIdList) {
      uuObject.categoryIdList = uuObject.categoryIdList.map((categoryId) => new ObjectId(categoryId));
    }
    return await super.insertOne(uuObject);
  }

  async get(awid, id) {
    return await super.findOne({ id, awid });
  }

  async getCountByCategoryId(awid, categoryId) {
    return await super.count({
      awid,
      categoryIdList: new ObjectId(categoryId),
    });
  }

  async update(uuObject) {
    if (uuObject.categoryIdList) {
      uuObject.categoryIdList = uuObject.categoryIdList.map((categoryId) => new ObjectId(categoryId));
    }
    let filter = { id: uuObject.id, awid: uuObject.awid };
    return await super.findOneAndUpdate(filter, uuObject, "NONE");
  }

  async updateVisibility(awid, id, visibility) {
    return await this.update({ awid, id, visibility });
  }

  // TODO: missing revision and mts update
  async removeCategory(awid, categoryId) {
    let db = await DbConnection.get(this.customUri);
    await db
      .collection(this.collectionName)
      .updateMany({ awid }, { $pull: { categoryIdList: new ObjectId(categoryId) } });
  }

  async delete(awid, id) {
    await super.deleteOne({ awid, id });
  }

  async list(awid, criteria = {}, sortBy, order, pageInfo) {
    let filter = {
      awid,
    };

    if (criteria.categoryIdList) {
      filter.categoryIdList = {
        $in: criteria.categoryIdList.map((id) => new ObjectId(id)),
      };
    }

    if (criteria.onlyOwnOrVisible) {
      filter.$or = [{ visibility: true }, { uuIdentity: criteria.uuIdentity }];
    }

    if (criteria.visibility !== undefined) {
      filter.visibility = criteria.visibility;
    }

    let sort = {};
    if (sortBy) {
      sort[sortBy] = order === "asc" ? 1 : -1;
    }

    return await super.find(filter, pageInfo, sort);
  }
}

module.exports = JokeMongo;
