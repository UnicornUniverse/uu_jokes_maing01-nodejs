//@@viewOn:imports
import { createVisualComponent } from "uu5g05";
import { withRoute } from "uu_plus4u5g02-app";
import { Breadcrumbs } from "uu5g05-elements";
import { AwidAbout } from "uu_plus4u5g02-elements";

import RouteName from "../core/route-name";
import Route from "../utils/route";
import Config from "./config/config.js";
//@@viewOff:imports

let About = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "About",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render() {
    //@@viewOn:private
    const subtitle = {
      route: (
        <Breadcrumbs
          itemList={[
            { children: <RouteName code={Route.JOKES} />, href: Route.JOKES, collapsed: false },
            { children: <RouteName code={Route.ABOUT} />, collapsed: false },
          ]}
        />
      ),
    };

    //@@viewOff:private

    //@@viewOn:render
    return <AwidAbout subtitle={subtitle} />;
    //@@viewOff:render
  },
});

About = withRoute(About);

//@@viewOn:exports
export { About };
export default About;
//@@viewOff:exports
