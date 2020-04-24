const { TestHelper } = require("uu_appg01_server-test");
const { JOKES_INSTANCE_INIT, CATEGORY_CREATE, CATEGORY_GET, MONGO_ID } = require("../general-test-hepler");

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
  await TestHelper.login("AwidLicenseOwner", false);
});

test("HDS", async () => {
  await TestHelper.executePostCommand(JOKES_INSTANCE_INIT, {
    uuAppProfileAuthorities: "jaJsemTakyUri",
    state: "active"
  });
  await TestHelper.login("Authorities");
  let name = "Steven Senegal";
  let create = await TestHelper.executePostCommand(CATEGORY_CREATE, { name: name });

  // get category by id
  let getOne = await TestHelper.executeGetCommand(CATEGORY_GET, { id: create.id });
  expect(getOne.status).toEqual(200);
  expect(getOne).toEqual(create);

  // get category by name (it is the same category as before)
  let getTwo = await TestHelper.executeGetCommand(CATEGORY_GET, { name: name });
  expect(getTwo.status).toEqual(200);
  expect(getTwo).toEqual(getOne);
});

test("A2 - jokes instance is closed", async () => {
  expect.assertions(4);
  await TestHelper.executePostCommand(JOKES_INSTANCE_INIT, { uuAppProfileAuthorities: ".", state: "closed" });
  await TestHelper.login("Authorities");
  try {
    await TestHelper.executeGetCommand(CATEGORY_GET, { id: MONGO_ID });
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/category/get/jokesInstanceNotInProperState");
    expect(e.message).toEqual("JokesInstance is not in proper state [active|underConstruction].");
    expect(e.paramMap.state).toEqual("closed");
    expect(e.paramMap.expectedStateList).toEqual(["active", "underConstruction"]);
  }
});

test("A3 - jokes instance is under construction", async () => {
  expect.assertions(3);
  await TestHelper.executePostCommand(JOKES_INSTANCE_INIT, {
    uuAppProfileAuthorities: ".",
    state: "underConstruction"
  });
  await TestHelper.login("Readers");
  try {
    await TestHelper.executeGetCommand(CATEGORY_GET, { id: MONGO_ID });
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/category/get/jokesInstanceIsUnderConstruction");
    expect(e.message).toEqual("JokesInstance is in state underConstruction.");
    expect(e.paramMap.state).toEqual("underConstruction");
  }
});

test("A4 - unsupported keys in dtoIn", async () => {
  await TestHelper.executePostCommand(JOKES_INSTANCE_INIT, { uuAppProfileAuthorities: ".", state: "active" });
  await TestHelper.login("Authorities");
  let joke = await TestHelper.executePostCommand(CATEGORY_CREATE, { name: "..." });
  joke = await TestHelper.executeGetCommand(CATEGORY_GET, { id: joke.id, whatThe: "heck" });
  expect(joke.status).toEqual(200);
  let warning = joke.uuAppErrorMap["uu-jokes-main/category/get/unsupportedKeys"];
  expect(warning).toBeTruthy();
  expect(warning.type).toEqual("warning");
  expect(warning.message).toEqual("DtoIn contains unsupported keys.");
  expect(warning.paramMap.unsupportedKeyList).toEqual(["$.whatThe"]);
});

test("A5 - invalid dtoIn", async () => {
  expect.assertions(2);
  await TestHelper.executePostCommand(JOKES_INSTANCE_INIT, { uuAppProfileAuthorities: ".", state: "active" });
  await TestHelper.login("Authorities");
  try {
    await TestHelper.executeGetCommand(CATEGORY_GET, {});
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/category/get/invalidDtoIn");
    expect(e.message).toEqual("DtoIn is not valid.");
  }
});

test("A6 - category does not exist", async () => {
  expect.assertions(8);
  await TestHelper.executePostCommand(JOKES_INSTANCE_INIT, { uuAppProfileAuthorities: ".", state: "active" });
  await TestHelper.login("Authorities");
  try {
    await TestHelper.executeGetCommand(CATEGORY_GET, { id: MONGO_ID });
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/category/get/categoryDoesNotExist");
    expect(e.message).toEqual("Category does not exist.");
    expect(e.paramMap.categoryId).toEqual(MONGO_ID);
    expect(e.paramMap.categoryName).toBeUndefined();
  }
  let name = "...";
  try {
    await TestHelper.executeGetCommand(CATEGORY_GET, { name });
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/category/get/categoryDoesNotExist");
    expect(e.message).toEqual("Category does not exist.");
    expect(e.paramMap.categoryId).toBeUndefined();
    expect(e.paramMap.categoryName).toEqual(name);
  }
});
