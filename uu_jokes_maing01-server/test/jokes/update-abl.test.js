const { TestHelper } = require("uu_appg01_server-test");
const { ObjectStoreError } = require("uu_appg01_server").ObjectStore;
const { Uri } = require("uu_appg01_server").Uri;
const { Config } = require("uu_appg01_server").Utils;
const path = require("path");

const { JOKES_INSTANCE_UPDATE, mockDaoFactory } = require("../general-test-hepler");

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

test("HDS - simple", async () => {
  let result = await TestHelper.initUuAppWorkspace({ uuAppProfileAuthorities: "." });
  expect(result.name).toEqual("uuJokes");

  let name = "My uuJokes";
  result = await TestHelper.executePostCommand(JOKES_INSTANCE_UPDATE, { name });
  expect(result.status).toEqual(200);
  expect(result.jokes.name).toEqual(name);
});

test("A1 - unsupported keys", async () => {
  await TestHelper.initUuAppWorkspace({ uuAppProfileAuthorities: "." });

  let result = await TestHelper.executePostCommand(JOKES_INSTANCE_UPDATE, { something: "something" });
  expect(result.status).toBe(200);
  let errorMap = result.uuAppErrorMap;
  expect(errorMap).toBeTruthy();
  let warning = errorMap["uu-jokes-main/jokes/update/unsupportedKeys"];
  expect(warning).toBeTruthy();
  expect(warning.type).toEqual("warning");
  expect(warning.message).toEqual("DtoIn contains unsupported keys.");
});

test("A2 - invalid dtoIn", async () => {
  expect.assertions(2);
  await TestHelper.initUuAppWorkspace({ uuAppProfileAuthorities: "." });
  try {
    await TestHelper.executePostCommand(JOKES_INSTANCE_UPDATE, { name: true });
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/jokes/update/invalidDtoIn");
    expect(e.message).toEqual("DtoIn is not valid.");
  }
});

// TODO Fix mocDaoFactory
// test("A6 - updating joke instance fails", async () => {
//   expect.assertions(2);

//   await TestHelper.initUuAppWorkspace({ uuAppProfileAuthorities: "." });

//   let { UpdateAbl } = mockAbl();

//   UpdateAbl.dao.updateByAwid = () => {
//     throw new ObjectStoreError("it failed.");
//   };

//   let dtoIn = { name: "My uuJokes" };

//   try {
//     await UpdateAbl.update(mockUri, dtoIn);
//   } catch (e) {
//     console.error(e);
//     expect(e.code).toEqual("uu-jokes-main/jokes/update/jokesDaoUpdateByAwidFailed");
//     expect(e.message).toEqual("Updating uuJokes by jokes DAO updateByAwid failed.");
//   }
// });

// function mockAbl() {
//   mockDaoFactory();
//   const UpdateAbl = require("../../app/abl/jokes/update-abl");
//   return { UpdateAbl };
// }
