//@@viewOn:imports
import { createVisualComponent } from "uu5g05";
import Plus4U5 from "uu_plus4u5g02";
import Config from "./config/config.js";
import SpaReady from "./spa-ready";
//@@viewOff:imports

const STATICS = {
  //@@viewOn:statics
  displayName: Config.TAG + "Spa",
  //@@viewOff:statics
};

export const Spa = createVisualComponent({
  ...STATICS,

  //@@viewOn:propTypes
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  //@@viewOff:defaultProps

  render() {
    //@@viewOn:private
    //@@viewOff:private

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:render
    return (
      <Plus4U5.SpaProvider initialLanguageList={["en", "cs"]}>
        <SpaReady />
      </Plus4U5.SpaProvider>
    );
    //@@viewOff:render
  },
});

export default Spa;
