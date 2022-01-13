const Errors = require("../errors/jokes-error.js");

const Warnings = {
  Init: {
    UnsupportedKeys: {
      code: `${Errors.Init.UC_CODE}unsupportedKeys`,
    },
  },
  PlugInBt: {
    UnsupportedKeys: {
      code: `${Errors.PlugInBt.UC_CODE}unsupportedKeys`,
    },
  },
  Update: {
    UnsupportedKeys: {
      code: `${Errors.Update.UC_CODE}unsupportedKeys`,
    },
  },
  SetState: {
    UnsupportedKeys: {
      code: `${Errors.SetState.UC_CODE}unsupportedKeys`,
    },
  },
};

module.exports = Warnings;
