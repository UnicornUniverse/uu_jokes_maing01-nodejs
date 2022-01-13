"use strict";
const Errors = require("../errors/preference-error");

const Warnings = {
  PreferenceDelete: {
    UnsupportedKeys: {
      CODE: `${Errors.PreferenceDelete.UC_CODE}unsupportedKeys`,
    },
  },
  PreferenceLoadFirst: {
    UnsupportedKeys: {
      CODE: `${Errors.PreferenceLoadFirst.UC_CODE}unsupportedKeys`,
    },
  },
  PreferenceCreateOrUpdate: {
    UnsupportedKeys: {
      CODE: `${Errors.PreferenceCreateOrUpdate.UC_CODE}unsupportedKeys`,
    },
  },
};

module.exports = Warnings;
