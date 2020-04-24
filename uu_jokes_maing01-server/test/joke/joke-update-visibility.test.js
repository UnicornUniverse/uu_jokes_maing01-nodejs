const { TestHelper } = require("uu_appg01_server-test");
const { ObjectStoreError } = require("uu_appg01_server").ObjectStore;
const {
  JOKES_INSTANCE_INIT,
  JOKE_CREATE,
  JOKE_UPDATE_VISIBILITY,
  MONGO_ID,
  mockDaoFactory
} = require("../general-test-hepler");

beforeAll(async () => {
  await TestHelper.setup();
});

afterAll(() => {
  TestHelper.teardown();
});

beforeEach(async () => {
  await TestHelper.dropDatabase();
  await TestHelper.initAppInstance();
  await TestHelper.createAppWorkspace();
  await TestHelper.login("AwidLicenseOwner", false);
});

afterEach(() => {
  jest.restoreAllMocks();
});

test("HDS", async () => {
  await TestHelper.executePostCommand(JOKES_INSTANCE_INIT, { uuAppProfileAuthorities: "." });
  await TestHelper.login("Authorities");
  let joke = await TestHelper.executePostCommand(JOKE_CREATE, {
    name: "She lives with a broken man, a cracked polystyrene man"
  });
  expect(joke.visibility).toEqual(true);
  joke = await TestHelper.executePostCommand(JOKE_UPDATE_VISIBILITY, { id: joke.id, visibility: false });
  expect(joke.status).toEqual(200);
  expect(joke.visibility).toEqual(false);
});

test("A2 - jokes instance is closed", async () => {
  expect.assertions(4);
  await TestHelper.executePostCommand(JOKES_INSTANCE_INIT, { uuAppProfileAuthorities: ".", state: "closed" });
  await TestHelper.login("Authorities");
  try {
    await TestHelper.executePostCommand(JOKE_UPDATE_VISIBILITY, {});
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/joke/updateVisibility/jokesInstanceNotInProperState");
    expect(e.message).toEqual("JokesInstance is not in proper state [active|underConstruction].");
    expect(e.paramMap.state).toEqual("closed");
    expect(e.paramMap.expectedStateList).toEqual(["active", "underConstruction"]);
  }
});

test("A3 - unsupported keys in dtoIn", async () => {
  await TestHelper.executePostCommand(JOKES_INSTANCE_INIT, { uuAppProfileAuthorities: "." });
  await TestHelper.login("Authorities");
  let joke = await TestHelper.executePostCommand(JOKE_CREATE, { name: "Predavkovali se smutnymi pribehy" });
  joke = await TestHelper.executePostCommand(JOKE_UPDATE_VISIBILITY, {
    id: joke.id,
    visibility: true,
    ema: "mele maso"
  });
  expect(joke.status).toEqual(200);
  let warning = joke.uuAppErrorMap["uu-jokes-main/joke/updateVisibility/unsupportedKeys"];
  expect(warning).toBeTruthy();
});

test("A4 - invalid dtoIn", async () => {
  expect.assertions(2);
  await TestHelper.executePostCommand(JOKES_INSTANCE_INIT, { uuAppProfileAuthorities: "." });
  await TestHelper.login("Authorities");
  try {
    await TestHelper.executePostCommand(JOKE_UPDATE_VISIBILITY, {});
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/joke/updateVisibility/invalidDtoIn");
    expect(e.message).toEqual("DtoIn is not valid.");
  }
});

test("A5 - the update in db fails", async () => {
  expect.assertions(2);

  mockDaoFactory();

  const JokeAbl = require("../../app/abl/joke-abl");
  const JokesInstanceAbl = require("../../app/abl/jokes-instance-abl");

  JokesInstanceAbl.checkInstance = () => null;
  JokeAbl.dao = {
    updateVisibility: () => {
      throw new ObjectStoreError("it failed");
    }
  };

  let dtoIn = {
    id: MONGO_ID,
    visibility: true
  };

  try {
    await JokeAbl.updateVisibility("awid", dtoIn);
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/joke/updateVisibility/jokeDaoUpdateVisibilityFailed");
    expect(e.message).toEqual("Update joke by joke Dao updateVisibility failed");
  }
});
