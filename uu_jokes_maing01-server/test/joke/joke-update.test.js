const { TestHelper } = require("uu_appg01_server-test");
const { ObjectStoreError } = require("uu_appg01_server").ObjectStore;
const {
  JOKES_INSTANCE_INIT,
  JOKE_CREATE,
  JOKE_UPDATE,
  MONGO_ID,
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
  await TestHelper.login("AwidLicenseOwner", false);
});

afterEach(() => {
  jest.restoreAllMocks();
});

test("HDS - no image", async () => {
  await TestHelper.executePostCommand(JOKES_INSTANCE_INIT, { uuAppProfileAuthorities: "kostkovyCukr" });
  await TestHelper.login("Authorities");
  let string = "hmm";
  let create = await TestHelper.executePostCommand(JOKE_CREATE, { name: string });
  let update = await TestHelper.executePostCommand(JOKE_UPDATE, {
    id: create.id,
    name: `${string}${string}`,
    text: `${string}${string}${string}`
  });
  expect(update.status).toEqual(200);
  expect(update.name).not.toEqual(create.name);
  expect(update.name).toEqual(`${string}${string}`);
  expect(update.text).not.toEqual(create.text);
  expect(update.text).toEqual(`${string}${string}${string}`);
});

test("HDS - create image", async () => {
  await TestHelper.executePostCommand(JOKES_INSTANCE_INIT, { uuAppProfileAuthorities: "kostkovyCukr" });
  await TestHelper.login("Authorities");
  let create = await TestHelper.executePostCommand(JOKE_CREATE, { name: "mlzi se tu Okna" });
  let update = await TestHelper.executePostCommand(JOKE_UPDATE, { id: create.id, image: getImageStream() });
  expect(update.status).toEqual(200);
  expect(update.image).not.toEqual(create.image);
  expect(update.image).toBeTruthy();

  //check if binary was really created
  let result = await TestHelper.executeGetCommand("uu-app-binarystore/listBinaries");
  expect(result.pageInfo.total).toEqual(1);
  expect(result.itemList[0].code).toEqual(update.image);
});

test("HDS - update image", async () => {
  await TestHelper.executePostCommand(JOKES_INSTANCE_INIT, { uuAppProfileAuthorities: "kostkovyCukr" });
  await TestHelper.login("Authorities");
  let create = await TestHelper.executePostCommand(JOKE_CREATE, {
    name: "Zapomnel jsem si salu a je mi zima na krk",
    image: getImageStream()
  });

  // check if binary was created
  let result = await TestHelper.executeGetCommand("uu-app-binarystore/listBinaries");
  expect(result.pageInfo.total).toEqual(1);
  expect(result.itemList[0].sys.rev).toEqual(0);

  let update = await TestHelper.executePostCommand(JOKE_UPDATE, { image: getImageStream(), id: create.id });
  expect(update.image).toEqual(create.image);
  expect(update.image).toBeTruthy();

  // check if binary was updated
  result = await TestHelper.executeGetCommand("uu-app-binarystore/listBinaries");
  expect(result.pageInfo.total).toEqual(1);
  expect(result.itemList[0].sys.rev).toEqual(1);
});

test("A2 - jokes instance is closed", async () => {
  expect.assertions(4);
  await TestHelper.executePostCommand(JOKES_INSTANCE_INIT, {
    uuAppProfileAuthorities: "energetickyNapoj",
    state: "closed"
  });
  await TestHelper.login("Authorities");
  try {
    await TestHelper.executePostCommand(JOKE_UPDATE, {});
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/joke/update/jokesInstanceNotInProperState");
    expect(e.message).toEqual("JokesInstance is not in proper state [active|underConstruction].");
    expect(e.paramMap.state).toEqual("closed");
    expect(e.paramMap.expectedStateList).toEqual(["active", "underConstruction"]);
  }
});

test("A3 - unsupported keys in dtoIn", async () => {
  await TestHelper.executePostCommand(JOKES_INSTANCE_INIT, { uuAppProfileAuthorities: "vickoJeFuc" });
  await TestHelper.login("Authorities");
  let joke = await TestHelper.executePostCommand(JOKE_CREATE, { name: "Velmi vtipny vtip, opet.." });
  joke = await TestHelper.executePostCommand(JOKE_UPDATE, { id: joke.id, zmatenyTurista: "kudy se dostanu na..." });
  expect(joke.status).toEqual(200);
  let warning = joke.uuAppErrorMap["uu-jokes-main/joke/update/unsupportedKeys"];
  expect(warning).toBeTruthy();
});

test("A4 - invalid dtoIn", async () => {
  expect.assertions(2);
  await TestHelper.executePostCommand(JOKES_INSTANCE_INIT, { uuAppProfileAuthorities: "theMournfulWhy" });
  await TestHelper.login("Authorities");
  try {
    await TestHelper.executePostCommand(JOKE_UPDATE, {});
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/joke/update/invalidDtoIn");
    expect(e.message).toEqual("DtoIn is not valid.");
  }
});

