//@@viewOn:imports
//@@viewOn:imports
import UU5 from "uu5g04";
import { createVisualComponent } from "uu5g04-hooks";
import { withRoute } from "uu_plus4u5g02-app";
import Config from "./config/config";
import RouteBar from "../core/route-bar";
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
      <div>
        <RouteBar />
        <UU5.Bricks.Container noSpacing>TODO Categories</UU5.Bricks.Container>
      </div>
    );
    //@@viewOff:render
  },
});

export default withRoute(Categories);
