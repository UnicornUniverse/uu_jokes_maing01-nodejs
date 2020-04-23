const { TestHelper } = require("uu_appg01_server-test");
const { ObjectStoreError } = require("uu_appg01_server").ObjectStore;
const { JOKES_INSTANCE_INIT, CATEGORY_CREATE, mockDaoFactory } = require("../general-test-hepler");

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

afterEach(() => {
  jest.restoreAllMocks();
});

test("HDS", async () => {
  await TestHelper.executePostCommand(JOKES_INSTANCE_INIT, { uuAppProfileAuthorities: ".", state: "active" });
  await TestHelper.login("Authority");
  let categoryName = "(Mg,Fe2+)2(Mg,Fe2+)5Si8O2(OH)2";
  let response = await TestHelper.executePostCommand(CATEGORY_CREATE, { name: categoryName });
  expect(response.status).toEqual(200);
  let dtoOut = response;
  expect(dtoOut.name).toEqual(categoryName);
  expect(dtoOut.icon).toEqual("mdi-label");
  expect(dtoOut.awid).toEqual(TestHelper.getAwid());
  expect(dtoOut.uuAppErrorMap).toEqual({});
});

test("A1 - jokesInstance does nto exist", async () => {
  expect.assertions(2);
  await TestHelper.login("Authority");
  try {
    await TestHelper.executePostCommand(CATEGORY_CREATE, { name: "He sings lovesongs on a Casio." });
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/category/create/jokesInstanceDoesNotExist");
    expect(e.message).toEqual("JokesInstance does not exist.");
  }
});

test("A2 - jokes instance is closed", async () => {
  expect.assertions(4);
  await TestHelper.executePostCommand(JOKES_INSTANCE_INIT, { uuAppProfileAuthorities: ".", state: "closed" });
  await TestHelper.login("Authority");
  try {
    await TestHelper.executePostCommand(CATEGORY_CREATE, { name: "I don't know anymore.." });
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/category/create/jokesInstanceNotInProperState");
    expect(e.message).toEqual("JokesInstance is not in proper state [active|underConstruction].");
    expect(e.paramMap.state).toEqual("closed");
    expect(e.paramMap.expectedStateList).toEqual(["active", "underConstruction"]);
  }
});

test("A3 - unsupported keys in dtoIn", async () => {
  await TestHelper.executePostCommand(JOKES_INSTANCE_INIT, { uuAppProfileAuthorities: ".", state: "active" });
  await TestHelper.login("Authority");
  let response = await TestHelper.executePostCommand(CATEGORY_CREATE, {
    name: "I don't know anymore..",
    pche: "brm brm"
  });
  expect(response.status).toEqual(200);
  let warning = response.uuAppErrorMap["uu-jokes-main/category/create/unsupportedKeys"];
  expect(warning).toBeTruthy();
  expect(warning.type).toEqual("warning");
  expect(warning.message).toEqual("DtoIn contains unsupported keys.");
  expect(warning.paramMap.unsupportedKeyList).toEqual(["$.pche"]);
});

test("A4 - dtoIn is not valid", async () => {
  expect.assertions(2);
  await TestHelper.executePostCommand(JOKES_INSTANCE_INIT, { uuAppProfileAuthorities: ".", state: "active" });
  await TestHelper.login("Authority");
  try {
    await TestHelper.executePostCommand(CATEGORY_CREATE, {});
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/category/create/invalidDtoIn");
    expect(e.message).toEqual("DtoIn is not valid.");
  }
});

test("A5 - category with such name already exists", async () => {
  expect.assertions(3);
  await TestHelper.executePostCommand(JOKES_INSTANCE_INIT, { uuAppProfileAuthorities: ".", state: "active" });
  await TestHelper.login("Authority");
  let name = "...";
  await TestHelper.executePostCommand(CATEGORY_CREATE, { name: name });
  try {
    await TestHelper.executePostCommand(CATEGORY_CREATE, { name: name });
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/category/create/categoryNameNotUnique");
    expect(e.message).toEqual("Category name is not unique in awid.");
    expect(e.paramMap.categoryName).toEqual(name);
  }
});

test("A6 - creating category fails", async () => {
  mockDaoFactory();
  const CategoryAbl = require("../../app/abl/category-abl");
  const JokesInstanceAbl = require("../../app/abl/jokes-instance-abl");
  JokesInstanceAbl.checkInstance = () => null;
  CategoryAbl.dao.create = () => {
    throw new ObjectStoreError("it fails.");
  };

  try {
    await CategoryAbl.create("awid", { name: "..." });
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/category/create/categoryDaoCreateFailed");
    expect(e.message).toEqual("Create category by category DAO create failed.");
  }
});
