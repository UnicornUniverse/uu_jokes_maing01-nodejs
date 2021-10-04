//@@viewOn:imports
import UU5 from "uu5g04";
import { createVisualComponent } from "uu5g04-hooks";
import { useRoute } from "uu5g05";
import { useSubAppData, useSystemData } from "uu_plus4u5g02";
import Plus4U5App from "uu_plus4u5g02-app";

import Config from "./config/config";
import Lsi from "./route-bar-lsi";
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

    const actionList = [];

    if (system.awidData.sysState === Config.AppWorkspace.State.CREATED) {
      if (route.uu5Route !== Config.Routes.INIT_APP_WORKSPACE) {
        actionList.push({
          children: <UU5.Bricks.Lsi lsi={Lsi.initAppWorkspace} />,
          onClick: () => setRoute(Config.Routes.INIT_APP_WORKSPACE),
        });
      }
    }

    if (system.awidData.sysState !== Config.AppWorkspace.State.CREATED) {
      actionList.push({
        children: <UU5.Bricks.Lsi lsi={Lsi.jokes} />,
        onClick: () => setRoute(Config.Routes.JOKES),
      });

      actionList.push({
        children: <UU5.Bricks.Lsi lsi={Lsi.categories} />,
        onClick: () => setRoute(Config.Routes.CATEGORIES),
      });

      actionList.push({
        children: <UU5.Bricks.Lsi lsi={Lsi.controlPanel} />,
        onClick: () => setRoute(Config.Routes.CONTROL_PANEL),
      });
    }

    actionList.push({
      children: <UU5.Bricks.Lsi lsi={Lsi.about} />,
      onClick: () => setRoute(Config.Routes.ABOUT),
    });
    //@@viewOff:private

    //@@viewOn:render
    const attrs = UU5.Common.VisualComponent.getAttrs(props);
    return (
      <Plus4U5App.RouteBar appActionList={actionList} {...attrs}>
        <Plus4U5App.RouteHeader title={jokes?.name ?? Lsi.namePlaceholder} />
      </Plus4U5App.RouteBar>
    );
    //@@viewOff:render
  },
});

export default RouteBar;