test("A5 - joke does not exist", async () => {
  expect.assertions(3);
  await TestHelper.executePostCommand(JOKES_INSTANCE_INIT, { uuAppProfileAuthorities: "StellaWasADiver" });
  await TestHelper.login("Authorities");
  try {
    await TestHelper.executePostCommand(JOKE_UPDATE, { id: MONGO_ID });
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/joke/update/jokeDoesNotExist");
    expect(e.message).toEqual("Joke does not exist.");
    expect(e.paramMap.jokeId).toEqual(MONGO_ID);
  }
});

test("A6 - Readers trying to update Authorities' joke", async () => {
  expect.assertions(2);
  await TestHelper.executePostCommand(JOKES_INSTANCE_INIT, { uuAppProfileAuthorities: "theMournfulWhy" });
  await TestHelper.login("Authorities");
  let joke = await TestHelper.executePostCommand(JOKE_CREATE, { name: "It's different now, that I'm poor and aging." });
  let session = await TestHelper.login("Readers");
  try {
    await TestHelper.executePostCommand(JOKE_UPDATE, { id: joke.id }, session);
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/joke/update/userNotAuthorized");
    expect(e.message).toEqual("User not authorized.");
  }
});

test("A7 - categories don't exist", async () => {
  await TestHelper.executePostCommand(JOKES_INSTANCE_INIT, { uuAppProfileAuthorities: "theWholesomeMurder" });
  await TestHelper.login("Authorities");

  let existingCategoryId = "012345678910111213141516";
  let nonExistentCategoryId = "171819202122232425262728";
  await TestHelper.executeDbScript(
    `db.getCollection('category').insert({_id:ObjectId("${existingCategoryId}"),awid:"${TestHelper.getAwid()}"})`
  );

  let joke = await TestHelper.executePostCommand(JOKE_CREATE, {
    name: "My best friend is a butcher, he has sixteen knives"
  });

  joke = await TestHelper.executePostCommand(JOKE_UPDATE, {
    id: joke.id,
    categoryList: [existingCategoryId, nonExistentCategoryId]
  });

  expect(joke.status).toEqual(200);
  expect(joke.categoryList).toEqual([existingCategoryId]);
  let warning = joke.uuAppErrorMap["uu-jokes-main/joke/update/categoryDoesNotExist"];
  expect(warning).toBeTruthy();
  expect(warning.type).toEqual("warning");
  expect(warning.message).toEqual("One or more categories with given categoryId do not exist.");
  expect(warning.paramMap.categoryList).toEqual([nonExistentCategoryId]);
});

test("A8 - creating binary fails", async () => {
  expect.assertions(2);
  let { JokeAbl, UuBinaryAbl } = mockAbl();
  jest.spyOn(UuBinaryAbl, "createBinary").mockImplementation(() => {
    throw new Error("it failed");
  });
  JokeAbl.dao = {
    get: () => {
      return {
        uuIdentity: "19-7019-1"
      };
    }
  };

  let dtoIn = {
    id: MONGO_ID,
    image: getImageStream()
  };

  try {
    await JokeAbl.update("awid", dtoIn, getSessionMock("19-7019-1"), getAuthzResultMock());
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/joke/update/uuBinaryCreateFailed");
    expect(e.message).toEqual("Creating uuBinary failed.");
  }
});

test("A9 - updating binary fails", async () => {
  expect.assertions(2);
  let { JokeAbl, UuBinaryAbl } = mockAbl();
  jest.spyOn(UuBinaryAbl, "updateBinaryData").mockImplementation(() => {
    throw new Error("it failed");
  });
  JokeAbl.dao = {
    get: () => {
      return {
        uuIdentity: "19-7019-1",
        image: true
      };
    }
  };

  let dtoIn = {
    id: MONGO_ID,
    image: getImageStream()
  };

  try {
    await JokeAbl.update("awid", dtoIn, getSessionMock("19-7019-1"), getAuthzResultMock());
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/joke/update/uuBinaryUpdateBinaryDataFailed");
    expect(e.message).toEqual("Updating uuBinary data failed.");
  }
});

test("A10 - updating joke fails", async () => {
  expect.assertions(2);
  let { JokeAbl } = mockAbl();
  JokeAbl.dao = {
    get: () => {
      return {
        uuIdentity: "19-7019-1"
      };
    },
    update: () => {
      throw new ObjectStoreError("it failed");
    }
  };

  try {
    await JokeAbl.update("awid", { id: MONGO_ID }, getSessionMock("19-7019-1"), getAuthzResultMock());
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/joke/update/jokeDaoUpdateFailed");
    expect(e.message).toEqual("Update joke by joke Dao update failed.");
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
