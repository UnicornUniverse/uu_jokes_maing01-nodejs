//@@viewOn:imports
import { createVisualComponent } from "uu5g05";
import UuJokesCore from "uu_jokesg01-core";
import { RouteController } from "uu_plus4u5g02-app";
import RouteContainer from "../core/route-container";

import Config from "./config/config";
//@@viewOff:imports

const Categories = createVisualComponent({
  //@@viewOn:statics
  displayName: Config.TAG + "Categories",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render() {
    //@@viewOn:private
    //@@viewOff:private

    //@@viewOn:render
    return (
      <RouteController>
        <RouteContainer>
          <UuJokesCore.Category.List cardView="none" elevation={0} style={{ padding: "40px 24px 0px 24px" }} />
        </RouteContainer>
      </RouteController>
    );
    //@@viewOff:render
  },
});

export default Categories;
