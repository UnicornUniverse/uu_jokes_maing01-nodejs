const fs = require("fs");
const path = require("path");
const jwt = require("jwt-decode");
const { AppClient } = require("uu_appg01_core-appclient");
const Environments = require("./environments");

const ACCESS_CODES = {
    holly: "HollyHudson.json",
    btAsid: "25-8074-0000.json",
    btAwid: "25-8075-0000.json"
};

class LoginTools {
    constructor() {
        this._tokens = {}
    }

    async getHollyToken() {
        return await this._login("holly");
    }

    async getHollyIdentity() {
        let token = await this._login("holly");
        let { uuidentity: uuIdentity, name: userName } = jwt(token);
        return { userName, uuIdentity };
    }

    async getBtAsidToken() {
        return await this._login("btAsid");
    }

    async getBtAwidToken() {
        return await this._login("btAwid");
    }

    async _login(key) {
        if (this._tokens[key]) return this._tokens[key];

        let codesPath = path.join(__dirname, "..", "..", "access_codes", ACCESS_CODES[key]);
        let codes = JSON.parse(await fs.promises.readFile(codesPath, "utf8"));

        let tokenDtoIn = {
            grant_type: "password",
            username: codes.accessCode1,
            password: codes.accessCode2,
            scope: "openid http"
        };
        let dtoOut = await AppClient.cmdPost(Environments.oidcUri + "/oidc/grantToken", tokenDtoIn);

        this._tokens[key] = "Bearer " + dtoOut.id_token;
        return this._tokens[key];
    }
}

module.exports = new LoginTools();