const { TestHelper } = require("uu_appg01_server-test");
const { JOKE_CREATE, JOKE_GET, MONGO_ID } = require("../general-test-hepler");

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

test("HDS", async () => {
  let dtoIn = {
    uuAppProfileAuthorities: "jaJsemTakyUri",
    state: "active",
  };
  await TestHelper.initUuAppWorkspace(dtoIn);
  await TestHelper.login("Authorities");
  let create = await TestHelper.executePostCommand(JOKE_CREATE, { name: "Silvester Stalin" });
  let get = await TestHelper.executeGetCommand(JOKE_GET, { id: create.id });
  expect(get.status).toEqual(200);
  expect(get).toEqual(create);
});

test("A2 - jokes instance is closed", async () => {
  expect.assertions(4);
  let dtoIn = {
    uuAppProfileAuthorities: "vimperskeParky",
    state: "closed",
  };
  await TestHelper.initUuAppWorkspace(dtoIn);
  await TestHelper.login("Authorities");
  try {
    await TestHelper.executeGetCommand(JOKE_GET, { id: MONGO_ID });
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/joke/get/jokesNotInCorrectState");
    expect(e.message).toEqual("UuObject jokes is not in correct state.");
    expect(e.paramMap.state).toEqual("closed");
    expect(e.paramMap.expectedStateList).toEqual(["active", "underConstruction"]);
  }
});

test("A3 - jokes instance is under construction", async () => {
  expect.assertions(3);
  let dtoIn = {
    uuAppProfileAuthorities: "jogurtovaCokolada",
    state: "underConstruction",
  };
  await TestHelper.initUuAppWorkspace(dtoIn);
  await TestHelper.login("Readers");
  try {
    await TestHelper.executeGetCommand(JOKE_GET, { id: MONGO_ID });
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/joke/get/jokesInstanceIsUnderConstruction");
    expect(e.message).toEqual("JokesInstance is in underConstruction state.");
    expect(e.paramMap.state).toEqual("underConstruction");
  }
});

test("A4 - unsupported keys in dtoIn", async () => {
  let dtoIn = {
    uuAppProfileAuthorities: "konviceNaCaj",
    state: "active",
  };
  await TestHelper.initUuAppWorkspace(dtoIn);
  await TestHelper.login("Authorities");
  let joke = await TestHelper.executePostCommand(JOKE_CREATE, { name: "zelena okurka" });
  joke = await TestHelper.executeGetCommand(JOKE_GET, { id: joke.id, cosi: "to je jedno, co tu je" });
  expect(joke.status).toEqual(200);
  let warning = joke.uuAppErrorMap["uu-jokes-main/joke/get/unsupportedKeys"];
  expect(warning).toBeTruthy();
  expect(warning.type).toEqual("warning");
  expect(warning.message).toEqual("DtoIn contains unsupported keys.");
  expect(warning.paramMap.unsupportedKeyList).toEqual(["$.cosi"]);
});

test("A5 - invalid dtoIn", async () => {
  expect.assertions(2);
  let dtoIn = {
    uuAppProfileAuthorities: "umeleSladidlo",
    state: "active",
  };
  await TestHelper.initUuAppWorkspace(dtoIn);
  await TestHelper.login("Authorities");
  try {
    await TestHelper.executeGetCommand(JOKE_GET, {});
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/joke/get/invalidDtoIn");
    expect(e.message).toEqual("DtoIn is not valid.");
  }
});

test("A6 - joke does not exist", async () => {
  expect.assertions(3);
  let dtoIn = {
    uuAppProfileAuthorities: "umeleSladidlo",
    state: "active",
  };
  await TestHelper.initUuAppWorkspace(dtoIn);
  await TestHelper.login("Authorities");
  try {
    await TestHelper.executeGetCommand(JOKE_GET, { id: MONGO_ID });
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/joke/get/jokeDoesNotExist");
    expect(e.message).toEqual("Joke does not exist.");
    expect(e.paramMap.jokeId).toEqual(MONGO_ID);
  }
});
