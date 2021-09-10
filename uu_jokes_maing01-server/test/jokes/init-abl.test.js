const { TestHelper } = require("uu_appg01_server-test");
const { ObjectStoreError } = require("uu_appg01_server").ObjectStore;
const { Uri } = require("uu_appg01_server").Uri;
const { Config } = require("uu_appg01_server").Utils;
const path = require("path");

const { mockDaoFactory } = require("../general-test-hepler");

const mockUri = Uri.parse("http://localhost/uu-jokes-maing01/11111111111111111111111111111111/sys/uuAppWorkspace/init");

beforeAll(async () => {
  await TestHelper.setup(null, { authEnabled: false });
  Config.set("server_root", path.resolve(__dirname, "..", ".."));
});

afterAll(() => {
  TestHelper.teardown();
});

beforeEach(async () => {
  await TestHelper.dropDatabase();
  await TestHelper.initUuSubAppInstance();
  await TestHelper.createUuAppWorkspace();
});

afterEach(() => {
  jest.restoreAllMocks();
});

test("HDS with minimal dtoIn", async () => {
  let roleGroupUri = "kedluben"; //almost any string can pass as uri
  let result = await TestHelper.initUuAppWorkspace({ uuAppProfileAuthorities: roleGroupUri });
  expect(result.status).toBe(200);
  let dtoOut = result;
  expect(dtoOut.state).toEqual("underConstruction");
  expect(dtoOut.name).toEqual("uuJokes");
  expect(dtoOut.logos).toBeUndefined();

  result = await TestHelper.executeGetCommand("sys/uuAppWorkspace/profile/get", { profile: "Authorities" });
  expect(result.status).toBe(200);
  expect(result.roleGroupUri).toEqual(roleGroupUri);
});

test("HDS with more complete dtoIn", async () => {
  let name = "dzouks";
  let state = "active";
  let dtoIn = {
    uuAppProfileAuthorities: "kombajn",
    name,
    state,
  };
  let result = await TestHelper.initUuAppWorkspace(dtoIn);
  expect(result.status).toBe(200);
  expect(result.state).toEqual(state);
  expect(result.name).toEqual(name);
  expect(result.logos).toBeUndefined();
});

test("A1 - jokesInstance already exists", async () => {
  expect.assertions(3);
  let dtoIn = { uuAppProfileAuthorities: "mrkev" };
  let result = await TestHelper.initUuAppWorkspace(dtoIn);
  expect(result.status).toBe(200);

  try {
    await TestHelper.initUuAppWorkspace(dtoIn);
  } catch (e) {
    expect(e.code).toEqual("uu-app-workspace/forbiddenAwidSysState");
    expect(e.paramMap.currentSysState).toEqual("active");
  }
});

test("A2 - unsupported keys", async () => {
  let dtoIn = { uuAppProfileAuthorities: "mrkev", something: "something more" };
  let result = await TestHelper.initUuAppWorkspace(dtoIn);
  expect(result.status).toBe(200);

  let errorMap = result.uuAppErrorMap;
  expect(errorMap).toBeTruthy();
  let warning = errorMap["uu-jokes-main/sys/uuAppWorkspace/init/unsupportedKeys"];
  expect(warning).toBeTruthy();
  expect(warning.type).toEqual("warning");
  expect(warning.message).toEqual("DtoIn contains unsupported keys.");
});

test("A3 - invalid dtoIn", async () => {
  expect.assertions(2);
  try {
    await TestHelper.initUuAppWorkspace({});
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/sys/uuAppWorkspace/init/invalidDtoIn");
    console.log(e.message);
    expect(e.message).toEqual("DtoIn is not valid.");
  }
});

test("A4 - setProfile fails", async () => {
  expect.assertions(2);

  let { InitAbl, Profile } = mockAbl();

  jest.spyOn(Profile, "set").mockImplementation(() => {
    throw new Error("kolobezka");
  });

  let dtoIn = {
    uuAppProfileAuthorities: "bicykl",
  };

  try {
    await InitAbl.init(mockUri, dtoIn);
  } catch (e) {
    expect(e.message).toEqual("Set of Authorities profile failed.");
    expect(e.code).toEqual("uu-jokes-main/sys/uuAppWorkspace/init/sysSetProfileFailed");
  }
});

test("A6 - storing jokes instance fails", async () => {
  expect.assertions(2);

  let { InitAbl } = mockAbl();

  InitAbl.dao.create = () => {
    throw new ObjectStoreError("it failed");
  };

  let dtoIn = {
    uuAppProfileAuthorities: "someUri",
  };

  try {
    await InitAbl.init(mockUri, dtoIn);
  } catch (e) {
    expect(e.message).toEqual("Create jokes by DAO method failed.");
    expect(e.code).toEqual("uu-jokes-main/sys/uuAppWorkspace/init/jokesDaoCreateFailed");
  }
});

function mockAbl() {
  mockDaoFactory();
  const InitAbl = require("../../app/abl/jokes/init-abl");
  const Profile = require("uu_appg01_server").Workspace.Profile;
  InitAbl.dao.createSchema = () => null;
  return { InitAbl, Profile };
}
