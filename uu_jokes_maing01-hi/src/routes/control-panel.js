//@@viewOn:imports
import UU5 from "uu5g04";
import { createVisualComponent } from "uu5g04-hooks";
import { useTerritoryData } from "uu_plus4u5g02";
import { withRoute } from "uu_plus4u5g02-app";
import UuTerritory from "uu_territoryg01";
import UuContentKit from "uu_contentkitg01";
import { Jokes } from "uu_jokesg01-core";
import "uu_territoryg01-artifactifc";

import Config from "./config/config.js";
import RouteBar from "../core/route-bar";
import Lsi from "../config/lsi.js";
//@@viewOff:imports

const STATICS = {
  //@@viewOn:statics
  displayName: Config.TAG + "ControlPanel",
  //@@viewOff:statics
};

const ControlPanel = createVisualComponent({
  ...STATICS,

  //@@viewOn:propTypes
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  //@@viewOff:defaultProps

  render() {
    //@@viewOn:private
    const { data: territory } = useTerritoryData();
    //@@viewOff:private

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:render
    return (
      <>
        <RouteBar />
        <UU5.Bricks.Container noSpacing>
          <UU5.Bricks.Section header="Control Panel" style={{ padding: "0px 24px 0px 24px" }}>
            <Jokes.JokesBasicInfo />
            {territory && territory.data.artifact && (
              <UuTerritory.ArtifactIfc.Bricks.PermissionSettings
                territoryBaseUri={territory.data.uuTerritoryBaseUri}
                artifactId={territory.data.artifact.id}
                cardView="full"
              />
            )}
            {!territory && (
              <UuContentKit.Bricks.BlockDanger>
                <UU5.Bricks.Lsi lsi={Lsi.controlPanel.btNotConnected} />
              </UuContentKit.Bricks.BlockDanger>
            )}
          </UU5.Bricks.Section>
        </UU5.Bricks.Container>
      </>
    );
  },
});

export default withRoute(ControlPanel);
