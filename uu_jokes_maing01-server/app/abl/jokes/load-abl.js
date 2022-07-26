"use strict";

const { UuAppWorkspace } = require("uu_appg01_server").Workspace;
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { Config } = require("uu_appg01_server").Utils;
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

    // hds 1
    const dtoOut = await UuAppWorkspace.load(uri, session, uuAppErrorMap);

    // ISSUE - The uuAppWorkspaceUri has been moved to territoryData.data.artifact.uuAppWorkspaceUri
    // We need to first deploy uuApp -> Then deploy modification in uuJokes library -> And finally remove this temporary fix
    if (dtoOut.territoryData) {
      dtoOut.territoryData = {
        data: {
          ...dtoOut.territoryData.data.data,
          uuAppWorkspaceUri: dtoOut.territoryData.data.artifact.uuAppWorkspaceUri,
        },
        sysData: dtoOut.territoryData.sysData,
      };
    }

    // hds 2
    if (dtoOut.sysData.awidData.sysState !== "created") {
      const jokes = await InstanceChecker.ensureInstance(awid, Errors, uuAppErrorMap);
      const categoryList = await this.categoryDao.list(awid);
      dtoOut.data = { ...jokes, categoryList: categoryList.itemList, relatedObjectsMap: {} };
    }

    // hds 3
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }

  async loadBasicData(uri, session, uuAppErrorMap = {}) {
    // HDS 1

    // ISSUE uuBT DEV Environment - Upgrade uuBT version to 2.15+
    // https://uuapp.plus4u.net/uu-elementarymanagement-maing01/9c6fa609fb484a4c87861c927b3f5356/request?id=62de9dc9ed50f40028a471de
    // const dtoOut = await UuAppWorkspace.loadBasicData(uri, session, uuAppErrorMap);

    let awid = uri.getAwid();
    let dtoOut = {};

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

    dtoOut.sysData = { relatedObjectsMap };

    const awidData = await UuAppWorkspace.get(awid);

    if (awidData.sysState !== "created") {
      const jokes = await InstanceChecker.ensureInstance(awid, Errors, uuAppErrorMap);
      dtoOut.data = { ...jokes, relatedObjectsMap: {} };
    }

    dtoOut.territoryData = { data: {} };
    dtoOut.uuAppErrorMap = uuAppErrorMap;

    // HDS 2
    return dtoOut;
  }
}

module.exports = new LoadAbl();
