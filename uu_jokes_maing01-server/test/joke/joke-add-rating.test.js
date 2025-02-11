const { TestHelper } = require("uu_appg01_server-test");
const { ObjectStoreError } = require("uu_appg01_server").ObjectStore;
const {
  JOKE_CREATE,
  JOKE_GET,
  JOKE_ADD_RATING,
  MONGO_ID,
  mockDaoFactory,
  getSessionMock,
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
  await TestHelper.login("AwidInitiator", false);
});

afterEach(() => {
  jest.restoreAllMocks();
});

test("HDS - vote for the first time", async () => {
  await TestHelper.initUuAppWorkspace({ uuAppProfileAuthorities: ".", state: "active" });
  let response = await TestHelper.executePostCommand(JOKE_CREATE, { name: "And she knows that.." });
  let session = await TestHelper.login("Readers");
  let ratedResponse = await TestHelper.executePostCommand(JOKE_ADD_RATING, { id: response.id, rating: 4 }, session);
  expect(ratedResponse.status).toEqual(200);
  expect(ratedResponse.averageRating).toEqual(4);
  expect(ratedResponse.ratingCount).toEqual(1);
  response = await TestHelper.executeGetCommand(JOKE_GET, { id: response.id });
  expect(response).toEqual(ratedResponse);
});

test("HDS - change the vote, it wasn't funny after all", async () => {
  await TestHelper.initUuAppWorkspace({ uuAppProfileAuthorities: ".", state: "active" });
  let response = await TestHelper.executePostCommand(JOKE_CREATE, { name: "it'd be tragic if thos eveil robots win" });
  let session = await TestHelper.login("Readers");
  let ratedResponse = await TestHelper.executePostCommand(JOKE_ADD_RATING, { id: response.id, rating: 4 }, session);
  expect(ratedResponse.status).toEqual(200);
  expect(ratedResponse.averageRating).toEqual(4);
  expect(ratedResponse.ratingCount).toEqual(1);
  ratedResponse = await TestHelper.executePostCommand(JOKE_ADD_RATING, { id: response.id, rating: 1 });
  expect(ratedResponse.status).toEqual(200);
  expect(ratedResponse.averageRating).toEqual(1);
  expect(ratedResponse.ratingCount).toEqual(1);
  response = await TestHelper.executeGetCommand(JOKE_GET, { id: response.id });
  expect(response).toEqual(ratedResponse);
});

test("HDS - correct rating recalculating", async () => {
  await TestHelper.initUuAppWorkspace({ uuAppProfileAuthorities: ".", state: "active" });
  await TestHelper.login("Authorities");

  // there is not enough testing identities => create joke straight in database
  await TestHelper.executeDbScript(
    `db.getCollection('joke').insert({
        _id:ObjectId("${MONGO_ID}"),
        awid: "${TestHelper.getAwid()}",
        name:"A",
        averageRating:3.5,
        ratingCount:4 })`,
  );

  // cast the first vote
  let response = await TestHelper.executePostCommand(JOKE_ADD_RATING, { id: MONGO_ID, rating: 2 });
  expect(response.status).toEqual(200);
  expect(response.averageRating).toEqual(3.2);
  expect(response.ratingCount).toEqual(5);

  // change the vote
  response = await TestHelper.executePostCommand(JOKE_ADD_RATING, { id: MONGO_ID, rating: 1 });
  expect(response.status).toEqual(200);
  expect(response.averageRating).toEqual(3);
  expect(response.ratingCount).toEqual(5);
});

test("A2 - jokes instance is closed", async () => {
  expect.assertions(4);
  await TestHelper.initUuAppWorkspace({ uuAppProfileAuthorities: ".", state: "closed" });
  await TestHelper.login("Authorities");
  try {
    await TestHelper.executePostCommand(JOKE_ADD_RATING, {});
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/joke/addRating/jokesNotInCorrectState");
    expect(e.message).toEqual("UuObject jokes is not in correct state.");
    expect(e.paramMap.state).toEqual("closed");
    expect(e.paramMap.expectedStateList).toEqual(["active", "underConstruction"]);
  }
});

