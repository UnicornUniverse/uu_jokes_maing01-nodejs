const { TestHelper } = require("uu_appg01_server-test");
const { CATEGORY_CREATE, CATEGORY_LIST } = require("../general-test-hepler");

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
  await TestHelper.initAppWorkspace({ uuAppProfileAuthorities: "." , state: "active"});
  await TestHelper.login("Authorities");

  let nameOne = "cats";
  let nameTwo = "dogs";
  await TestHelper.executePostCommand(CATEGORY_CREATE, { name: nameOne });
  await TestHelper.executePostCommand(CATEGORY_CREATE, { name: nameTwo });

  let list = await TestHelper.executeGetCommand(CATEGORY_LIST, { order: "desc" });
  expect(list.status).toEqual(200);
  expect(list.pageInfo.total).toEqual(2);

  expect(list.itemList[0].name).toEqual("dogs");
  expect(list.itemList[1].name).toEqual("cats");
  let names = [list.itemList[0].name, list.itemList[1].name].slice(0).sort();
  expect(names).toEqual([nameOne, nameTwo]);
});

test("HDS - custom pageInfo", async () => {
  await TestHelper.initAppWorkspace({ uuAppProfileAuthorities: "." , state: "active"});
  await TestHelper.login("Authorities");

  let nameOne = "birds";
  let nameTwo = "pokemons";
  await TestHelper.executePostCommand(CATEGORY_CREATE, { name: nameOne });
  await TestHelper.executePostCommand(CATEGORY_CREATE, { name: nameTwo });

  let pageSize = 1;
  let pageIndex = 1;
  let list = await TestHelper.executeGetCommand(CATEGORY_LIST, {
    pageInfo: { pageSize: pageSize, pageIndex: pageIndex }
  });
  expect(list.status).toEqual(200);
  expect(list.pageInfo.total).toEqual(2);
  expect(list.pageInfo.pageSize).toEqual(pageSize);
  expect(list.pageInfo.pageIndex).toEqual(pageIndex);
  // the list cmd doesn't (yet) specify the order in which the items are returned
  let expectedNamePattern = new RegExp(`^(${nameOne}|${nameTwo})$`);
  expect(list.itemList[0].name).toMatch(expectedNamePattern);
});

test("A2 - jokes instance is closed", async () => {
  expect.assertions(4);
  let dtoIn = {
    uuAppProfileAuthorities: ".",
    state: "closed"
  };
  await TestHelper.initAppWorkspace(dtoIn);
  await TestHelper.login("Authorities");
  try {
    await TestHelper.executeGetCommand(CATEGORY_LIST);
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/category/list/jokesInstanceNotInProperState");
    expect(e.message).toEqual("JokesInstance is not in proper state [active|underConstruction].");
    expect(e.paramMap.state).toEqual("closed");
    expect(e.paramMap.expectedStateList).toEqual(["active", "underConstruction"]);
  }
});

test("A3 - jokes instance is under construction", async () => {
  expect.assertions(3);
  let dtoIn = {
    uuAppProfileAuthorities: ".",
    state: "underConstruction"
  };
  await TestHelper.initAppWorkspace(dtoIn);
  await TestHelper.login("Readers");
  try {
    await TestHelper.executeGetCommand(CATEGORY_LIST);
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/category/list/jokesInstanceIsUnderConstruction");
    expect(e.message).toEqual("JokesInstance is in state underConstruction.");
    expect(e.paramMap.state).toEqual("underConstruction");
  }
});

test("A4 - unsupported keys in dtoIn", async () => {
  await TestHelper.initAppWorkspace({ uuAppProfileAuthorities: "." , state: "active"});
  await TestHelper.login("Authorities");
  let response = await TestHelper.executeGetCommand(CATEGORY_LIST, { brambor: true });
  expect(response.status).toEqual(200);
  let warning = response.uuAppErrorMap["uu-jokes-main/category/list/unsupportedKeys"];
  expect(warning).toBeTruthy();
  expect(warning.type).toEqual("warning");
  expect(warning.message).toEqual("DtoIn contains unsupported keys.");
  expect(warning.paramMap.unsupportedKeyList).toEqual(["$.brambor"]);
});

test("A5 - invalid dtoIn", async () => {
  expect.assertions(2);
  await TestHelper.initAppWorkspace({ uuAppProfileAuthorities: "." , state: "active"});
  await TestHelper.login("Authorities");
  try {
    await TestHelper.executeGetCommand(CATEGORY_LIST, { pageInfo: false });
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/category/list/invalidDtoIn");
    expect(e.message).toEqual("DtoIn is not valid.");
  }
});
