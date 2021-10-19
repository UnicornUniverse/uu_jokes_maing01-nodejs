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
  const result = await TestHelper.executeGetCommand(JOKES_INSTANCE_LOAD);
  expect(result.status).toBe(200);
  const dtoOut = result;
  expect(dtoOut.data.state).toEqual("underConstruction");
  expect(dtoOut.data.name).toEqual("uuJokes");
});
