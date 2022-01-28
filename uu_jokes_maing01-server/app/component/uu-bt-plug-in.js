//@@viewOn:imports
const { UuAppWorkspace } = require("uu_appg01_server").Workspace;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const { UriBuilder } = require("uu_appg01_server").Uri;
const { UuTerrClient } = require("uu_territory_clientg01");
//@@viewOff:imports

const ID_PARAM = "id";
const CODE_PARAM = "code";
const AWSC_CODE_PREFIX = "uuJokes";
const APP_TYPE_CODE = "uu-jokes-maing01";
const AWSC_CREATE_FAILED_CODE = "uu-businessterritory-maing01/uuAwsc/create/createFailed";
const NOT_UNIQUE_ID_CODE = "uu-app-datastore/dao/notUniqueId";

//@@viewOn:components
const UuBtPlugIn = {
  /**
   * Creates awsc
   * @param {String} awid Used awid
   * @param {string} uuBtBaseUri
   * @param {object} dtoIn
   * @param {object} uuBtUriParams
   * @param {object} uuAppErrorMap
   * @param {object} createAwscFailedError Error thrown if creating awsc fails
   * @param {object} uri
   * @param {object} session
   * @returns {Promise<[]>} Ids of existing categories
   */
  async createAwsc(awid, uuBtBaseUri, dtoIn, uuBtUriParams, uuAppErrorMap, createAwscFailedError, uri, session) {
    const uuTerritoryClient = new UuTerrClient({
      baseUri: uuBtBaseUri,
      session,
      appUri: uri.getBaseUri(),
    });

    let location;
    if (uuBtUriParams[CODE_PARAM]) {
      location = { locationCode: uuBtUriParams[CODE_PARAM] };
    } else {
      location = { location: uuBtUriParams[ID_PARAM] };
    }

    const awscCode = `${AWSC_CODE_PREFIX}/${awid}`;
    const awscCreateDtoIn = {
      awid: awid,
      code: awscCode,
      name: dtoIn.name,
      desc: dtoIn.description,
      permissionMatrix: dtoIn.permissionMatrix,
      typeCode: APP_TYPE_CODE,
      ...location,
    };

    let awsc;
    try {
      awsc = await uuTerritoryClient.Awsc.create(awscCreateDtoIn);
    } catch (e) {
      const awscCreateErrorMap = (e.dtoOut && e.dtoOut.uuAppErrorMap) || {};

      const isDup =
        awscCreateErrorMap[AWSC_CREATE_FAILED_CODE] &&
        awscCreateErrorMap[AWSC_CREATE_FAILED_CODE].cause &&
        awscCreateErrorMap[AWSC_CREATE_FAILED_CODE].cause[NOT_UNIQUE_ID_CODE];

      if (isDup) {
        ValidationHelper.addWarning(
          uuAppErrorMap,
          AWSC_CREATE_FAILED_CODE,
          awscCreateErrorMap[AWSC_CREATE_FAILED_CODE].message,
          awscCreateErrorMap[AWSC_CREATE_FAILED_CODE].cause
        );

        awsc = await uuTerritoryClient.Awsc.get({ code: awscCode });
      } else {
        throw new createAwscFailedError(
          { uuAppErrorMap: { ...uuAppErrorMap, ...awscCreateErrorMap } },
          { uuBtBaseUri: uuBtBaseUri, awid },
          e
        );
      }
    }

    return awsc;
  },

  /**
   * Connects workspace to artifact(uuAwsc)
   * @param {Object} appUri Application uri
   * @param {Object} uuBtUri UuBt uri
   * @param {string} awscId Id of uuAwsc
   * @param {Object} session
   * @returns {Promise<[]>}
   */
  async connectArtifact(appUri, uuBtUri, awscId, session) {
    const appBaseUri = appUri.getBaseUri();
    const artifactUri = UriBuilder.parse(uuBtUri)
      .setUseCase(null)
      .clearParameters()
      .setParameter(ID_PARAM, awscId)
      .toUri()
      .toString();

    return await UuAppWorkspace.connectArtifact(appBaseUri, { artifactUri }, session);
  },
};
//@@viewOff:components

//@@viewOn:exports
module.exports = UuBtPlugIn;
//@@viewOff:exports
