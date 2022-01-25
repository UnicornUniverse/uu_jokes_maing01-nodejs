//@@viewOn:imports
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { Schemas } = require("../abl/constants");
//@@viewOff:imports

//@@viewOn:components
class InstanceChecker {
  constructor() {
    this.dao = DaoFactory.getDao(Schemas.JOKES);
  }

  /**
   * Checks whether instance exists and is of proper state
   * @param {String} awid Used awid
   * @param {Set} states A map with allowed states
   * @param {Object} errors Object with error definitions
   * @param {Object} uuAppErrorMap Standard uuAppErrorMap
   * @returns {Promise<[]>} instance itself
   */
  async ensureInstanceAndState(awid, allowedStateRules, authorizationResult, errors, uuAppErrorMap = {}) {
    // HDS 1
    const jokes = await this.ensureInstance(awid, errors, uuAppErrorMap);

    // HDS 2
    const authorizedProfiles = authorizationResult.getAuthorizedProfiles();
    // note: the "biggest" profile is always in first position
    const allowedStates = allowedStateRules[authorizedProfiles[0]];

    // HDS 3
    if (!allowedStates.has(jokes.state)) {
      throw new errors.JokesNotInCorrectState(
        { uuAppErrorMap },
        {
          awid,
          state: jokes.state,
          expectedState: Array.from(allowedStates),
        }
      );
    }

    return jokes;
  }

  /**
   * Checks whether instance exists
   * @param {String} awid Used awid
   * @param {Object} errors Object with error definitions
   * @param {Object} uuAppErrorMap Standard uuAppErrorMap
   * @returns {Promise<[]>} instance itself
   */
  async ensureInstance(awid, errors, uuAppErrorMap) {
    // HDS 1
    let jokes = await this.dao.getByAwid(awid);

    // HDS 2
    if (!jokes) {
      // 2.1.A
      throw new errors.JokesDoesNotExist({ uuAppErrorMap }, { awid });
    }

    return jokes;
  }
}
//@@viewOff:components

//@@viewOn:exports
module.exports = new InstanceChecker();
//@@viewOff:exports
