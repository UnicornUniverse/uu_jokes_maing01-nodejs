//@@viewOn:imports
import UU5 from "uu5g04";
import UuTerritory from "uu_territoryg01";
import UuContentKit from "uu_contentkitg01";
import { createVisualComponent } from "uu5g04-hooks";
import { useAwscData } from "uu_plus4u5g02";
import { RouteController } from "uu_plus4u5g02-app";
import { Jokes } from "uu_jokesg01-core";
import "uu_territoryg01-artifactifc";

import Config from "./config/config.js";
import Lsi from "./control-panel-lsi";
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
    const { data: awsc } = useAwscData();
    //@@viewOff:private

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:render
    return (
      <RouteController>
        <UU5.Bricks.Container noSpacing>
          <UU5.Bricks.Section header={<UU5.Bricks.Lsi lsi={Lsi.title} />} style={{ padding: "0px 24px 0px 24px" }}>
            <Jokes.BasicInfo />
            {awsc && (
              <>
                <UuTerritory.ArtifactIfc.Bricks.StateHistory
                  territoryBaseUri={awsc.data.uuTerritoryBaseUri}
                  artifactId={awsc.data.artifact.id}
                  contextType="none"
                  cardView="full"
                />
                <UuTerritory.Activity.Bricks.ActivityList
                  territoryBaseUri={awsc.data.uuTerritoryBaseUri}
                  artifactId={awsc.data.artifact.id}
                  contextType="none"
                  cardView="full"
                />
                <UuTerritory.ArtifactIfc.Bricks.PermissionSettings
                  territoryBaseUri={awsc.data.uuTerritoryBaseUri}
                  artifactId={awsc.data.artifact.id}
                  contextType="none"
                  cardView="full"
                />
              </>
            )}
            {!awsc && (
              <UuContentKit.Bricks.BlockDanger>
                <UU5.Bricks.Lsi lsi={Lsi.btNotConnected} />
              </UuContentKit.Bricks.BlockDanger>
            )}
          </UU5.Bricks.Section>
        </UU5.Bricks.Container>
      </RouteController>
    );
  },
});

export default ControlPanel;
