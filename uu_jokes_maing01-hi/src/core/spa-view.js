//@@viewOn:imports
import { createVisualComponent, Utils } from "uu5g05";
import { ModalBus } from "uu5g05-elements";
import { useSystemData } from "uu_plus4u5g02";
import Plus4U5App from "uu_plus4u5g02-app";

import Config from "./config/config";
import RouteBar from "./route-bar";
//@@viewOff:imports

const Jokes = Utils.Component.lazy(() => import("../routes/jokes"));
const Categories = Utils.Component.lazy(() => import("../routes/categories"));
const ControlPanel = Utils.Component.lazy(() => import("../routes/control-panel"));
const InitAppWorkspace = Utils.Component.lazy(() => import("../routes/init-app-workspace"));
const About = Utils.Component.lazy(() => import("../routes/about"));

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
    const { data: system } = useSystemData();
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
        {system?.awidData.sysState !== Config.AppWorkspace.State.CREATED && <RouteBar />}
        <Plus4U5App.Router routeMap={routeMap} />
      </Plus4U5App.Spa>
    );
    //@@viewOff:render
  },
});

export default SpaView;
