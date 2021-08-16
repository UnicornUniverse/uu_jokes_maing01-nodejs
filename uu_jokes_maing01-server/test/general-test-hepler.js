const path = require("path");
const fs = require("fs");
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { Config } = require("uu_appg01_server").Utils;
Config.set("server_root", path.resolve(__dirname, ".."));

const JOKES_INSTANCE_INIT = "sys/uuAppWorkspace/init";
const JOKES_INSTANCE_LOAD = "jokesInstance/load";
const JOKES_INSTANCE_UPDATE = "jokesInstance/update";
const JOKES_INSTANCE_SET_LOGO = "sys/uuAppWorkspace/productLogo/set";
const JOKES_INSTANCE_SET_ICONS = "jokesInstance/setIcons";
const JOKES_INSTANCE_GET_UVE_META_DATA = "jokesInstance/getUveMetaData";
const JOKE_CREATE = "joke/create";
const JOKE_GET = "joke/get";
const JOKE_UPDATE = "joke/update";
const JOKE_UPDATE_VISIBILITY = "joke/updateVisibility";
const JOKE_DELETE = "joke/delete";
const JOKE_LIST = "joke/list";
const JOKE_ADD_RATING = "joke/addRating";
const CATEGORY_CREATE = "category/create";
const CATEGORY_GET = "category/get";
const CATEGORY_UPDATE = "category/update";
const CATEGORY_DELETE = "category/delete";
const CATEGORY_LIST = "category/list";
const MONGO_ID = "012345678910111213141516";

const getImageStream = () => {
  return fs.createReadStream(path.resolve(__dirname, "image.png"));
};

const mockDaoFactory = () => {
  // this mock ensures that all of the abl can be required
  jest.spyOn(DaoFactory, "getDao").mockImplementation(() => {
    let dao = {};
    dao.createSchema = () => {};
    return dao;
  });
};

const getSessionMock = (uuIdentity) => {
  let identity = {
    getUuIdentity: () => uuIdentity,
    getName: () => {},
  };
  return {
    getIdentity: () => identity,
  };
};

const getAuthzResultMock = () => {
  return {
    getAuthorizedProfiles: () => [],
  };
};

module.exports = {
  JOKES_INSTANCE_INIT,
  JOKES_INSTANCE_LOAD,
  JOKES_INSTANCE_UPDATE,
  JOKES_INSTANCE_SET_LOGO,
  JOKES_INSTANCE_SET_ICONS,
  JOKES_INSTANCE_GET_UVE_META_DATA,
  JOKE_CREATE,
  JOKE_GET,
  JOKE_UPDATE,
  JOKE_UPDATE_VISIBILITY,
  JOKE_DELETE,
  JOKE_LIST,
  JOKE_ADD_RATING,
  CATEGORY_CREATE,
  CATEGORY_GET,
  CATEGORY_UPDATE,
  CATEGORY_DELETE,
  CATEGORY_LIST,
  MONGO_ID,
  getImageStream,
  mockDaoFactory,
  getSessionMock,
  getAuthzResultMock,
};
