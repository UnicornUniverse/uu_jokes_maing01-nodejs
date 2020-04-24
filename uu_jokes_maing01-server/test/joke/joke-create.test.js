/*eslint-disable no-useless-escape*/

const fs = require("fs");
const path = require("path");
const { TestHelper } = require("uu_appg01_server-test");
const { ObjectStoreError } = require("uu_appg01_server").ObjectStore;
const {
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
  await TestHelper.initAppInstance();
  await TestHelper.createAppWorkspace();
});

afterEach(() => {
  jest.restoreAllMocks();
});

test("HDS - no image, Authorities call", async () => {
  await TestHelper.initAppWorkspace({ uuAppProfileAuthorities: "." });
  await TestHelper.login("Authorities");
  let name = "nejvtipnejsi vtip";
  let text = `
        /((((((\\\\
=======((((((((((\\\\\\
      ((           \\\\\\\\\\\\\\\\
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
  expect(dtoOut.uuIdentity).toEqual("14-2710-1");
  expect(dtoOut.uuIdentityName).toBeTruthy();
  expect(dtoOut.averageRating).toEqual(0);
  expect(dtoOut.ratingCount).toEqual(0);
  expect(dtoOut.visibility).toEqual(true);
  expect(dtoOut.image).toBeUndefined();
  expect(dtoOut.categoryList).toEqual([]);
  expect(dtoOut.uuAppErrorMap).toEqual({});
  expect(dtoOut.awid).toEqual(TestHelper.getAwid());
});

test("HDS - no image, Executives call", async () => {
  await TestHelper.initAppWorkspace({ uuAppProfileAuthorities: "." });
  await TestHelper.login("Executives");

  let dtoIn = {
    name: "hmm",
    text: "joo"
  };
  let joke = await TestHelper.executePostCommand(JOKE_CREATE, dtoIn);
  expect(joke.status).toEqual(200);
  let dtoOut = joke;
  expect(dtoOut.uuIdentity).toEqual("14-2710-1");
  expect(dtoOut.name).toEqual(dtoIn.name);
  expect(dtoOut.text).toEqual(dtoIn.text);
  expect(dtoOut.visibility).toEqual(true);
  expect(dtoOut.uuAppErrorMap).toEqual({});
});

test("HDS - image", async () => {
  await TestHelper.initAppWorkspace({ uuAppProfileAuthorities: "." });
  await TestHelper.login("Authorities");

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

test("A2 - jokes instance is closed", async () => {
  expect.assertions(4);
  await TestHelper.initAppWorkspace({ uuAppProfileAuthorities: ".", state: "closed" });
  await TestHelper.login("Authorities");
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
  await TestHelper.initAppWorkspace({ uuAppProfileAuthorities: "." });
  await TestHelper.login("Authorities");

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
  await TestHelper.initAppWorkspace({ uuAppProfileAuthorities: "." });
  await TestHelper.login("Authorities");

  try {
    await TestHelper.executePostCommand(JOKE_CREATE, { name: "Nehorlavy petrolej", image: 4 });
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/joke/create/invalidDtoIn");
    expect(e.message).toEqual("DtoIn is not valid.");
  }
});

test("A5 - invalid image content type", async () => {
  await TestHelper.initAppWorkspace({ uuAppProfileAuthorities: "." });
  await TestHelper.login("Authorities");

  let dtoIn = {
    name: "nejm",
    image: fs.createReadStream(path.resolve(__dirname, "..", "invalid.svg"))
  };
  try {
    await TestHelper.executePostCommand(JOKE_CREATE, dtoIn);
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/joke/create/invalidPhotoContentType");
  }
});

test("A6 - creating image fails", async () => {
  expect.assertions(2);

  let { JokeAbl, UuBinaryAbl } = mockAbl();
  jest.spyOn(UuBinaryAbl, "createBinary").mockImplementation(() => {
    throw new Error("it failed");
  });

  try {
    await JokeAbl.create(
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

test("A7 - categories don't exist", async () => {
  await TestHelper.initAppWorkspace({ uuAppProfileAuthorities: "." });
  await TestHelper.login("Authorities");

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

test("A8 - storing the joke fails", async () => {
  expect.assertions(2);

  let { JokeAbl } = mockAbl();
  JokeAbl.dao.create = () => {
    throw new ObjectStoreError("it failed");
  };

  try {
    await JokeAbl.create("awid", { name: "za chvili pujdu domu" }, getSessionMock(), getAuthzResultMock());
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/joke/create/jokeDaoCreateFailed");
    expect(e.message).toEqual("Create joke by joke DAO create failed.");
  }
});

function mockAbl() {
  mockDaoFactory();
  const JokeAbl = require("../../app/abl/joke-abl");
  const UuBinaryAbl = require("uu_appg01_binarystore-cmd").UuBinaryModel;
  const JokesInstanceAbl = require("../../app/abl/jokes-instance-abl");
  JokesInstanceAbl.checkInstance = () => null;
  return { JokeAbl, UuBinaryAbl };
}
