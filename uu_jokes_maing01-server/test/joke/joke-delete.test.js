const { TestHelper } = require("uu_appg01_server-test");

const {
  JOKE_CREATE,
  JOKE_DELETE,
  JOKE_GET,
  MONGO_ID,
  getImageStream,
  mockDaoFactory,
  getSessionMock,
  getAuthzResultMock,
} = require("../general-test-hepler");

beforeAll(async () => {
  await TestHelper.setup();
});

afterAll(() => {
  TestHelper.teardown();
});

beforeEach(async () => {
  await TestHelper.dropDatabase();
  await TestHelper.initUuSubAppInstance();
  await TestHelper.createUuAppWorkspace();
  await TestHelper.login("AwidLicenseOwner", false);
});

afterEach(() => {
  jest.restoreAllMocks();
});

test("HDS", async () => {
  expect.assertions(2);
  await TestHelper.initUuAppWorkspace({ uuAppProfileAuthorities: ".", state: "active" });
  await TestHelper.login("Authorities");
  let joke = await TestHelper.executePostCommand(JOKE_CREATE, { name: "There should be unicorns" });
  let result = await TestHelper.executePostCommand(JOKE_DELETE, { id: joke.id });
  expect(result.status).toEqual(200);
  try {
    await TestHelper.executeGetCommand(JOKE_GET, { id: joke.id });
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/joke/get/jokeDoesNotExist");
  }
});

test("HDS - deleting image", async () => {
  expect.assertions(3);
  await TestHelper.initUuAppWorkspace({ uuAppProfileAuthorities: ".", state: "active" });
  await TestHelper.login("Authorities");
  let joke = await TestHelper.executePostCommand(JOKE_CREATE, {
    name: "The ones with the purple eyes",
    image: getImageStream(),
  });
  let result = await TestHelper.executePostCommand(JOKE_DELETE, { id: joke.id });
  expect(result.status).toEqual(200);
  try {
    await TestHelper.executeGetCommand(JOKE_GET, { id: joke.id });
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/joke/get/jokeDoesNotExist");
  }
  let binaries = await TestHelper.executeGetCommand("uu-app-binarystore/listBinaries");
  expect(binaries.pageInfo.total).toEqual(0);
});

test("HDS - deleting ratings", async () => {
  expect.assertions(4);
  await TestHelper.initUuAppWorkspace({ uuAppProfileAuthorities: ".", state: "active" });
  await TestHelper.login("Authorities");
  let joke = await TestHelper.executePostCommand(JOKE_CREATE, { name: "Not the green eyes" });

  // joke/addRating is yet to be implemented, thia creates some ratings in database
  await TestHelper.executeDbScript(
    `db.getCollection('jokeRating').insertMany([
      {jokeId:ObjectId("${joke.id}"),awid:"${TestHelper.getAwid()}",uuIdentity:1},
      {jokeId:ObjectId("${joke.id}"),awid:"${TestHelper.getAwid()}",uuIdentity:2},
      {awid:"${TestHelper.getAwid()}",uuIdentity:3}
    ])`
  );

  let result = await TestHelper.executePostCommand(JOKE_DELETE, { id: joke.id });
  expect(result.status).toEqual(200);

  // only on rating remains in the db
  let dbResult = await TestHelper.executeDbScript(`db.getCollection('jokeRating').find().toArray()`);
  expect(dbResult.length).toEqual(1);
  expect(dbResult[0].uuIdentity).toEqual(3);

  // getting joke results in error as it was just deleted
  try {
    await TestHelper.executeGetCommand(JOKE_GET, { id: joke.id });
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/joke/get/jokeDoesNotExist");
  }
});

