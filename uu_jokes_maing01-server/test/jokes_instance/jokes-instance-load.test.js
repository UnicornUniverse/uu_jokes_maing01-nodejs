const { TestHelper } = require("uu_appg01_server-test");
const { JOKES_INSTANCE_INIT, JOKES_INSTANCE_LOAD } = require("../general-test-hepler");

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
  await TestHelper.initAppWorkspace();
  await TestHelper.login("AwidLicenseOwner", false);
});

test("HDS", async () => {
  await TestHelper.executePostCommand(JOKES_INSTANCE_INIT, { uuAppProfileAuthorities: "." });
  await TestHelper.login("Authority");
  let result = await TestHelper.executeGetCommand(JOKES_INSTANCE_LOAD);
  expect(result.status).toBe(200);
  let dtoOut = result;
  expect(dtoOut.state).toEqual("underConstruction");
  expect(dtoOut.name).toEqual("uuJokes");
  expect(dtoOut.logo).toBeUndefined();
  expect(dtoOut.categoryList).toEqual([]);
  expect(dtoOut.authorizedProfileList).toEqual(["Authorities"]);
});

test("A1 - loading non existent jokes instance", async () => {
  expect.assertions(2);
  await TestHelper.login("Authority");
  try {
    await TestHelper.executeGetCommand(JOKES_INSTANCE_LOAD);
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/jokesInstance/load/jokesInstanceDoesNotExist");
    expect(e.message).toEqual("JokesInstance does not exist.");
  }
});

test("A2 - closed jokes instance", async () => {
  expect.assertions(4);
  await TestHelper.executePostCommand(JOKES_INSTANCE_INIT, { uuAppProfileAuthorities: ".", state: "closed" });
  await TestHelper.login("Authority");
  try {
    await TestHelper.executeGetCommand(JOKES_INSTANCE_LOAD);
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/jokesInstance/load/jokesInstanceNotInProperState");
    expect(e.message).toEqual("JokesInstance is not in proper state [active|underConstruction].");
    expect(e.paramMap.state).toEqual("closed");
    expect(e.paramMap.expectedStateList).toEqual(["active", "underConstruction"]);
  }
});

test("A3 - jokes instance is under construction and caller is a Reader", async () => {
  expect.assertions(3);
  await TestHelper.executePostCommand(JOKES_INSTANCE_INIT, {
    uuAppProfileAuthorities: ".",
    state: "underConstruction"
  });
  await TestHelper.login("Reader");
  try {
    await TestHelper.executeGetCommand(JOKES_INSTANCE_LOAD);
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/jokesInstance/load/jokesInstanceIsUnderConstruction");
    expect(e.message).toEqual("JokesInstance is in state underConstruction.");
    expect(e.paramMap.state).toEqual("underConstruction");
  }
});
