"use strict";

const { UuAppWorkspace, UuSubAppInstance, WorkspaceAuthorizationService } = require("uu_appg01_server").Workspace;
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { Uri, UriBuilder } = require("uu_appg01_server").Uri;
const { Config } = require("uu_appg01_server").Utils;
const { UuTerrClient } = require("uu_territory_clientg01");

const Errors = require("../../api/errors/jokes-error");
const InstanceChecker = require("../../component/instance-checker");
const Constants = require("../constants");

class LoadAbl {
  constructor() {
    this.validator = Validator.load();
    this.dao = DaoFactory.getDao(Constants.Schemas.JOKES);
    this.categoryDao = DaoFactory.getDao(Constants.Schemas.CATEGORY);
  }

  async load(uri, session, uuAppErrorMap = {}) {
    let awid = uri.getAwid();
    let dtoOut = {};

    // hds 1
    const asidData = await UuSubAppInstance.get();

    // hds 2
    const awidData = await UuAppWorkspace.get(awid);

    // hds 3
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

    // hds 4
    const cmdUri = UriBuilder.parse(uri).setUseCase("sys/uuAppWorkspace/load").clearParameters();
    const authorizationResult = await WorkspaceAuthorizationService.authorize(session, cmdUri.toUri());

    const profileData = {
      uuIdentityProfileList: authorizationResult.getIdentityProfiles(),
      profileList: authorizationResult.getAuthorizedProfiles(),
    };

    // hds 5
    dtoOut.sysData = { asidData, awidData, relatedObjectsMap, profileData };

    // hds 6, 6.A
    if (awidData.sysState !== "created") {
      // hds 6.A.1
      const jokes = await InstanceChecker.ensureInstance(awid, Errors, uuAppErrorMap);

      // hds 6.A.2
      dtoOut.data = { ...jokes, relatedObjectsMap: {} };

      const categoryList = await this.categoryDao.list(awid);
      dtoOut.data.categoryList = categoryList.itemList;

      // hds 6.A.3
      if (awidData.authorizationStrategy === "artifact") {
        const artifactUri = Uri.parse(awidData.artifactUri);
        const artifactId = artifactUri.getParameters().id;
        const btBaseUri = artifactUri.getBaseUri();
        const terrClientOpts = { baseUri: btBaseUri.toString(), session };
        let awsc;

        try {
          awsc = await UuTerrClient.Awsc.load(
            { id: artifactId, getTerritoryName: true, loadContext: true, loadVisualIdentification: true },
            terrClientOpts
          );
        } catch (e) {
          throw new Errors.Load.UuAwscLoadFailed({ uuAppErrorMap }, e);
        }

        dtoOut.territoryData = { data: awsc };
      }
    }

    // hds 7
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }
}

module.exports = new LoadAbl();
