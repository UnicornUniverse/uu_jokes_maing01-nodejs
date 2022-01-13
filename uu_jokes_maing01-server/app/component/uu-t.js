"use strict";

const { UriBuilder, Uri } = require("uu_appg01_server").Uri;
const { AppClientTokenService } = require("uu_appg01_server").Workspace;

class UuT {
  constructor(uuTUri, session) {
    this.uriBuilder = UriBuilder.parse(uuTUri);
    this.uuTUri = Uri.parse(uuTUri);
    this.session = session;
  }

  /**
   * Build complete Uri to useCase in uuT.
   * @param useCase
   * @returns {*}
   */
  getRequestUri(useCase) {
    let baseUri = this.uuTUri.getBaseUri();
    let builder = UriBuilder.parse(baseUri);

    builder.setUseCase(useCase);

    return builder.toUri();
  }

  /**
   * Creates uuAppClientToken and prepare callOpts for other uuCommand calls.
   * @param appUri
   * @returns {Promise<void>}
   */
  async setToken(appUri) {
    let appToken = null;
    let callOpts = null;

    appToken = await AppClientTokenService.createToken(appUri, this.uriBuilder);
    callOpts = await AppClientTokenService.setToken({ session: this.session }, appToken);

    this.callOpts = callOpts;
  }
}

module.exports = UuT;
