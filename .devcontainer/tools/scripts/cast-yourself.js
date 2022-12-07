const { AppClient } = require("uu_appg01_core-appclient");
const OidcClient = require("../helpers/oidc-client");
const LoginTools = require("../helpers/login-tools");
const Environments = require("../helpers/environments");
const jwt = require("jwt-decode");

async function main() {
    let token = await OidcClient.interactiveLogin();
    let { uuidentity: uuIdentity, name: userName } = jwt(token);

    const holly = await LoginTools.getHollyIdentity();
    if (holly.uuIdentity === uuIdentity) {
        throw "You are logged onto Holly Hudson account, please logout and log onto your own account."
    }

    const hollyToken = await LoginTools.getHollyToken();
    const bemClient = new AppClient({ baseUri: Environments.uuBem.getBaseUri(), headers: { Authorization: hollyToken }});
    try {
        await bemClient.post("personCard/createFromPlus4UPeople", { createAccessRole: true, uuIdentity });
    } catch (e) {
        if (!e?.dtoOut?.uuAppErrorMap?.["uu-bem-maing01/personCard/createFromPlus4UPeople/personAddFailed"]?.cause?.uuAppErrorMap?.["uu-bem-maing01/personCard/add/personDaoCreateFailed"]?.cause?.uuAppErrorMap?.["uu-app-objectstore/duplicateKey"]) {
            throw e;
        }
    }

    const btClient = new AppClient({ baseUri: Environments.uuBt.getBaseUri(), headers: { Authorization: hollyToken }});
    try {
        await btClient.post("uuUnitGroup/addCast", { code: "LOCAL_DEV_BT-authorities", sideBCode: uuIdentity });
    } catch (e) {
        if (e.code !== "uu-businessterritory-maing01/uuGroupIfc/addCast/castAlreadyExists")
        throw e;
    }

    console.log(`Access created for user ${userName} (${uuIdentity}).`);
}

main().catch(e => {
    console.error(e);
});