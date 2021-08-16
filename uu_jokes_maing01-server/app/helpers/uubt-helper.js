const { UriBuilder } = require("uu_appg01_core-uri");
const { AppClient } = require("uu_appg01_server-client");

class UuBtHelper {
  static async loadAwsc(btUri, authDtoIn, session, contentError) {
    return await UuBtHelper.doCmd("/uuAwsc/load", btUri, authDtoIn, session, contentError);
  }

  static async doCmd(useCase, btUri, authDtoIn, session, contentError) {
    const uri = UriBuilder.parse(btUri).setUseCase(useCase).clearParameters().toString();

    try {
      return await UuBtHelper.requestGet(uri, authDtoIn, session);
    } catch (error) {
      if (contentError && typeof contentError === "function") {
        contentError(error);
      } else {
        throw error;
      }
    }
  }

  static async requestGet(uri, dtoIn, session) {
    return await AppClient.get(uri, dtoIn, { session });
  }
}

module.exports = { UuBtHelper };
