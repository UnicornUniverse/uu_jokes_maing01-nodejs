//@@viewOn:imports
import { createVisualComponent } from "uu5g05";
import UuJokesCore from "uu_jokesg01-core";
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
      <RouteContainer>
        <UuJokesCore.Category.List cardView="none" elevation={0} style={{ padding: "40px 24px 0px 24px" }} />
      </RouteContainer>
    );
    //@@viewOff:render
  },
});

export default Categories;
