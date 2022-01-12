//@@viewOn:imports
import { createVisualComponent, withLazy } from "uu5g05";
import { useSystemData, useSubAppData } from "uu_plus4u5g02";
import Plus4U5App from "uu_plus4u5g02-app";
import UuJokesCore from "uu_jokesg01-core";

import Config from "./config/config";
import RouteBar from "./route-bar";
//@@viewOff:imports

const Jokes = withLazy(() => import("../routes/jokes"));
const Categories = withLazy(() => import("../routes/categories"));
const ControlPanel = withLazy(() => import("../routes/control-panel"));
const InitAppWorkspace = withLazy(() => import("../routes/init-app-workspace"));

const STATICS = {
  //@@viewOn:statics
  displayName: Config.TAG + "SpaReady",
  //@@viewOff:statics
};

export const SpaReady = createVisualComponent({
  ...STATICS,

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render() {
    //@@viewOn:private
    const { data: subApp } = useSubAppData();
    const { data: system } = useSystemData();
    //@@viewOff:private

    //@@viewOn:render
    const routeMap = {
      [Config.Routes.JOKES]: () => <Jokes />,
      [Config.Routes.CATEGORIES]: () => <Categories />,
      [Config.Routes.CONTROL_PANEL]: () => <ControlPanel />,
      [Config.Routes.INIT_APP_WORKSPACE]: () => <InitAppWorkspace />,
      "": { redirect: Config.Routes.JOKES },
      "*": { redirect: Config.Routes.JOKES },
    };

    return (
      <UuJokesCore.Jokes.PermissionProvider profileList={system?.profileData.uuIdentityProfileList}>
        <Plus4U5App.Spa>
          {subApp?.state === "active" && <RouteBar />}
          <Plus4U5App.Router routeMap={routeMap} />
        </Plus4U5App.Spa>
      </UuJokesCore.Jokes.PermissionProvider>
    );
    //@@viewOff:render
  },
});

export default SpaReady;
