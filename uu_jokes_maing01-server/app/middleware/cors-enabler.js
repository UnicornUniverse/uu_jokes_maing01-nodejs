"use strict";

const cors = require("cors");

const MIDDLEWARE_ORDER = -10;

class CorsEnabler {
  constructor() {
    this.order = MIDDLEWARE_ORDER;
    this.profiles = "test,development";
  }

  get pre() {
    const corsOptions = {
      origin: true,
      credentials: true,
    };

    return [cors(corsOptions)];
  }
}

module.exports = CorsEnabler;
