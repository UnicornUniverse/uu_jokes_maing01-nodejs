"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { UuAppWorkspace, UuAppWorkspaceError } = require("uu_appg01_server").Workspace;
const { UuTerrClient } = require("uu_territory_clientg01");
const Errors = require("../api/errors/jokes-error");
const InstanceChecker = require("../component/instance-checker");

class WorkspaceAbl {
  constructor() {
    this.validator = Validator.load();
  }

  async remove(uri, session) {
    const awid = uri.getAwid();

    const jokes = await InstanceChecker.ensureInstance(awid, Errors.Init);
    jokes.uuBtBaseUri = "http://localhost:9090/uu-businessterritory-maing01/00000000000000000000000000000002"
    const uuTerritoryClient = new UuTerrClient({
      baseUri: jokes.uuBtBaseUri,
      session,
      appUri: uri.getBaseUri(),
    });

    // remove awsc from uuBt
    await uuTerritoryClient.Awsc.delete({
      id: jokes.artifactId,
    });

    await UuAppWorkspace.delete(awid);

    return {
      uuAppErrorMap: {},
    };
  }
}

module.exports = new WorkspaceAbl();
