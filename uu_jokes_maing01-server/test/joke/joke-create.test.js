/*eslint-disable no-useless-escape*/

const { TestHelper } = require("uu_appg01_workspace-test");
const { ObjectStoreError } = require("uu_appg01_server").ObjectStore;
const {
  JOKES_INSTANCE_INIT,
  JOKE_CREATE,
  getImageStream,
  mockDaoFactory,
  getSessionMock,
  getAuthzResultMock
} = require("../general-test-hepler");

beforeAll(async () => {
  await TestHelper.setup();
});

afterAll(() => {
  TestHelper.teardown();
});

beforeEach(async () => {
  await TestHelper.dropDatabase();
  await TestHelper.initApp();
  await TestHelper.initAppWorkspace();
  await TestHelper.login("AwidOwner");
});

afterEach(() => {
  jest.restoreAllMocks();
});

test("HDS - no image, Authorities call", async () => {
  await TestHelper.executePostCommand(JOKES_INSTANCE_INIT, { uuAppProfileAuthorities: "." });
  await TestHelper.login("Authority");

  let name = "nejvtipnejsi vtip";
  let text = `
        /((((((\\\\
=======((((((((((\\\\\\
      ((           \\\\\\\\
      ( (*    _/      \\\\\\\\
       \    /  \      \\\\\\________________
        |  |   |       </                  ((\\\\
        o_|   /        /                      \ \\\\    \\\\\\\\
             |  ._    (                        \ \\\\\\\\\\\\\\\\
             | /                       /       /    \\\\\\\     \\
    .______/\/     /                 /       /         \\\\
    / __.____/    _/         ________(       /\\
   / / / ________/'---------'         \     /  \_
  / /  \ \                             \   \ \_  \\
 ( <    \ \                             >  /    \ \\
  \/     \\_                           / /       > )
          \_|                         / /       / /
                                    _//       _//
                                   /_|       /_|`;
  let dtoIn = {
    name,
    text
  };
  let joke = await TestHelper.executePostCommand(JOKE_CREATE, dtoIn);
  expect(joke.status).toEqual(200);
  let dtoOut = joke;
  expect(dtoOut.text).toEqual(text);
  expect(dtoOut.name).toEqual(name);
  expect(dtoOut.uuIdentity).toEqual("19-7019-1");
  expect(dtoOut.uuIdentityName).toBeTruthy();
  expect(dtoOut.averageRating).toEqual(0);
  expect(dtoOut.ratingCount).toEqual(0);
  expect(dtoOut.visibility).toEqual(true);
  expect(dtoOut.image).toBeUndefined();
  expect(dtoOut.categoryList).toBeUndefined();
  expect(dtoOut.uuAppErrorMap).toEqual({});
  expect(dtoOut.awid).toEqual(TestHelper.getAwid());
});

test("HDS - no image, Executives call", async () => {
  await TestHelper.executePostCommand(JOKES_INSTANCE_INIT, { uuAppProfileAuthorities: "." });
  await TestHelper.login("Executive");

  let dtoIn = {
    name: "hmm",
    text: "joo"
  };
  let joke = await TestHelper.executePostCommand(JOKE_CREATE, dtoIn);
  expect(joke.status).toEqual(200);
  let dtoOut = joke;
  expect(dtoOut.uuIdentity).toEqual("14-2710-1");
  expect(dtoOut.visibility).toEqual(false);
  expect(dtoOut.uuAppErrorMap).toEqual({});
});

test("HDS - image", async () => {
  await TestHelper.executePostCommand(JOKES_INSTANCE_INIT, { uuAppProfileAuthorities: "." });
  await TestHelper.login("Authority");

  let dtoIn = {
    name: "nejm",
    image: getImageStream()
  };
  let joke = await TestHelper.executePostCommand(JOKE_CREATE, dtoIn);
  expect(joke.status).toEqual(200);
  let dtoOut = joke;
  expect(dtoOut.image).toBeTruthy();
  expect(dtoOut.uuAppErrorMap).toEqual({});
});

test("A1 - jokesInstance does nto exist", async () => {
  expect.assertions(2);
  await TestHelper.login("Authority");
  try {
    await TestHelper.executePostCommand(JOKE_CREATE, { name: "Smutny programator" });
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/joke/create/jokesInstanceDoesNotExist");
    expect(e.message).toEqual("JokesInstance does not exist.");
  }
});