test("A3 - unsupported keys in dtoIn", async () => {
  await TestHelper.initUuAppWorkspace({ uuAppProfileAuthorities: "." });
  let joke = await TestHelper.executePostCommand(JOKE_CREATE, { name: "walk in on your own feet, says the rover" });
  let session = await TestHelper.login("Readers");
  joke = await TestHelper.executePostCommand(JOKE_ADD_RATING, { id: joke.id, rating: 3, dog: "woof" }, session);
  expect(joke.status).toEqual(200);
  let warning = joke.uuAppErrorMap["uu-jokes-main/joke/addRating/unsupportedKeys"];
  expect(warning).toBeTruthy();
});

test("A4 - invalid dtoIn", async () => {
  expect.assertions(2);
  await TestHelper.initUuAppWorkspace({ uuAppProfileAuthorities: "." });
  await TestHelper.login("Authorities");
  try {
    await TestHelper.executePostCommand(JOKE_ADD_RATING, {});
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/joke/addRating/invalidDtoIn");
    expect(e.message).toEqual("DtoIn is not valid.");
  }
});

test("A5 - joke does not exist", async () => {
  expect.assertions(3);
  await TestHelper.initUuAppWorkspace({ uuAppProfileAuthorities: "." });
  await TestHelper.login("Authorities");
  try {
    await TestHelper.executePostCommand(JOKE_ADD_RATING, { id: MONGO_ID, rating: 5 });
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/joke/addRating/jokeDoesNotExist");
    expect(e.message).toEqual("Joke does not exist.");
    expect(e.paramMap.jokeId).toEqual(MONGO_ID);
  }
});

test("A6 - Authorities trying to rate their own joke", async () => {
  expect.assertions(2);
  await TestHelper.initUuAppWorkspace({ uuAppProfileAuthorities: "." });
  await TestHelper.login("Authorities");
  let joke = await TestHelper.executePostCommand(JOKE_CREATE, { name: "it's my way or the all leave, says the rover" });
  try {
    await TestHelper.executePostCommand(JOKE_ADD_RATING, { id: joke.id, rating: 5 });
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/joke/addRating/userNotAuthorized");
    expect(e.message).toEqual("User is not authorized.");
  }
});

test("A7 - joke rating update fails", async () => {
  expect.assertions(2);

  let JokeAbl = mockAbl();
  JokeAbl.jokeRatingDao.getByJokeIdAndUuIdentity = () => {
    return { value: null };
  };
  JokeAbl.jokeRatingDao.update = () => {
    throw new ObjectStoreError("it failed.");
  };

  try {
    await JokeAbl.addRating("awid", { id: MONGO_ID, rating: 2 }, getSessionMock());
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/joke/addRating/jokeRatingDaoUpdateFailed");
    expect(e.message).toEqual("Update jokeRating by jokeRating DAO update failed.");
  }
});

test("A7 - creating new joke rating fails", async () => {
  expect.assertions(2);

  let JokeAbl = mockAbl();
  JokeAbl.jokeRatingDao.getByJokeIdAndUuIdentity = () => null;
  JokeAbl.jokeRatingDao.create = () => {
    throw new ObjectStoreError("it failed.");
  };

  try {
    await JokeAbl.addRating("awid", { id: MONGO_ID, rating: 2 }, getSessionMock());
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/joke/addRating/jokeRatingDaoCreateFailed");
    expect(e.message).toEqual("Create jokeRating by jokeRating DAO create failed.");
  }
});

test("A8 - updating joke fails", async () => {
  expect.assertions(2);

  let JokeAbl = mockAbl();
  JokeAbl.jokeRatingDao.getByJokeIdAndUuIdentity = () => false;
  JokeAbl.jokeRatingDao.create = () => null;
  JokeAbl.dao.update = () => {
    throw new ObjectStoreError("it failed.");
  };

  try {
    await JokeAbl.addRating("awid", { id: MONGO_ID, rating: 2 }, getSessionMock());
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/joke/addRating/jokeDaoUpdateFailed");
    expect(e.message).toEqual("Update joke by joke DAO update failed.");
  }
});

function mockAbl() {
  mockDaoFactory();
  const JokeAbl = require("../../app/abl/joke-abl");
  const JokesInstanceAbl = require("../../app/abl/jokes-instance-abl");
  JokesInstanceAbl.checkInstance = () => null;
  JokeAbl.dao.get = () => {
    return { id: 1, uuIdentity: 2 };
  };
  return JokeAbl;
}
