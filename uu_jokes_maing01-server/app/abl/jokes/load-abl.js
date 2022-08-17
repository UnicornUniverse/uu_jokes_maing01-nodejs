"use strict";

const { UuAppWorkspace } = require("uu_appg01_server").Workspace;
const { AuthorizationService } = require("uu_appg01_server").Authorization;
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { UriBuilder } = require("uu_appg01_server").Uri;
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
    const sysState = dtoOut.sysData.awidData.sysState;

    if (sysState !== UuAppWorkspace.SYS_STATES.CREATED && sysState !== UuAppWorkspace.SYS_STATES.ASSIGNED) {
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
    let dtoOut = await UuAppWorkspace.loadBasicData(uri, session, uuAppErrorMap);

    // HDS 2
    const awid = uri.getAwid();
    const awidData = await UuAppWorkspace.get(awid);

    // HDS 3
    if (
      awidData.sysState !== UuAppWorkspace.SYS_STATES.CREATED &&
      awidData.sysState !== UuAppWorkspace.SYS_STATES.ASSIGNED
    ) {
      const jokes = await InstanceChecker.ensureInstance(awid, Errors, uuAppErrorMap);
      dtoOut.data = { ...jokes, relatedObjectsMap: {} };
    }

    const cmdUri = UriBuilder.parse(uri).setUseCase("sys/uuAppWorkspace/load").clearParameters();
    const authorizationResult = await AuthorizationService.authorize(session, cmdUri.toUri());

    const profileData = {
      uuIdentityProfileList: authorizationResult.getIdentityProfiles(),
      profileList: authorizationResult.getAuthorizedProfiles(),
    };

    // HDS 4
    dtoOut.sysData = {
      ...dtoOut.sysData,
      awidData,
      profileData,
    };

    return dtoOut;
  }
}

module.exports = new LoadAbl();
