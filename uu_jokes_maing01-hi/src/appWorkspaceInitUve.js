import InitAppWorkspace from "./config/initAppworkspace"
import {AppContainer} from "react-hot-loader";
import * as UU5 from "uu5g04";

import Spa from "./core/spa.js";

import "./index.less";

// propagate app version into environment
UU5.Environment["appVersion"] = process.env.VERSION;

// consider app as progressive web app, but not on iOS (OIDC login doesn't work there)
if (!navigator.userAgent.match(/iPhone|iPad|iPod/)) {
  let link = document.createElement("link");
  link.rel = "manifest";
  link.href = "assets/manifest.json.json";
  document.head.appendChild(link);
}


export function render(targetElementId) {

  UU5.Common.DOM.render(
    <AppContainer>
      <Spa customComp={<InitAppWorkspace/>}/>
    </AppContainer>,
    document.getElementById(targetElementId)
  );
}
