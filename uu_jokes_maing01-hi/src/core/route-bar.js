//@@viewOn:imports
import { createVisualComponent, useRoute, Lsi } from "uu5g05";
import { useSubAppData, useSystemData } from "uu_plus4u5g02";
import Plus4U5App from "uu_plus4u5g02-app";

import Config from "./config/config";
import LsiData from "./route-bar-lsi";
//@@viewOff:imports

const STATICS = {
  //@@viewOn:statics
  displayName: Config.TAG + "RouteBar",
  //@@viewOff:statics
};

export const RouteBar = createVisualComponent({
  ...STATICS,

  //@@viewOn:propTypes
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const [route, setRoute] = useRoute();
    const { data: system } = useSystemData();
    const { data: jokes } = useSubAppData();

    const actionMap = {};

    if (system?.awidData?.sysState === Config.AppWorkspace.State.CREATED) {
      actionMap[Config.Routes.INIT_APP_WORKSPACE] = {
        children: <Lsi lsi={LsiData.initAppWorkspace} />,
        onClick: () => setRoute(Config.Routes.INIT_APP_WORKSPACE),
      };
    } else {
      actionMap[Config.Routes.JOKES] = {
        children: <Lsi lsi={LsiData.jokes} />,
        onClick: () => setRoute(Config.Routes.JOKES),
        icon: "mdi-emoticon-happy",
      };

      actionMap[Config.Routes.CATEGORIES] = {
        children: <Lsi lsi={LsiData.categories} />,
        onClick: () => setRoute(Config.Routes.CATEGORIES),
        icon: "mdi-shape",
      };

      actionMap[Config.Routes.CONTROL_PANEL] = {
        children: <Lsi lsi={LsiData.controlPanel} />,
        onClick: () => setRoute(Config.Routes.CONTROL_PANEL),
        icon: "mdi-tune",
        collapsed: true,
      };

      actionMap[Config.Routes.ABOUT] = {
        children: <Lsi lsi={LsiData.about} />,
        onClick: () => setRoute(Config.Routes.ABOUT),
        icon: "mdi-information",
        collapsed: true,
      };
    }

    const activeAction = actionMap[route.uu5Route];

    if (activeAction) {
      activeAction.significance = "highlighted";
      activeAction.colorScheme = "primary";
    }
    //@@viewOff:private

    //@@viewOn:render
    return (
      <Plus4U5App.RouteBar appActionList={Object.values(actionMap)}>
        <Plus4U5App.RouteHeader title={jokes?.name ?? Lsi.namePlaceholder} />
      </Plus4U5App.RouteBar>
    );
    //@@viewOff:render
  },
});

export default RouteBar;
