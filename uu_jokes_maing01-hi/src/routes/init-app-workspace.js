// TODO - properly with uu5g05 forms

//@@viewOn:imports
import { createVisualComponent, Utils, useLsiValues } from "uu5g05";
import Uu5Elements from "uu5g05-elements";
import { RouteController } from "uu_plus4u5g02-app";
import RouteContainer from "../core/route-container";
import Config from "./config/config.js";
import LsiData from "./init-app-workspace-lsi.js";
//@@viewOff:imports

const STATICS = {
  //@@viewOn:statics
  displayName: Config.TAG + "InitAppWorkspace",
  //@@viewOff:statics
};

export const InitAppWorkspace = createVisualComponent({
  ...STATICS,

  //@@viewOn:propTypes
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const lsiValues = useLsiValues(LsiData);
    //@@viewOff:private

    //@@viewOn:render
    return (
      <RouteController>
        <RouteContainer>
          <Uu5Elements.HighlightedBox colorScheme={"primary"}>
            {Utils.Uu5String.toChildren(lsiValues.formHeaderInfo)}
          </Uu5Elements.HighlightedBox>
        </RouteContainer>
      </RouteController>
    );
  },
  //@@viewOff:render
});

export default InitAppWorkspace;
