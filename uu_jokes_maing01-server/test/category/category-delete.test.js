const { TestHelper } = require("uu_appg01_server-test");
const { ObjectStoreError } = require("uu_appg01_server").ObjectStore;
const {
  JOKES_INSTANCE_INIT,
  CATEGORY_CREATE,
  CATEGORY_DELETE,
  CATEGORY_GET,
  JOKE_GET,
  MONGO_ID,
  mockDaoFactory
} = require("../general-test-hepler");

beforeAll(async () => {
  await TestHelper.setup(null, { authEnabled: false });
});

afterAll(() => {
  TestHelper.teardown();
});

beforeEach(async () => {
  await TestHelper.dropDatabase();
  await TestHelper.initAppInstance();
  await TestHelper.createAppWorkspace();
  await TestHelper.initAppWorkspace();
});

afterEach(() => {
  jest.restoreAllMocks();
});

test("HDS - delete succeeds even when there is nothing to delete", async () => {
  await TestHelper.executePostCommand(JOKES_INSTANCE_INIT, { uuAppProfileAuthorities: "." });
  let response = await TestHelper.executePostCommand(CATEGORY_DELETE, { id: MONGO_ID });
  expect(response.status).toEqual(200);
  expect(response.uuAppErrorMap).toEqual({});
});

test("HDS - create category then delete it, no jokes involved", async () => {
  expect.assertions(3);
  await TestHelper.executePostCommand(JOKES_INSTANCE_INIT, { uuAppProfileAuthorities: ".", state: "active" });
  let category = await TestHelper.executePostCommand(CATEGORY_CREATE, { name: ".." });
  let response = await TestHelper.executePostCommand(CATEGORY_DELETE, { id: category.id });
  expect(response.status).toEqual(200);
  expect(response.uuAppErrorMap).toEqual({});
  try {
    await TestHelper.executeGetCommand(CATEGORY_GET, { id: category.id });
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/category/get/categoryDoesNotExist");
  }
});

test("HDS - force delete category and checks that its removed from joke", async () => {
  expect.assertions(3);
  await TestHelper.executePostCommand(JOKES_INSTANCE_INIT, { uuAppProfileAuthorities: ".", state: "active" });

  // create two categories
  let categoryOne = await TestHelper.executePostCommand(CATEGORY_CREATE, { name: ".." });
  let categoryTwo = await TestHelper.executePostCommand(CATEGORY_CREATE, { name: "..." });

  // create joke belonging to both categories
  await createCategoriedJokeDb([categoryOne.id, categoryTwo.id]);

  // force delete one category
  let response = await TestHelper.executePostCommand(CATEGORY_DELETE, { id: categoryTwo.id, forceDelete: true });
  expect(response.status).toEqual(200);
  expect(response.uuAppErrorMap).toEqual({});

  // the deleted category is also deleted from joke
  let joke = await TestHelper.executeGetCommand(JOKE_GET, { id: MONGO_ID });
  expect(joke.categoryList).toEqual([categoryOne.id]);
});

test("A1 - jokesInstance does nto exist", async () => {
  expect.assertions(2);
  try {
    await TestHelper.executePostCommand(CATEGORY_DELETE);
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/category/delete/jokesInstanceDoesNotExist");
    expect(e.message).toEqual("JokesInstance does not exist.");
  }
});

test("A2 - jokes instance is closed", async () => {
  expect.assertions(4);
  await TestHelper.executePostCommand(JOKES_INSTANCE_INIT, { uuAppProfileAuthorities: ".", state: "closed" });
  try {
    await TestHelper.executePostCommand(CATEGORY_DELETE, {});
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/category/delete/jokesInstanceNotInProperState");
    expect(e.message).toEqual("JokesInstance is not in proper state [active|underConstruction].");
    expect(e.paramMap.state).toEqual("closed");
    expect(e.paramMap.expectedStateList).toEqual(["active", "underConstruction"]);
  }
});

test("A3 - unsupported keys in dtoIn", async () => {
  await TestHelper.executePostCommand(JOKES_INSTANCE_INIT, { uuAppProfileAuthorities: "." });
  let response = await TestHelper.executePostCommand(CATEGORY_DELETE, { id: MONGO_ID, vrchr: "japko" });
  expect(response.status).toEqual(200);
  let warning = response.uuAppErrorMap["uu-jokes-main/category/delete/unsupportedKeys"];
  expect(warning).toBeTruthy();
  expect(warning.type).toEqual("warning");
  expect(warning.message).toEqual("DtoIn contains unsupported keys.");
  expect(warning.paramMap.unsupportedKeyList).toEqual(["$.vrchr"]);
});

test("A4 - dtoIn is not valid", async () => {
  expect.assertions(2);
  await TestHelper.executePostCommand(JOKES_INSTANCE_INIT, { uuAppProfileAuthorities: "." });
  try {
    await TestHelper.executePostCommand(CATEGORY_DELETE, {});
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/category/delete/invalidDtoIn");
    expect(e.message).toEqual("DtoIn is not valid.");
  }
});

test("A5 - obtaining count of relevant jokes fails", async () => {
  expect.assertions(2);

  let CategoryAbl = mockAbl();
  CategoryAbl.jokeDao.getCountByCategoryId = () => {
    throw new ObjectStoreError("it failed.");
  };

  try {
    await CategoryAbl.delete("awid", { id: MONGO_ID });
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/category/delete/jokeDaoGetCountByCategoryFailed");
    expect(e.message).toEqual("Get count by joke Dao getCountByCategory failed.");
  }
});

test("A6 - there are jokes with deleted category and the delete is not forced", async () => {
  expect.assertions(3);
  await TestHelper.executePostCommand(JOKES_INSTANCE_INIT, { uuAppProfileAuthorities: "." });
  let category = await TestHelper.executePostCommand(CATEGORY_CREATE, { name: ".." });
  await createCategoriedJokeDb([category.id]);
  try {
    await TestHelper.executePostCommand(CATEGORY_DELETE, { id: category.id });
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/category/delete/relatedJokesExist");
    expect(e.message).toEqual("Category contains jokes.");
    expect(e.paramMap.relatedJokes).toEqual(1);
  }
});

test("A7 - removing category fails", async () => {
  expect.assertions(2);

  let CategoryAbl = mockAbl();
  CategoryAbl.jokeDao.removeCategory = () => {
    throw new ObjectStoreError("it failed.");
  };

  try {
    await CategoryAbl.delete("awid", { id: MONGO_ID, forceDelete: true });
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/category/delete/jokeDaoRemoveCategoryFailed");
    expect(e.message).toEqual("Removing category by joke Dao removeCategory failed.");
  }
});

function mockAbl() {
  mockDaoFactory();
  const CategoryAbl = require("../../app/abl/category-abl");
  const JokesInstanceAbl = require("../../app/abl/jokes-instance-abl");
  JokesInstanceAbl.checkInstance = () => null;
  return CategoryAbl;
}

// calling joke/create doesn't work with disabled authorization/authentication, this is a shortcut
async function createCategoriedJokeDb(categoryList) {
  categoryList = categoryList.map(category => {
    return `ObjectId("${category}")`;
  });
  await TestHelper.executeDbScript(
    `db.getCollection('joke').insert({
      _id:ObjectId("${MONGO_ID}"),
      awid:"${TestHelper.getAwid()}",
      categoryList:[${categoryList}]
    })`
  );
}
