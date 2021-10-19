const path = require("path");

// ISSUE uuAppDevkit ESLint configuration doesn't contain settings.react.version
// https://uuapp.plus4u.net/uu-sls-maing01/f34e4c65a9c84ea0baf50017c43fc97d/issueDetail?id=611a32a5545e5300294d52a6

// ISSUE uuAppDevkit should turn off the ESLint rule react/jsx-no-bind
// https://uuapp.plus4u.net/uu-sls-maing01/f34e4c65a9c84ea0baf50017c43fc97d/issueDetail?id=611a33eb545e5300294d5318
let config = {
  extends: ["./" + path.relative(".", require.resolve("uu_appg01_devkit/src/config/.eslintrc.js")).replace(/\\/g, "/")],
  settings: {
    react: {
      version: "detect",
    },
  },
  rules: {
    "react/jsx-no-bind": 0,
  },
};

module.exports = config;
