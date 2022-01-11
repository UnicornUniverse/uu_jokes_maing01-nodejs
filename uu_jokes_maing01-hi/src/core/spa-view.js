//@@viewOn:imports
import UU5 from "uu5g04";
import { createVisualComponent } from "uu5g04-hooks";
import { useSubAppData } from "uu_plus4u5g02";
import Plus4U5App from "uu_plus4u5g02-app";
import "uu5g04-bricks";

import Config from "./config/config";
import RouteBar from "./route-bar";
//@@viewOff:imports

const Jokes = UU5.Common.Component.lazy(() => import("../routes/jokes"));
const Categories = UU5.Common.Component.lazy(() => import("../routes/categories"));
const ControlPanel = UU5.Common.Component.lazy(() => import("../routes/control-panel"));
const InitAppWorkspace = UU5.Common.Component.lazy(() => import("../routes/init-app-workspace"));
const About = UU5.Common.Component.lazy(() => import("../routes/about"));

const STATICS = {
  //@@viewOn:statics
  displayName: Config.TAG + "SpaView",
  //@@viewOff:statics
};

export const SpaView = createVisualComponent({
  ...STATICS,

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render() {
    //@@viewOn:private
    const { state } = useSubAppData();
    //@@viewOff:private

    //@@viewOn:render
    const routeMap = {
      [Config.Routes.JOKES]: () => <Jokes />,
      [Config.Routes.CATEGORIES]: () => <Categories />,
      [Config.Routes.CONTROL_PANEL]: () => <ControlPanel />,
      [Config.Routes.INIT_APP_WORKSPACE]: () => <InitAppWorkspace />,
      [Config.Routes.ABOUT]: () => <About />,
      "": { redirect: Config.Routes.JOKES },
      "*": { redirect: Config.Routes.JOKES },
    };

    return (
      <Plus4U5App.Spa>
        {state !== "pendingNoData" && <RouteBar />}
        <Plus4U5App.Router routeMap={routeMap} />
      </Plus4U5App.Spa>
    );
    //@@viewOff:render
  },
});

export default SpaView;
