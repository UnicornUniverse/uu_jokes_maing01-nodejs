const Errors = require("../errors/polygons-error.js");

const Warnings = {
  InitUnsupportedKeys: {
    CODE: `${Errors.Init.UC_CODE}unsupportedKeys`,
  },
  UpdateUnsupportedKeys: {
    CODE: `${Errors.Update.UC_CODE}unsupportedKeys`,
  },
  SetStateUnsupportedKeys: {
    CODE: `${Errors.SetState.UC_CODE}unsupportedKeys`,
  },
};

module.exports = Warnings;
