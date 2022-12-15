const fs = require("fs");
const path = require("path");
const unzipper = require("unzipper");
const os = require("os");
const {AppClient} = require("uu_appg01_core-appclient");
const OidcClient = require("../helpers/oidc-client");

const SOURCE_BOOKKIT = "https://uuapp.plus4u.net/uu-bookkit-maing01/63d0f03c73cc42b1b67b3e780cc4aad9";
const ROOT_FLD_NAME = "uu_dockerenvg01";

async function _getLocalVersion() {
    let pkgJsonPath = path.join(__dirname, "..", "package.json");
    let pkgJson = await fs.promises.readFile(pkgJsonPath, "utf8");
    return JSON.parse(pkgJson).version;
}

async function unzip(zipStream) {
    let tempFld = await fs.promises.mkdtemp(path.join(os.tmpdir(), ROOT_FLD_NAME + "-"));
    return new Promise((resolve, reject) => {
        zipStream
            .pipe(unzipper.Extract({ path: tempFld }))
            .on("close", () => {
                resolve(tempFld);
            })
            .on("error", reject);
    });
}

async function _getRemoteData() {
    let token = await OidcClient.interactiveLogin("prod");
    let headers = {
        Authorization: "Bearer " + token,
    };
    let binariesDtoOut = await AppClient.get(SOURCE_BOOKKIT + "/listBinaries", { tagList: ["version/latest"] }, { headers });

    let binaries = binariesDtoOut.data.itemList;
    if (binaries.length !== 1) {
        throw new Error(
            "Expected exactly one Zip file in source bookkit with tag 'version/latest', " +
            "but found " + binaries.length + ". Please contact support of uuDockerEnvg01 by Skype or by request."
        );
    }

    let zipStream = await AppClient.get(SOURCE_BOOKKIT + "/getBinaryData", { code: binaries[0].code }, { headers });
    let zipFld = await unzip(zipStream);

    let pkgJsonPath = path.join(zipFld, ROOT_FLD_NAME, "tools", "package.json");
    let pkgJson = await fs.promises.readFile(pkgJsonPath, "utf8");
    let version = JSON.parse(pkgJson).version;

    return { version, zipFld };
}

/**
 * cp -R.
 * @param {string} src  The path to the thing to copy.
 * @param {string} dest The path to the new copy.
 */
function copyRecursiveSync(src, dest) {
    const exists = fs.existsSync(src);
    const stats = exists && fs.statSync(src);
    const isDirectory = exists && stats.isDirectory();
    if (isDirectory) {
        try {
            fs.mkdirSync(dest);
        } catch (e) {
            if (e.code !== "EEXIST") throw e;
        }
        fs.readdirSync(src).forEach((childItemName) => {
            copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
        });
    } else {
        fs.copyFileSync(src, dest);
    }
}

async function overwriteRoot(zipFld) {
    let rootPath = path.join(__dirname, "..", "..", "..");
    copyRecursiveSync(zipFld, rootPath);
}

async function main() {
    let localVersion = await _getLocalVersion();

    let zipFld;
    try {
        let remoteData = await _getRemoteData();
        let remoteVersion = remoteData.version;
        zipFld = remoteData.zipFld;

        if (localVersion === remoteVersion) {
            console.warn(`Current version of local ${ROOT_FLD_NAME} folder (${localVersion}) is the same as remote version (${remoteVersion}).`);
        } else {
            await overwriteRoot(zipFld);
            console.log(ROOT_FLD_NAME + " folder has been updated to latest version: " + remoteVersion);
        }
    } finally {
        zipFld && await fs.promises.rm(zipFld, { recursive: true });
    }

    console.log("uuDockerEnv update finished.");
}

main().catch(e => {
    console.error(e);
});
