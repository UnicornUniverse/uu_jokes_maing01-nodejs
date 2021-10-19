//@@viewOn:imports
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { Schemas } = require("../constants");
//@@viewOff:imports

//@@viewOn:components
class InstanceChecker {
  constructor() {
    this.dao = DaoFactory.getDao(Schemas.JOKES);
  }

  async ensureInstanceAndState(awid, errors, states, uuAppErrorMap = {}) {
    // HDS 1
    let polygons = await this.ensureInstance(awid, errors, uuAppErrorMap);

    // HDS 2
    if (!states.has(polygons.state)) {
      // 2.1.A
      throw new errors.JokesIsNotInCorrectState(
        { uuAppErrorMap },
        {
          awid,
          state: polygons.state,
          expectedState: Array.from(states),
        }
      );
    }

    return polygons;
  }

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
