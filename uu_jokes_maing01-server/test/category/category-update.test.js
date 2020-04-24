const { TestHelper } = require("uu_appg01_server-test");
const { JOKES_INSTANCE_INIT, CATEGORY_CREATE, CATEGORY_UPDATE, MONGO_ID } = require("../general-test-hepler");

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

test("HDS", async () => {
  await TestHelper.executePostCommand(JOKES_INSTANCE_INIT, { uuAppProfileAuthorities: "." });
  let response = await TestHelper.executePostCommand(CATEGORY_CREATE, { name: "..." });
  let name = "Bangladesh",
    icon = "Bhutan";
  response = await TestHelper.executePostCommand(CATEGORY_UPDATE, { id: response.id, name, icon });
  expect(response.status).toEqual(200);
  expect(response.name).toEqual(name);
  expect(response.icon).toEqual(icon);
});

test("A2 - jokes instance is closed", async () => {
  expect.assertions(4);
  await TestHelper.executePostCommand(JOKES_INSTANCE_INIT, { uuAppProfileAuthorities: ".", state: "closed" });
  try {
    await TestHelper.executePostCommand(CATEGORY_UPDATE, {});
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/category/update/jokesInstanceNotInProperState");
    expect(e.message).toEqual("JokesInstance is not in proper state [active|underConstruction].");
    expect(e.paramMap.state).toEqual("closed");
    expect(e.paramMap.expectedStateList).toEqual(["active", "underConstruction"]);
  }
});

test("A3 - unsupported keys in dtoIn", async () => {
  await TestHelper.executePostCommand(JOKES_INSTANCE_INIT, { uuAppProfileAuthorities: "." });
  let response = await TestHelper.executePostCommand(CATEGORY_CREATE, { name: "Thimphu" });
  response = await TestHelper.executePostCommand(CATEGORY_UPDATE, { id: response.id, city: "Dhaka" });
  expect(response.status).toEqual(200);
  let warning = response.uuAppErrorMap["uu-jokes-main/category/update/unsupportedKeys"];
  expect(warning).toBeTruthy();
});

test("A4 - invalid dtoIn", async () => {
  expect.assertions(2);
  await TestHelper.executePostCommand(JOKES_INSTANCE_INIT, { uuAppProfileAuthorities: "." });
  try {
    await TestHelper.executePostCommand(CATEGORY_UPDATE, {});
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/category/update/invalidDtoIn");
    expect(e.message).toEqual("DtoIn is not valid.");
  }
});

test("A5 - category with such name already exists", async () => {
  expect.assertions(3);
  await TestHelper.executePostCommand(JOKES_INSTANCE_INIT, { uuAppProfileAuthorities: "." });
  let name = "Myanmar";
  await TestHelper.executePostCommand(CATEGORY_CREATE, { name });
  let response = await TestHelper.executePostCommand(CATEGORY_CREATE, { name: "." });
  try {
    await TestHelper.executePostCommand(CATEGORY_UPDATE, { id: response.id, name });
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/category/update/categoryNameNotUnique");
    expect(e.message).toEqual("Category name is not unique in awid.");
    expect(e.paramMap.categoryName).toEqual(name);
  }
});

test("A6 - category update fails, especially if there is no category", async () => {
  expect.assertions(2);
  await TestHelper.executePostCommand(JOKES_INSTANCE_INIT, { uuAppProfileAuthorities: "." });
  try {
    await TestHelper.executePostCommand(CATEGORY_UPDATE, { id: MONGO_ID });
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/category/update/categoryDaoUpdateFailed");
    expect(e.message).toEqual("Update category by category Dao update failed.");
  }
});
