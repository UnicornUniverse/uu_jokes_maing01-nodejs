/**
 * Server calls of application client.
 */
import { Uri } from "uu_appg01_core";
import Plus4U5 from "uu_plus4u5g01";
import UU5 from "uu5g04";

let Calls = {
  /** URL containing app base, e.g. "https://uuos9.plus4u.net/vnd-app/tid-awid/". */
  APP_BASE_URI: location.protocol + "//" + location.host + UU5.Environment.getAppBasePath(),

  async call(method, url, dtoIn, clientOptions) {
    let response = await Plus4U5.Common.Calls.call(method, url, dtoIn, clientOptions);
    return response.data;
  },

  loadApp(dtoInData) {
    let commandUri = Calls.getCommandUri("jokesInstance/load");
    return Calls.call("get", commandUri, dtoInData);
  },

  loadIdentityProfiles(dtoInData) {
    let commandUri = Calls.getCommandUri("sys/appWorkspace/initUve");
    return Calls.call("get", commandUri, dtoInData);
  },

  initWorkspace(dtoInData) {
    let commandUri = Calls.getCommandUri("sys/appWorkspace/init");
    return Calls.call("post", commandUri, dtoInData);
  },

  getWorkspace(dtoInData) {
    let commandUri = Calls.getCommandUri("sys/appWorkspace/get");
    return Calls.call("get", commandUri, dtoInData);
  },

  categoryList(dtoInData) {
    let commandUri = Calls.getCommandUri("category/list");
    return Calls.call("get", commandUri, dtoInData || {});
  },

  async categoryCreate(dtoInData) {
    let commandUri = Calls.getCommandUri("category/create");
    let data = await Calls.call("post", commandUri, dtoInData);
    return { ...data, inProgress: false };
  },

  async categoryUpdate(id, dtoInData) {
    let commandUri = Calls.getCommandUri("category/update");
    let data = await Calls.call("post", commandUri, dtoInData);
    return { ...data, inProgress: false };
  },

  async categoryDelete(id, { forceDelete }) {
    let commandUri = Calls.getCommandUri("category/delete");
    let data = await Calls.call("post", commandUri, { id, forceDelete });
    return { ...data, inProgress: false };
  },

  jokeList(dtoInData) {
    let commandUri = Calls.getCommandUri("joke/list");
    return Calls.call("get", commandUri, dtoInData || {});
  },

  async jokeCreate(dtoInData) {
    let commandUri = Calls.getCommandUri("joke/create");
    let data = await Calls.call("post", commandUri, dtoInData);
    return { ...data, inProgress: false };
  },

  jokeDelete(id) {
    let commandUri = Calls.getCommandUri("joke/delete");
    return Calls.call("post", commandUri, { id });
  },

  async updateJoke(id, dtoInData) {
    let commandUri = Calls.getCommandUri("joke/update");
    let data = await Calls.call("post", commandUri, dtoInData);
    return { ...data, inProgress: false };
  },

  async updateJokeRating(id, dtoInData) {
    let commandUri = Calls.getCommandUri("joke/addRating");
    let data = await Calls.call("post", commandUri, dtoInData);
    return { ...data, inProgress: false };
  },

  async updateJokeVisibility(id, dtoInData) {
    let commandUri = Calls.getCommandUri("joke/updateVisibility");
    let data = await Calls.call("post", commandUri, dtoInData);
    return { ...data, inProgress: false };
  },

  uploadFile(dtoIn) {
    let commandUri = Calls.getCommandUri("uu-app-binarystore/createBinary");
    return Calls.call("post", commandUri, dtoIn);
  },

  deleteFile(dtoIn) {
    let commandUri = Calls.getCommandUri("uu-app-binarystore/deleteBinary");
    return Calls.call("post", commandUri, dtoIn);
  },

  /*
  For calling command on specific server, in case of developing client site with already deployed
  server in uuCloud etc. You can specify url of this application (or part of url) in development
  configuration in *-client/env/development.json
  for example:
   {
     "gatewayUri": "https://uuos9.plus4u.net",
     "tid": "84723877990072695",
     "awid": "b9164294f78e4cd51590010882445ae5",
     "vendor": "uu",
     "app": "demoappg01",
     "subApp": "main"
   }
   */
  getCommandUri(aUseCase) {
    // useCase <=> e.g. "getSomething" or "sys/getSomething"
    // add useCase to the application base URI
    // NOTE Using string concatenation instead of UriBuilder to support also URLs
    // that don't conform to uuUri specification.
    let targetUriStr = Calls.APP_BASE_URI + aUseCase.replace(/^\/+/, "");

    // override tid / awid if it's present in environment (use also its gateway in such case)
    let env = UU5.Environment;
    if (env.tid || env.awid || env.vendor || env.app) {
      let uriBuilder = Uri.UriBuilder.parse(targetUriStr);
      if (env.tid || env.awid) {
        if (env.gatewayUri) uriBuilder.setGateway(env.gatewayUri);
        if (env.tid) uriBuilder.setTid(env.tid);
        if (env.awid) uriBuilder.setAwid(env.awid);
      }
      if (env.vendor || env.app) {
        if (env.vendor) uriBuilder.setVendor(env.vendor);
        if (env.app) uriBuilder.setApp(env.app);
        if (env.subApp) uriBuilder.setSubApp(env.subApp);
      }
      targetUriStr = uriBuilder.toUri().toString();
    }

    return targetUriStr;
  }
};

export default Calls;
