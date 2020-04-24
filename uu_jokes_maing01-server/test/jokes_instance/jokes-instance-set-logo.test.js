const { TestHelper } = require("uu_appg01_server-test");
const { ObjectStoreError } = require("uu_appg01_server").ObjectStore;
const {
  JOKES_INSTANCE_INIT,
  JOKES_INSTANCE_SET_LOGO,
  getImageStream,
  mockDaoFactory
} = require("../general-test-hepler");

const DEFAULT_LOGO_TYPE = "16x9";

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

test("HDS - create logo", async () => {
  let result = await TestHelper.executePostCommand(JOKES_INSTANCE_INIT, { uuAppProfileAuthorities: "." });
  expect(result.logos).toBeUndefined();
  // there are no binaries yet
  result = await TestHelper.executeGetCommand("uu-app-binarystore/listBinaries");
  expect(result.pageInfo.total).toEqual(0);

  let dtoIn = { logo: getImageStream() };
  result = await TestHelper.executePostCommand(JOKES_INSTANCE_SET_LOGO, dtoIn);
  expect(result.status).toEqual(200);
  expect(result.logos).toBeTruthy();
  expect([DEFAULT_LOGO_TYPE]).toEqual(expect.arrayContaining(result.logos));

  // check if binary was really created
  result = await TestHelper.executeGetCommand("uu-app-binarystore/listBinaries");
  expect(result.pageInfo.total).toEqual(1);
});

test("HDS - create logo type 3x2", async () => {
  let type = "3x2";
  let result = await TestHelper.executePostCommand(JOKES_INSTANCE_INIT, { uuAppProfileAuthorities: "." });
  expect(result.logos).toBeUndefined();
  // there are no binaries yet
  result = await TestHelper.executeGetCommand("uu-app-binarystore/listBinaries");
  expect(result.pageInfo.total).toEqual(0);

  let dtoIn = {type: type, logo: getImageStream() };
  result = await TestHelper.executePostCommand(JOKES_INSTANCE_SET_LOGO, dtoIn);
  expect(result.status).toEqual(200);
  expect(result.logos).toBeTruthy();
  expect([type]).toEqual(expect.arrayContaining(result.logos));

  // check if binary was really created
  result = await TestHelper.executeGetCommand("uu-app-binarystore/listBinaries");
  expect(result.pageInfo.total).toEqual(1);
});

test("HDS - update logo", async () => {
  let dtoIn = { uuAppProfileAuthorities: ".", logo: getImageStream() };
  let result = await TestHelper.executePostCommand(JOKES_INSTANCE_INIT, dtoIn);
  expect(result.logos).toBeTruthy();
  expect([DEFAULT_LOGO_TYPE]).toEqual(expect.arrayContaining(result.logos));

  // the binary has been just created, its revision is 0
  result = await TestHelper.executeGetCommand("uu-app-binarystore/getBinary", { code: DEFAULT_LOGO_TYPE });
  expect(result.sys.rev).toEqual(0);

  dtoIn = { logo: getImageStream() };
  result = await TestHelper.executePostCommand(JOKES_INSTANCE_SET_LOGO, dtoIn);
  expect(result.status).toEqual(200);
  expect(result.logos).toBeTruthy();
  expect([DEFAULT_LOGO_TYPE]).toEqual(expect.arrayContaining(result.logos));

  // the binary was updated, i.e. revision increased
  result = await TestHelper.executeGetCommand("uu-app-binarystore/getBinary", { code: DEFAULT_LOGO_TYPE });
  expect(result.sys.rev).toEqual(1);
});

test("A1 - unsupported keys", async () => {
  await TestHelper.executePostCommand(JOKES_INSTANCE_INIT, { uuAppProfileAuthorities: "." });

  let dtoIn = { logo: getImageStream(), something: "something" };
  let result = await TestHelper.executePostCommand(JOKES_INSTANCE_SET_LOGO, dtoIn);
  expect(result.status).toBe(200);
  let errorMap = result.uuAppErrorMap;
  expect(errorMap).toBeTruthy();
  let warning = errorMap["uu-jokes-main/jokesInstance/setLogo/unsupportedKeys"];
  expect(warning).toBeTruthy();
  expect(warning.type).toEqual("warning");
  expect(warning.message).toEqual("DtoIn contains unsupported keys.");
});

test("A2 - invalid dtoIn", async () => {
  expect.assertions(2);
  await TestHelper.executePostCommand(JOKES_INSTANCE_INIT, { uuAppProfileAuthorities: "." });

  try {
    await TestHelper.executePostCommand(JOKES_INSTANCE_SET_LOGO, { state: "Czech Republic" });
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/jokesInstance/setLogo/invalidDtoIn");
    expect(e.message).toEqual("DtoIn is not valid.");
  }
});

test("A5 - creating logo fails", async () => {
  expect.assertions(2);

  let { JokesInstanceModel, UuBinaryAbl } = mockModels();
  jest.spyOn(UuBinaryAbl, "createBinary").mockImplementation(() => {
    throw new Error("it failed");
  });
  JokesInstanceModel.dao.getByAwid = () => {
    return {};
  };

  let dtoIn = { logo: getImageStream() };
  try {
    await JokesInstanceModel.setLogo("awid", dtoIn);
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/jokesInstance/setLogo/uuBinaryCreateFailed");
    expect(e.message).toEqual("Creating uuBinary failed.");
  }
});

test("A6 - updating logo fails", async () => {
  expect.assertions(2);

  let { JokesInstanceModel, UuBinaryAbl } = mockModels();
  jest.spyOn(UuBinaryAbl, "updateBinary").mockImplementation(() => {
    throw new Error("it failed");
  });
  JokesInstanceModel.dao.getByAwid = () => {
    return { logos: [DEFAULT_LOGO_TYPE] };
  };

  let dtoIn = { logo: getImageStream() };
  try {
    await JokesInstanceModel.setLogo("awid", dtoIn);
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/jokesInstance/setLogo/uuBinaryUpdateBinaryDataFailed");
    expect(e.message).toEqual("Updating uuBinary data failed.");
  }
});

test("A7 - updating joke instance fails", async () => {
  expect.assertions(2);

  let { JokesInstanceModel, UuBinaryAbl } = mockModels();
  jest.spyOn(UuBinaryAbl, "createBinary").mockImplementation(() => {});

  JokesInstanceModel.dao = {
    getByAwid: () => {
      return {};
    },
    updateByAwid: () => {
      throw new ObjectStoreError("it failed.");
    }
  };

  let dtoIn = { logo: getImageStream() };
  try {
    await JokesInstanceModel.setLogo("awid", dtoIn);
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/jokesInstance/setLogo/jokesInstanceDaoUpdateByAwidFailed");
    expect(e.message).toEqual("Update jokesInstance by jokesInstance Dao updateByAwid failed.");
  }
});

function mockModels() {
  mockDaoFactory();
  const JokesInstanceModel = require("../../app/abl/jokes-instance-abl");
  const UuBinaryAbl = require("uu_appg01_binarystore-cmd").UuBinaryModel;
  return { JokesInstanceModel, UuBinaryAbl };
}
