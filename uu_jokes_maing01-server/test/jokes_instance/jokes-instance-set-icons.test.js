const { TestHelper } = require("uu_appg01_server-test");
const { JOKES_INSTANCE_SET_ICONS, JOKES_INSTANCE_GET_UVE_META_DATA } = require("../general-test-hepler");

const Fs = require("fs");
const Path = require("path");

beforeAll(async () => {
  await TestHelper.setup(null, { authEnabled: false });
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

test("HDS - upload icons", async () => {
  expect.assertions(18);
  await TestHelper.initUuAppWorkspace({ uuAppProfileAuthorities: "." });

  //created
  let dtoIn = { data: Fs.createReadStream(Path.join(__dirname, "icons-to-upload.zip")) };
  let result = await TestHelper.executePostCommand(JOKES_INSTANCE_SET_ICONS, dtoIn);
  expect(result.status).toEqual(200);

  //extended
  dtoIn = { data: Fs.createReadStream(Path.join(__dirname, "icons-to-upload-2.zip")) };
  result = await TestHelper.executePostCommand(JOKES_INSTANCE_SET_ICONS, dtoIn);

  expect(result.status).toEqual(200);
  expect(result.uveMetaData["android-chrome-512x512"]).toEqual("android_chrome_512x512");
  expect(result.uveMetaData["apple-touch-icon"]).toEqual("apple_touch_icon");
  expect(result.uveMetaData["favicon-16x16"]).toEqual("favicon_16x16");
  expect(result.uveMetaData["favicon-32"]).toEqual("favicon_32");
  expect(result.uveMetaData["favicon-32x32"]).toEqual("favicon_32x32");
  expect(result.uveMetaData["mstile-150x150"]).toEqual("mstile_150x150");
  expect(result.uveMetaData["safari-pinned-tab"]).toEqual("safari_pinned_tab");

  expect(result.uveMetaData["android-chrome-512x512-2"]).toEqual("android_chrome_512x512_2");
  expect(result.uveMetaData["apple-touch-icon-2"]).toEqual("apple_touch_icon_2");
  expect(result.uveMetaData["favicon-16x16-2"]).toEqual("favicon_16x16_2");
  expect(result.uveMetaData["favicon-32-2"]).toEqual("favicon_32_2");
  expect(result.uveMetaData["favicon-32x32-2"]).toEqual("favicon_32x32_2");
  expect(result.uveMetaData["mstile-150x150-2"]).toEqual("mstile_150x150_2");
  expect(result.uveMetaData["safari-pinned-tab-2"]).toEqual("safari_pinned_tab_2");

  dtoIn = { type: "favicon-32" };
  result = await TestHelper.executeGetCommand(JOKES_INSTANCE_GET_UVE_META_DATA, dtoIn);
  expect(result.status).toEqual(200);
  expect(result.data.readable).toEqual(true);
});

test("A1", async () => {
  expect.assertions(1);

  await TestHelper.initUuAppWorkspace({ uuAppProfileAuthorities: "." });

  //created
  let dtoIn = { data: false };
  try {
    await TestHelper.executePostCommand(JOKES_INSTANCE_SET_ICONS, dtoIn);
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/jokesInstance/setIcons/invalidDtoIn");
  }
});

test("A5", async () => {
  expect.assertions(1);

  await TestHelper.initUuAppWorkspace({ uuAppProfileAuthorities: "." });

  let dtoIn = { data: Fs.createReadStream(Path.join(__dirname, "invalid-icons-to-create.zip")) };
  let result = await TestHelper.executePostCommand(JOKES_INSTANCE_SET_ICONS, dtoIn);
  console.log(result.data.uuAppErrorMap["uu-jokes-main/jokesInstance/setIcons/unsupportedFileNames"]);
  expect(
    result.data.uuAppErrorMap["uu-jokes-main/jokesInstance/setIcons/unsupportedFileNames"].message
      .unsupportedFileNameList
  ).toEqual(["android-chrome-512x512***"]);
});
