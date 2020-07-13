import UU5 from "uu5g04";

const UriHelpers = {
  openNewTab(component) {
    let url = UriHelpers.buildUrl({ useCase: component.code });
    window.open(url, "_blank");
  },

  setRoute: (component, setStateCallback) => {
    UU5.Environment.setRoute(component.code, null, setStateCallback);
  },

  getBinaryUrl(code) {
    return UriHelpers.buildUrl({
      useCase: "uu-app-binarystore/getBinaryData",
      parameters: { code }
    });
  },

  getProductLogo(type) {
    return UriHelpers.buildUrl({
      useCase: "sys/uuAppWorkspace/productLogo/get",
      parameters: { type, language: "en" }
    });
  },

  buildUrl(data) {
    let url = UU5.Common.Url.parse();
    if (data.useCase) {
      // workaround for UU-BT:UU.UU5G04/20181211_0001
      // setUseCase is/was broken
      let baseUrl = `${url.origin}/${url.baseName}`;
      if (!baseUrl[baseUrl.length - 1] === "/") {
        baseUrl = baseUrl + "/";
      }
      url = UU5.Common.Url.parse(`${baseUrl}${data.useCase}`);
    }
    url.set(data);
    return url.toString();
  }
};

export default UriHelpers;
