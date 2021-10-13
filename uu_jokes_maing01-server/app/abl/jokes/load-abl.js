"use strict";

const { UuAppWorkspace, UuSubAppInstance, WorkspaceAuthorizationService } = require("uu_appg01_server").Workspace;
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { Uri, UriBuilder } = require("uu_appg01_server").Uri;
const { Config } = require("uu_appg01_server").Utils;
const { UuTerrClient } = require("uu_territory_clientg01");

const Path = require("path");
const Errors = require("../../api/errors/jokes-error");
const InstanceChecker = require("../components/instance-checker");

class LoadAbl {
  constructor() {
    this.validator = new Validator(Path.join(__dirname, "../../", "api", "validation_types", "jokes-types.js"));
    this.dao = DaoFactory.getDao("jokesInstance");
    this.categoryDao = DaoFactory.getDao("category");
  }

  async load(uri, session, uuAppErrorMap = {}) {
    let awid = uri.getAwid();
    let dtoOut = {};

    // HDS 1
    const asidData = await UuSubAppInstance.get();

    // HDS 2
    const awidData = await UuAppWorkspace.get(awid);

    // HDS 3
    // ISSUE The uuAppProductPortalUri is not allowed in this map by official documentation but should be
    // https://uuapp.plus4u.net/uu-sls-maing01/3f1ef221518d49f2ac936f53f83ebd84/issueDetail?id=611f6bdf545e5300294e5ed1
    const relatedObjectsMap = {
      uuAppUuFlsBaseUri: Config.get("fls_base_uri"),
      uuAppUuSlsBaseUri: Config.get("sls_base_uri"),
      uuAppBusinessRequestsUri: Config.get("business_request_uri"),
      uuAppBusinessModelUri: Config.get("business_model_uri"),
      uuAppApplicationModelUri: Config.get("application_model_uri"),
      uuAppUserGuideUri: Config.get("user_guide_uri"),
      uuAppWebKitUri: Config.get("web_uri"),
      uuAppProductPortalUri: Config.get("product_portal_uri"),
    };

    // HDS 4
    const cmdUri = UriBuilder.parse(uri).setUseCase("sys/uuAppWorkspace/load").clearParameters();
    const authorizationResult = await WorkspaceAuthorizationService.authorize(session, cmdUri.toUri());

    const profileData = {
      // TODO Fixme
      //uuIdentityProfileList: authorizationResult.getIdentityProfiles(),
      //profileList: authorizationResult.getAuthorizedProfiles(),
      uuIdentityProfileList: ["Authorities"],
      profileList: ["Authorities"],
    };

    // HDS 5
    dtoOut.sysData = { asidData, awidData, relatedObjectsMap, profileData };

    // HDS 6
    // TODO Return with uuAppErrorMap
    if (awidData.sysState === "created") {
      return dtoOut;
    }

    // HDS 7
    const jokes = await InstanceChecker.ensureInstance(awid, Errors, uuAppErrorMap);

    // HDS 8
    dtoOut.data = { ...jokes, relatedObjectsMap: {} };

    // TODO Temporary fix, remove categoryList from load
    const categoryList = await this.categoryDao.list(awid);
    dtoOut.data.categoryList = categoryList.itemList;

    // HDS 9
    if (awidData.authorizationStrategy !== "artifact") {
      return dtoOut;
    }

    // HDS 10
    const artifactUri = Uri.parse(awidData.artifactUri);
    const artifactId = artifactUri.getParameters().id;
    const btBaseUri = artifactUri.getBaseUri();
    const terrClientOpts = { baseUri: btBaseUri.toString(), session };

    const awsc = await UuTerrClient.Awsc.load(
      { id: artifactId, getTerritoryName: true, loadContext: true, loadVisualIdentification: true },
      terrClientOpts
    );

    dtoOut.territoryData = { data: awsc };

    // HDS 10
    return dtoOut;
  }
}

module.exports = new LoadAbl();
