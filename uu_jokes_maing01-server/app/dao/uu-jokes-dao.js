"use strict";
const { UuObjectDao } = require("uu_appg01_server").ObjectStore;
const { DbConnection } = require("uu_appg01_datastore");

class UuJokesDao extends UuObjectDao {
  constructor(...args) {
    super(...args);
    // We need collation to properly sort joke and categories by name.
    this.collation = { locale: "en", strength: 1 };
  }

  // ISSUE - Temporary fix of the missing collation support in the UuObjectDao
  // HINT - If you don't need to sort by text attribute you can use directly the UuObjectDao
  // https://uuapp.plus4u.net/uu-sls-maing01/3f1ef221518d49f2ac936f53f83ebd84/issueDetail?id=6167f590a57edb002a91b079
  async find(filter, pageInfo = {}, sort = {}, projection = {}) {
    const pageIndex = pageInfo.pageIndex ? pageInfo.pageIndex : 0;
    const pageSize = pageInfo.pageSize ? pageInfo.pageSize : this.defaultPageSize;
    const totalCount = await this.count(filter);

    const db = await DbConnection.get(this.customUri);
    let itemList = await db
      .collection(this.collectionName)
      .find(filter, { projection })
      .collation(this.collation)
      .sort(sort)
      .skip(pageIndex * pageSize)
      .limit(pageSize)
      .toArray()
      .then((result) => {
        return this._convertToId(result);
      });

    return {
      itemList,
      pageInfo: {
        pageIndex: pageIndex,
        pageSize: pageSize,
        total: totalCount,
      },
    };
  }
}

module.exports = UuJokesDao;
