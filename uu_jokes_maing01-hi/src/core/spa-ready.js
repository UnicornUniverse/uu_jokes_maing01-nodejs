//@@viewOn:imports
import UU5 from "uu5g04";
import { createVisualComponent } from "uu5g04-hooks";
import { useSystemData } from "uu_plus4u5g02";
import Plus4U5App from "uu_plus4u5g02-app";
import UuJokesCore from "uu_jokesg01-core";
import "uu5g04-bricks";

import Config from "./config/config";
import withSuspense from "./withSuspense";
//@@viewOff:imports

const Jokes = withSuspense(UU5.Common.Component.lazy(() => import("../routes/jokes")));
const Categories = withSuspense(UU5.Common.Component.lazy(() => import("../routes/categories")));
const ControlPanel = withSuspense(UU5.Common.Component.lazy(() => import("../routes/control-panel")));
const InitAppWorkspace = withSuspense(UU5.Common.Component.lazy(() => import("../routes/init-app-workspace")));
const About = withSuspense(UU5.Common.Component.lazy(() => import("../routes/about")));

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
      <UuJokesCore.Jokes.PermissionProvider profileList={system.profileData.uuIdentityProfileList}>
        <Plus4U5App.Spa routeMap={routeMap} />
      </UuJokesCore.Jokes.PermissionProvider>
    );
    //@@viewOff:render
  },
});

export default SpaReady;
