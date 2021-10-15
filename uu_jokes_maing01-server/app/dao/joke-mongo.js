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
    await super.createIndex({ awid: 1, categoryList: 1 });
    await super.createIndex({ awid: 1, name: 1 }, { collation: this.collation });
    await super.createIndex({ awid: 1, averageRating: 1 });
  }

  async create(uuObject) {
    if (uuObject.categoryList) {
      uuObject.categoryList = uuObject.categoryList.map((categoryId) => new ObjectId(categoryId));
    }
    return await super.insertOne(uuObject);
  }

  async get(awid, id) {
    return await super.findOne({ id, awid });
  }

  async getCountByCategoryId(awid, categoryId) {
    return await super.count({
      awid,
      categoryList: ObjectId.isValid(categoryId) ? new ObjectId(categoryId) : categoryId,
    });
  }

  async update(uuObject) {
    if (uuObject.categoryList) {
      uuObject.categoryList = uuObject.categoryList.map((categoryId) => new ObjectId(categoryId));
    }
    let filter = { id: uuObject.id, awid: uuObject.awid };
    return await super.findOneAndUpdate(filter, uuObject, "NONE");
  }

  async updateVisibility(awid, id, visibility) {
    return await this.update({ awid, id, visibility });
  }

  async removeCategory(awid, categoryId) {
    let db = await DbConnection.get(this.customUri);
    await db
      .collection(this.collectionName)
      .updateMany(
        { awid },
        { $pull: { categoryList: ObjectId.isValid(categoryId) ? new ObjectId(categoryId) : categoryId } }
      );
  }

  async delete(awid, id) {
    await super.deleteOne({ awid, id });
  }

  async list(awid, sortBy, order, pageInfo) {
    const filter = { awid };

    const sort = {
      [sortBy]: order === "asc" ? 1 : -1,
    };

    return await super.find(filter, pageInfo, sort);
  }

  async listByCategoryIdList(awid, categoryIdList, sortBy, order, pageInfo) {
    const filter = {
      awid,
      categoryList: {
        $in: categoryIdList.map((id) => {
          if (!ObjectId.isValid(id)) return id;
          return new ObjectId(id);
        }),
      },
    };

    const sort = {
      [sortBy]: order === "asc" ? 1 : -1,
    };

    return await super.find(filter, pageInfo, sort);
  }
}

module.exports = JokeMongo;
