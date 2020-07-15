const { TestHelper } = require("uu_appg01_server-test");
const { ObjectStoreError } = require("uu_appg01_server").ObjectStore;
const { Config } = require("uu_appg01_server").Utils;
const path = require("path");

const {
  JOKES_INSTANCE_UPDATE,
  getImageStream,
  mockDaoFactory
} = require("../general-test-hepler");

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

test("HDS - simple", async () => {
  let result = await TestHelper.initUuAppWorkspace({ uuAppProfileAuthorities: "." });
  expect(result.state).toEqual("underConstruction");

  let closed = "closed";
  result = await TestHelper.executePostCommand(JOKES_INSTANCE_UPDATE, { state: closed });
  expect(result.status).toEqual(200);
  expect(result.state).toEqual(closed);
});

test("A1 - unsupported keys", async () => {
  await TestHelper.initUuAppWorkspace({ uuAppProfileAuthorities: "." });

  let result = await TestHelper.executePostCommand(JOKES_INSTANCE_UPDATE, { something: "something" });
  expect(result.status).toBe(200);
  let errorMap = result.uuAppErrorMap;
  expect(errorMap).toBeTruthy();
  let warning = errorMap["uu-jokes-main/jokesInstance/update/unsupportedKeys"];
  expect(warning).toBeTruthy();
  expect(warning.type).toEqual("warning");
  expect(warning.message).toEqual("DtoIn contains unsupported keys.");
});

test("A2 - invalid dtoIn", async () => {
  expect.assertions(2);
  await TestHelper.initUuAppWorkspace({ uuAppProfileAuthorities: "." });
  try {
    await TestHelper.executePostCommand(JOKES_INSTANCE_UPDATE, { state: "Czech Republic" });
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/jokesInstance/update/invalidDtoIn");
    expect(e.message).toEqual("DtoIn is not valid.");
  }
});

test("A4 - creating logo fails", async () => {
  expect.assertions(2);

  let { JokesInstanceAbl, UuBinaryAbl } = mockAbl();
  jest.spyOn(UuBinaryAbl, "createBinary").mockImplementation(() => {
    throw new Error("it failed");
  });
  JokesInstanceAbl.dao.updateByAwid = () => {
    return {};
  };
  JokesInstanceAbl.dao.getByAwid = () => {
    return {};
  };

  let dtoIn = { logo: getImageStream() };
  try {
    await JokesInstanceAbl.setLogo("awid", dtoIn);
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/jokesInstance/setLogo/uuBinaryCreateFailed");
    expect(e.message).toEqual("Creating uuBinary failed.");
  }
});

test("A5 - updating logo fails", async () => {
  expect.assertions(1);

  let { JokesInstanceAbl, UuBinaryAbl } = mockAbl();
  jest.spyOn(UuBinaryAbl, "updateBinary").mockImplementation(() => {
    throw new Error("it failed");
  });
  JokesInstanceAbl.dao.getByAwid = () => {
    return { logos: ["16x9"] };
  };

  let dtoIn = { logo: getImageStream() };
  try {
    await JokesInstanceAbl.setLogo("awid", dtoIn);
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/jokesInstance/setLogo/uuBinaryCreateFailed");
  }
});

test("A6 - updating joke instance fails", async () => {
  expect.assertions(2);

  let { JokesInstanceAbl } = mockAbl();
  JokesInstanceAbl.dao.updateByAwid = () => {
    throw new ObjectStoreError("it failed.");
  };

  let dtoIn = { state: "active" };
  try {
    await JokesInstanceAbl.update("awid", dtoIn);
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/jokesInstance/update/jokesInstanceDaoUpdateByAwidFailed");
    expect(e.message).toEqual("Update jokesInstance by jokesInstance Dao updateByAwid failed.");
  }
});

function mockAbl() {
  mockDaoFactory();
  const JokesInstanceAbl = require("../../app/abl/jokes-instance-abl");
  const UuBinaryAbl = require("uu_appg01_binarystore-cmd").UuBinaryModel;
  return { JokesInstanceAbl, UuBinaryAbl };
}
