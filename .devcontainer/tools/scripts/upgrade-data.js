const {AppClient} = require("uu_appg01_core-appclient");
const LoginTools = require("../helpers/login-tools");
const Environments = require("../helpers/environments");

const MIGRATION_NEEDED_STATES = ["migrationNeeded", "migrationInProgress"];

function sleep(seconds) {
    return new Promise(resolve => setTimeout(resolve, 1000 * seconds));
}

async function getMigrationStatus(client) {
    try {
        await client.cmdGet("load")
    } catch (e) {
        if (MIGRATION_NEEDED_STATES.includes(e.code)) {
            return false;
        } else {
            throw e;
        }
    }

    return true;
}

async function main() {
    console.log("Starting to upgrade data in uuBusinessTerritory.")

    const token = await LoginTools.getBtAsidToken();
    const btBaseUri = Environments.uuBt.getBaseUri();
    const client = new AppClient({ baseUri: btBaseUri, headers: { Authorization: token }});

    let migrated = await getMigrationStatus(client);
    if (migrated) {
        console.log("uuBusinessTerritory is already migrated.");
        return;
    }

    const btAsidBaseUri = Environments.uuBt.getAsidBaseUri();
    const asidClient = new AppClient({ baseUri: btAsidBaseUri, headers: { Authorization: token }});
    await asidClient.post("upgradeData", { force: false });

    let counter = 0;
    do {
        await sleep(5);
        counter += 5;
        console.log(counter + "...");
    } while (!(await getMigrationStatus(client)));

    console.log("uuBusinessTerritory is migrated.");
}

main().catch(e => {
    console.error(e);
});