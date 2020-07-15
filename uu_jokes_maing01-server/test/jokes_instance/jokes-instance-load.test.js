const { TestHelper } = require("uu_appg01_server-test");
const { JOKES_INSTANCE_LOAD } = require("../general-test-hepler");

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
  await TestHelper.initUuAppWorkspace({ uuAppProfileAuthorities: "." });
  await TestHelper.login("Authorities");
  let result = await TestHelper.executeGetCommand(JOKES_INSTANCE_LOAD);
  expect(result.status).toBe(200);
  let dtoOut = result;
  expect(dtoOut.state).toEqual("underConstruction");
  expect(dtoOut.name).toEqual("uuJokes");
  expect(dtoOut.logo).toBeUndefined();
  expect(dtoOut.categoryList).toEqual([]);
  expect(dtoOut.authorizedProfileList).toEqual(["Authorities"]);
});

test("A2 - closed jokes instance", async () => {
  expect.assertions(4);
  await TestHelper.initUuAppWorkspace({ uuAppProfileAuthorities: "." , state: "closed"});
  await TestHelper.login("Authorities");
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
  let dtoIn =  {
    uuAppProfileAuthorities: ".",
    state: "underConstruction"
  };
  await TestHelper.initUuAppWorkspace(dtoIn);
  await TestHelper.login("Readers");
  try {
    await TestHelper.executeGetCommand(JOKES_INSTANCE_LOAD);
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/jokesInstance/load/jokesInstanceIsUnderConstruction");
    expect(e.message).toEqual("JokesInstance is in state underConstruction.");
    expect(e.paramMap.state).toEqual("underConstruction");
  }
});