test("A2 - jokes instance is closed", async () => {
  expect.assertions(4);
  await TestHelper.executePostCommand(JOKES_INSTANCE_INIT, { uuAppProfileAuthorities: ".", state: "closed" });
  await TestHelper.login("Authority");
  try {
    await TestHelper.executePostCommand(JOKE_CREATE, { name: "Vesely partyzan" });
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/joke/create/jokesInstanceNotInProperState");
    expect(e.message).toEqual("JokesInstance is not in proper state [active|underConstruction].");
    expect(e.paramMap.state).toEqual("closed");
    expect(e.paramMap.expectedStateList).toEqual(["active", "underConstruction"]);
  }
});

test("A3 - unsupported keys in dtoIn", async () => {
  await TestHelper.executePostCommand(JOKES_INSTANCE_INIT, { uuAppProfileAuthorities: "." });
  await TestHelper.login("Authority");

  let joke = await TestHelper.executePostCommand(JOKE_CREATE, { name: "Hrebik v zasuvce", navic: "ja jsem navic" });
  expect(joke.status).toEqual(200);
  let warning = joke.uuAppErrorMap["uu-jokes-main/joke/create/unsupportedKeys"];
  expect(warning).toBeTruthy();
  expect(warning.type).toEqual("warning");
  expect(warning.message).toEqual("DtoIn contains unsupported keys.");
  expect(warning.paramMap.unsupportedKeyList).toEqual(["$.navic"]);
});

test("A4 - dtoIn is not valid", async () => {
  expect.assertions(2);
  await TestHelper.executePostCommand(JOKES_INSTANCE_INIT, { uuAppProfileAuthorities: "." });
  await TestHelper.login("Authority");

  try {
    await TestHelper.executePostCommand(JOKE_CREATE, { name: "Nehorlavy petrolej", image: 4 });
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/joke/create/invalidDtoIn");
    expect(e.message).toEqual("DtoIn is not valid.");
  }
});

test("A5 - creating image fails", async () => {
  expect.assertions(2);

  let { JokeModel, UuBinaryModel } = mockModels();
  jest.spyOn(UuBinaryModel, "createBinary").mockImplementation(() => {
    throw new Error("it failed");
  });

  try {
    await JokeModel.create(
      "awid",
      { name: "astronaut s pletenou cepici", image: getImageStream() },
      getSessionMock(),
      getAuthzResultMock()
    );
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/joke/create/uuBinaryCreateFailed");
    expect(e.message).toEqual("Creating uuBinary failed.");
  }
});

test("A6 - categories don't exist", async () => {
  await TestHelper.executePostCommand(JOKES_INSTANCE_INIT, { uuAppProfileAuthorities: "." });
  await TestHelper.login("Authority");

  let existingCategoryId = "012345678910111213141516";
  let nonExistentCategoryId = "171819202122232425262728";
  let dtoIn = {
    name: "Uz mi dochazi jmena vtipu",
    categoryList: [existingCategoryId, nonExistentCategoryId]
  };

  await TestHelper.executeDbScript(
    `db.getCollection('category').insert({_id:ObjectId("${existingCategoryId}"),awid:"${TestHelper.getAwid()}"})`
  );

  let result = await TestHelper.executePostCommand(JOKE_CREATE, dtoIn);
  expect(result.status).toBe(200);
  let dtoOut = result;
  expect(dtoOut.categoryList).toEqual([existingCategoryId]);

  let warning = dtoOut.uuAppErrorMap["uu-jokes-main/joke/create/categoryDoesNotExist"];
  expect(warning).toBeTruthy();
  expect(warning.type).toEqual("warning");
  expect(warning.message).toEqual("One or more categories with given categoryId do not exist.");
  expect(warning.paramMap.categoryList).toEqual([nonExistentCategoryId]);
});

test("A7 - storing the joke fails", async () => {
  expect.assertions(2);

  let { JokeModel } = mockModels();
  JokeModel.dao.create = () => {
    throw new ObjectStoreError("it failed");
  };

  try {
    await JokeModel.create("awid", { name: "za chvili pujdu domu" }, getSessionMock(), getAuthzResultMock());
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/joke/create/jokeDaoCreateFailed");
    expect(e.message).toEqual("Create joke by joke DAO create failed.");
  }
});

function mockModels() {
  mockDaoFactory();
  const JokeModel = require("../../app/models/joke-model");
  const { UuBinaryModel } = require("uu_appg01_binarystore-cmd");
  const JokesInstanceModel = require("../../app/models/jokes-instance-model");
  JokesInstanceModel.checkInstance = () => null;
  return { JokeModel, UuBinaryModel };
}