test("A2 - jokes instance is closed", async () => {
  expect.assertions(4);
  await TestHelper.initUuAppWorkspace({ uuAppProfileAuthorities: ".", state: "closed" });
  await TestHelper.login("Authorities");
  try {
    await TestHelper.executePostCommand(JOKE_DELETE, { id: MONGO_ID });
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/joke/delete/jokesInstanceNotInProperState");
    expect(e.message).toEqual("JokesInstance is not in proper state [active|underConstruction].");
    expect(e.paramMap.state).toEqual("closed");
    expect(e.paramMap.expectedStateList).toEqual(["active", "underConstruction"]);
  }
});

test("A3 - unsupported keys in dtoIn", async () => {
  await TestHelper.initUuAppWorkspace({ uuAppProfileAuthorities: ".", state: "active" });
  await TestHelper.login("Authorities");
  let joke = await TestHelper.executePostCommand(JOKE_CREATE, { name: "If the police shows up.." });
  joke = await TestHelper.executePostCommand(JOKE_DELETE, {
    id: joke.id,
    continued: "..we will give them so much money..",
  });
  expect(joke.status).toEqual(200);
  let warning = joke.uuAppErrorMap["uu-jokes-main/joke/delete/unsupportedKeys"];
  expect(warning).toBeTruthy();
  expect(warning.type).toEqual("warning");
  expect(warning.message).toEqual("DtoIn contains unsupported keys.");
  expect(warning.paramMap.unsupportedKeyList).toEqual(["$.continued"]);
});

test("A4 - invalid dtoIn", async () => {
  expect.assertions(2);
  await TestHelper.initUuAppWorkspace({ uuAppProfileAuthorities: ".", state: "active" });
  await TestHelper.login("Authorities");
  try {
    await TestHelper.executePostCommand(JOKE_DELETE, {});
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/joke/delete/invalidDtoIn");
    expect(e.message).toEqual("DtoIn is not valid.");
  }
});

test("A5 - joke does nto exist", async () => {
  expect.assertions(2);
  await TestHelper.initUuAppWorkspace({ uuAppProfileAuthorities: ".", state: "active" });
  await TestHelper.login("Authorities");
  try {
    await TestHelper.executePostCommand(JOKE_DELETE, { id: MONGO_ID });
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/joke/delete/jokeDoesNotExist");
    expect(e.message).toEqual("Joke does not exist.");
  }
});

test("A6 - Readers trying to delete Authorities' joke", async () => {
  expect.assertions(1);
  await TestHelper.initUuAppWorkspace({ uuAppProfileAuthorities: ".", state: "active" });
  await TestHelper.login("Authorities");
  let joke = await TestHelper.executePostCommand(JOKE_CREATE, { name: "..it will make them cry. And forgive us." });
  let session = await TestHelper.login("Readers");
  try {
    await TestHelper.executePostCommand(JOKE_DELETE, { id: joke.id }, session);
  } catch (e) {
    expect(e.code).toEqual("uu-appg01/authorization/accessDenied");
  }
});

test("A7 - deleting image fails", async () => {
  expect.assertions(2);
  let { JokeAbl, UuBinaryAbl } = mockAbl();
  JokeAbl.dao.get = () => {
    return { image: "For the love of god, javascript, I hope this is truthy!!" };
  };
  JokeAbl.jokeRatingDao.deleteByJokeId = () => null;
  UuBinaryAbl.deleteBinary = () => {
    throw new Error("it failed.");
  };

  try {
    await JokeAbl.delete("awid", { id: MONGO_ID }, getSessionMock(), getAuthzResultMock());
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/joke/delete/uuBinaryDeleteFailed");
    expect(e.message).toEqual("Deleting uuBinary failed.");
  }
});

function mockAbl() {
  mockDaoFactory();
  const JokeAbl = require("../../app/abl/joke-abl");
  const UuBinaryAbl = require("uu_appg01_binarystore-cmd").UuBinaryModel;
  const JokesInstanceAbl = require("../../app/abl/jokes-instance-abl");
  JokesInstanceAbl.checkInstance = () => null;
  return { JokeAbl, UuBinaryAbl };
}
