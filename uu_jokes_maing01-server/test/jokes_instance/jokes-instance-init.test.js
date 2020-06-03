const { TestHelper } = require("uu_appg01_server-test");
const { ObjectStoreError } = require("uu_appg01_server").ObjectStore;
const { Uri } = require("uu_appg01_server").Uri;
const { getImageStream, mockDaoFactory } = require("../general-test-hepler");

const mockUri = Uri.parse("http://localhost/uu-jokes-maing01/11111111111111111111111111111111/sys/appWorkspace/init");

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
});

afterEach(() => {
  jest.restoreAllMocks();
});

test("HDS with minimal dtoIn and without logo", async () => {
  let roleGroupUri = "kedluben"; //almost any string can pass as uri
  let result = await TestHelper.initAppWorkspace({ uuAppProfileAuthorities: roleGroupUri });
  expect(result.status).toBe(200);
  let dtoOut = result;
  expect(dtoOut.state).toEqual("underConstruction");
  expect(dtoOut.name).toEqual("uuJokes");
  expect(dtoOut.logos).toBeUndefined();

  result = await TestHelper.executeGetCommand("sys/appWorkspace/appProfile/get", { appProfile: "Authorities" });
  expect(result.status).toBe(200);
  expect(result.roleGroupUri).toEqual(roleGroupUri);
});

test("HDS with minimal dtoIn and logo", async () => {
  let dtoIn = {
    uuAppProfileAuthorities: "kombajn",
    logo: getImageStream()
  };
  let result = await TestHelper.initAppWorkspace(dtoIn);
  expect(result.status).toBe(200);
  let dtoOut = result;
  expect(dtoOut.state).toEqual("underConstruction");
  expect(dtoOut.name).toEqual("uuJokes");
  expect(["16x9"]).toEqual(expect.arrayContaining(result.logos));

  //check if binary really exists
  result = await TestHelper.executeGetCommand("uu-app-binarystore/getBinary", { code: "16x9" });
  expect(result.status).toBe(200);
});

test("HDS with more complete dtoIn", async () => {
  let name = "dzouks";
  let state = "active";
  let dtoIn = {
    uuAppProfileAuthorities: "kombajn",
    name,
    state
  };
  let result = await TestHelper.initAppWorkspace(dtoIn);
  expect(result.status).toBe(200);
  expect(result.state).toEqual(state);
  expect(result.name).toEqual(name);
  expect(result.logos).toBeUndefined();
});

test("A1 - jokesInstance already exists", async () => {
  expect.assertions(3);
  let dtoIn = { uuAppProfileAuthorities: "mrkev" };
  let result = await TestHelper.initAppWorkspace(dtoIn);
  expect(result.status).toBe(200);

  try {
    await TestHelper.initAppWorkspace(dtoIn);
  } catch (e) {
    expect(e.code).toEqual("uu-app-workspace/forbiddenAwidSysState");
    expect(e.paramMap.currentSysState).toEqual("active");
  }
});

test("A2 - unsupported keys", async () => {
  let dtoIn = { uuAppProfileAuthorities: "mrkev", something: "something more" };
  let result = await TestHelper.initAppWorkspace(dtoIn);
  expect(result.status).toBe(200);

  let errorMap = result.uuAppErrorMap;
  expect(errorMap).toBeTruthy();
  let warning = errorMap["uu-jokes-main/jokesInstance/init/unsupportedKeys"];
  expect(warning).toBeTruthy();
  expect(warning.type).toEqual("warning");
  expect(warning.message).toEqual("DtoIn contains unsupported keys.");
});

test("A3 - invalid dtoIn", async () => {
  expect.assertions(2);
  try {
    await TestHelper.initAppWorkspace({});
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/jokesInstance/init/invalidDtoIn");
    expect(e.message).toEqual("DtoIn is not valid.");
  }
});

test("A4 - setProfile fails", async () => {
  expect.assertions(2);

  let { JokesInstanceAbl, SysAppProfileAbl } = mockAbl();
  jest.spyOn(SysAppProfileAbl, "setAppProfile").mockImplementation(() => {
    throw new Error("kolobezka");
  });

  let dtoIn = {
    uuAppProfileAuthorities: "bicykl"
  };
  try {
    await JokesInstanceAbl.init(mockUri, dtoIn);
  } catch (e) {
    expect(e.message).toEqual("Create uuAppProfile failed.");
    expect(e.code).toEqual("uu-jokes-main/jokesInstance/init/sys/setProfileFailed");
  }
});

test("A5 - creating uuBinary fails", async () => {
  expect.assertions(2);

  let { JokesInstanceAbl, SysAppProfileAbl, UuBinaryAbl } = mockAbl();
  jest.spyOn(SysAppProfileAbl, "setAppProfile").mockImplementation(() => {});
  jest.spyOn(UuBinaryAbl, "createBinary").mockImplementation(() => {
    throw new Error("kotrmelec");
  });

  let dtoIn = {
    uuAppProfileAuthorities: "holomajzna",
    logo: getImageStream()
  };
  try {
    await JokesInstanceAbl.init(mockUri, dtoIn);
  } catch (e) {
    expect(e.message).toEqual("Creating uuBinary failed.");
    expect(e.code).toEqual("uu-jokes-main/jokesInstance/init/uuBinaryCreateFailed");
  }
});

test("A6 - storing jokes instance fails", async () => {
  expect.assertions(2);

  let { JokesInstanceAbl, SysAppProfileAbl, UuBinaryAbl } = mockAbl();
  JokesInstanceAbl.dao.create = () => {
    throw new ObjectStoreError("it failed");
  };
  jest.spyOn(SysAppProfileAbl, "setAppProfile").mockImplementation(() => {});
  jest.spyOn(UuBinaryAbl, "createBinary").mockImplementation(() => {});

  let dtoIn = {
    uuAppProfileAuthorities: "someUri"
  };
  try {
    await JokesInstanceAbl.init(mockUri, dtoIn);
  } catch (e) {
    expect(e.message).toEqual("Create jokesInstance by jokesInstance DAO create failed.");
    expect(e.code).toEqual("uu-jokes-main/jokesInstance/init/jokesInstanceDaoCreateFailed");
  }
});

function mockAbl() {
  mockDaoFactory();
  const JokesInstanceAbl = require("../../app/abl/jokes-instance-abl");
  const SysAppProfileAbl = require("uu_appg01_server").Workspace.SysAppProfileAbl;
  const UuBinaryAbl = require("uu_appg01_binarystore-cmd").UuBinaryAbl;
  JokesInstanceAbl.dao.getByAwid = () => null;
  return { JokesInstanceAbl, SysAppProfileAbl, UuBinaryAbl };
}
