const { Validator } = require("uu_appg01_server").Validation;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { Profile } = require("uu_appg01_server").Workspace;
const { UriBuilder } = require("uu_appg01_server").Uri;
const { LoggerFactory } = require("uu_appg01_server").Logging;
const { Config } = require("uu_appg01_server").Utils;
const { ProductInfo } = require("uu_apprepresentationg01");

const Fs = require("node:fs/promises");
const Path = require("node:path");

const UuBtPlugIn = require("../../component/uu-bt-plug-in");
const Errors = require("../../api/errors/jokes-error");
const Warnings = require("../../api/warnings/jokes-warnings");
const { Schemas, Jokes, Profiles } = require("../constants");

const DEFAULT_NAME = "Jokes";
const ASSET_PATH = "/public/assets/";
const PRODUCT_ICON_FILENAME = "product-icon.svg";
const COMPANY_LOGO_FILENAME = "company-logo.svg";

class InitAbl {
  constructor() {
    this.validator = new Validator(Path.join(__dirname, "../../", "api", "validation_types", "jokes-types.js"));
    this.dao = DaoFactory.getDao(Schemas.JOKES);
    this.logger = LoggerFactory.get();
  }

  async init(uri, dtoIn, session) {
    const awid = uri.getAwid();
    let uuAppErrorMap = {};
    let uuBtUri, uuBtBaseUri, uuBtUriParams;

    // hds 1
    const validationResult = this.validator.validate("jokesInitDtoInType", dtoIn);
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      Warnings.Init.UnsupportedKeys.code,
      Errors.Init.InvalidDtoIn,
    );

    // 1.4
    dtoIn.state = dtoIn.state || Jokes.States.UNDER_CONSTRUCTION;
    dtoIn.name = dtoIn.name || DEFAULT_NAME;

    // hds 2
    if (dtoIn.uuBtLocationUri) {
      try {
        uuBtUri = UriBuilder.parse(dtoIn.uuBtLocationUri).toUri();
      } catch (e) {
        throw new Errors.Init.UuBtLocationUriInvalid({ uuAppErrorMap }, { uuBtLocationUri: dtoIn.uuBtLocationUri }, e);
      }

      uuBtBaseUri = uuBtUri.getBaseUri().toString();
      uuBtUriParams = uuBtUri.getParameters();

      if (!uuBtUriParams.code && !uuBtUriParams.id) {
        throw new Errors.Init.UuBtLocationNotSpecified({ uuAppErrorMap }, { uri: dtoIn.uuBtLocationUri });
      }
    }

    // hds 3
    const promises = Object.values(Schemas).map(async (schema) => DaoFactory.getDao(schema).createSchema());
    try {
      await Promise.all(promises);
    } catch (e) {
      throw new Errors.Init.SchemaDaoCreateSchemaFailed({ uuAppErrorMap }, e);
    }

    // hds 4
    let jokes = await this.dao.getByAwid(awid);

    // hds 5
    if (!jokes) {
      const uuObject = {
        awid,
        state: dtoIn.uuBtLocationUri ? Jokes.States.INIT : dtoIn.state,
        name: dtoIn.name,
      };

      try {
        jokes = await this.dao.create(uuObject);
      } catch (e) {
        throw new Errors.Init.JokesDaoCreateFailed({ uuAppErrorMap }, e);
      }
    }

    // hds 6
    if (dtoIn.uuBtLocationUri) {
      // hds 6.1
      const awsc = await UuBtPlugIn.createAwsc(
        awid,
        uuBtBaseUri,
        dtoIn,
        uuBtUriParams,
        uuAppErrorMap,
        Errors.Init.CreateAwscFailed,
        uri,
        session,
      );

      // hds 6.3
      try {
        await UuBtPlugIn.connectArtifact(uri, uuBtUri, awsc.id, session);
      } catch (e) {
        throw new Errors.Init.ConnectAwscFailed({ uuAppErrorMap }, { awscId: awsc.id, appUri: uri.toString() }, e);
      }

      // hds 6.4
      const toUpdate = { ...jokes, state: dtoIn.state, artifactId: awsc.id, uuBtBaseUri: uuBtBaseUri };
      try {
        jokes = await this.dao.updateByAwid(toUpdate);
      } catch (e) {
        throw new Errors.Init.JokesDaoUpdateFailed({ uuAppErrorMap }, e);
      }
    } else {
      try {
        await Profile.set(awid, Profiles.AUTHORITIES, dtoIn.uuAppProfileAuthorities);
      } catch (e) {
        throw new Errors.Init.SetProfileFailed(
          { uuAppErrorMap },
          { uuAppProfileAuthorities: dtoIn.uuAppProfileAuthorities },
          e,
        );
      }
    }

    // hds 7
    await this._setProductInfo(uri, dtoIn);

    // hds 8
    return { jokes, uuAppErrorMap };
  }

  async _setProductInfo(uri, dtoIn) {
    const productIconUri = await this._getAssetUri(uri.getBaseUri(), PRODUCT_ICON_FILENAME);
    const companyLogoUri = await this._getAssetUri(uri.getBaseUri(), COMPANY_LOGO_FILENAME);
    const awid = uri.getAwid();

    const productInfoSetDtoIn = {
      name: {
        en: dtoIn.name ?? "uuJokes",
      },
      desc: {
        en: dtoIn.desc ?? "uuJokes is an example of how applications can be developed in uuDigitalConstructionKit.",
      },
      logo: {
        name: {
          en: "uuJokes",
        },
        generation: 1,
        colorSchema: "blue",
        decoration: productIconUri ?? undefined,
      },
    };

    try {
      await ProductInfo.set(awid, productInfoSetDtoIn);
    } catch (e) {
      this.logger.warn(`Failed to set product info.`, e);
    }

    const productSetLogoDtoIn = {
      title: {
        en: dtoIn.name ?? "uuJokes",
      },
      // subtitle is not used
      textBackground: "dark",
      imagePlacement: "upFront",
      primaryColor: "#083da8",
      imageUri: productIconUri,
      // predefined: "userGuide", "businessRequests", "applicationModel", "course", "organizationalStandard", "businessModel", "website"
      // if your application creates e.g. courses, you should use spec "course" here
      // it also supports icon, name, background and textBackground properties
      spec: {},
      companyLogoUri: companyLogoUri,
      generation: 1,
      typeMap: {
        // spec is hidden, as it is this is a custom uuApp. It is displayed by default though.
        social: {
          displaySpec: false,
          displayCompanyLogo: true,
        },
        logo: {
          displaySpec: false,
        },
        hero: {
          displaySpec: false,
        },
      },
      background: {
        from: "#083da8",
        to: "#0094dd",
        direction: "bottomRight",
      },
    };

    try {
      await ProductInfo.setLogo(awid, productSetLogoDtoIn);
    } catch (e) {
      this.logger.warn(`Failed to set new logo format.`, e);
    }
  }

  async _getAssetUri(uri, assetFilemane) {
    const root = Config.get("server_root") || process.cwd();
    const location = Path.join(root, ASSET_PATH, assetFilemane);

    try {
      await Fs.stat(location);
    } catch (e) {
      this.logger.warn(`Failed to read the ${assetFilemane} asset. The expected asset path: ${location}`, e);
      return null;
    }

    const asid = Config.get("asid"); // asid is used for caching purposes across awids
    return UriBuilder.parse(uri)
      .setAwid(asid)
      .setUseCase(ASSET_PATH + assetFilemane)
      .toString();
  }
}

module.exports = new InitAbl();
