//@@viewOn:imports
import { createVisualComponent } from "uu5g04-hooks";
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

  render(props) {
    //@@viewOn:private
    //@@viewOff:private

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:render
    return <SpaReady />;
    //@@viewOff:render
  },
});

export default SpaAuthenticated;
