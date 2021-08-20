//@@viewOn:imports
import { createVisualComponent } from "uu5g04-hooks";
import { useSubAppData } from "uu_plus4u5g02";
import { RoutePending, SpaError } from "uu_plus4u5g02-app";
import "uu_plus4u5g01-app";

import Config from "./config/config.js";
import SpaReady from "./spa-ready.js";
//@@viewOff:imports

const STATICS = {
  //@@viewOn:statics
  displayName: Config.TAG + "Spa",
  //@@viewOff:statics
};

export const SpaAuthenticated = createVisualComponent({
  ...STATICS,

  //@@viewOn:propTypes
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  //@@viewOff:defaultProps

  render() {
    //@@viewOn:private
    const subApp = useSubAppData();
    //@@viewOff:private

    //@@viewOn:render

    switch (subApp.state) {
      case "pending":
        return <RoutePending />;
      case "error":
        return <SpaError error={subApp.errorData} />;
      default:
        return <SpaReady />;
    }
    //@@viewOff:render
  },
});

export default SpaAuthenticated;
