//@@viewOn:imports
import { createVisualComponent } from "uu5g04-hooks";
import Plus4U5 from "uu_plus4u5g02";
import Config from "./config/config.js";
import SpaAuthenticated from "./spa-authenticated";
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
        <SpaAuthenticated />
      </Plus4U5.SpaProvider>
    );
    //@@viewOff:render
  },
});

export default Spa;
