const { AppClient } = require("uu_appg01_core-appclient");
const OidcClient = require("../helpers/oidc-client");
const LoginTools = require("../helpers/login-tools");
const Environments = require("../helpers/environments");
const jwt = require("jwt-decode");

async function _createWorkspace(appKey, name) {
    const asidToken = await LoginTools.getBtAsidToken();
    try {
        await AppClient.post(
            Environments[appKey].getAsidBaseUri() + "/sys/uuAppWorkspace/create",
            {
                awid: Environments[appKey].yourAwid,
                awidLicenseOwnerList: ["25-8075-0000"],
                name,
                awidLicense: "XS"
            },
            {
                headers: { Authorization: asidToken }
            }
        )
    } catch (e) {
        if (e.code !== "uu-app-workspace/sys/uuAppWorkspace/create/sysUuAppWorkspaceAlreadyCreated") {
            throw e;
        }
    }
}

async function main() {
    // create MT and DW awids
    await _createWorkspace("uuDW", "Your uuDigitalWorkspace");
    await _createWorkspace("uuMT", "Your uuMyTerritory");

    let token = await OidcClient.interactiveLogin();
    let { uuidentity: uuIdentity, name: userName } = jwt(token);
    console.log("=>(prepare-your-mt.js:36) userName", userName);
    console.log("=>(prepare-your-mt.js:36) uuIdentity", uuIdentity);

    const holly = await LoginTools.getHollyIdentity();
    if (holly.uuIdentity === uuIdentity) {
        throw "You are logged onto Holly Hudson account, please logout and log onto your own account."
    }

    // initialize the MT awid
    let initDtoIn = {
        name: userName + " My Territory",
        code: Environments.uuMT.yourAwid,
        responsibleUuIdentity: {
            name: userName,
            uuIdentity
        },
        digitalWorkspaceUri: `${Environments.gateway}/${Environments.uuDW.appKey}/${Environments.uuDW.yourAwid}`
    };

    const yourMtUri = `${Environments.gateway}/${Environments.uuMT.appKey}/${Environments.uuMT.yourAwid}`;
    const awidToken = await LoginTools.getBtAwidToken();
    try {
        await AppClient.post(
            `${yourMtUri}/sys/uuAppWorkspace/init`,
            initDtoIn,
            {
                headers: { Authorization: awidToken }
            }
        );
    } catch (e) {
        if (e.code !== "uu-app-workspace/forbiddenAwidSysState") {
            throw e;
        }
    }

    // and connect it to the new territory
    await AppClient.post(
        `${Environments.uuBt.getBaseUri()}/uuPerson/connectMyTerritory`,
        {
            code: uuIdentity,
            mtUri: yourMtUri
        },
        {
            headers: { Authorization: "Bearer " + token }
        }
    );

    console.log(`Prepared My Territory for user ${userName} (${uuIdentity}) with uri: ${yourMtUri}`);
}

main().catch(e => {
    console.error(e);
});
