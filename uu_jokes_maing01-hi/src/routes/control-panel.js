//@@viewOn:imports
import { createVisualComponent, Lsi } from "uu5g05";
import Uu5Elements from "uu5g05-elements";
import { useAwscData } from "uu_plus4u5g02";
import { Jokes } from "uu_jokesg01-core";
import UuTerritory from "uu_territoryg01";
import "uu_territoryg01-artifactifc";
import { RouteController } from "uu_plus4u5g02-app";
import RouteContainer from "../core/route-container";

import Config from "./config/config.js";
import LsiData from "./control-panel-lsi";
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
        <RouteContainer>
          <Uu5Elements.Block
            header={
              <Uu5Elements.Text category="story" segment="heading" type="h1">
                <Lsi lsi={LsiData.title} />
              </Uu5Elements.Text>
            }
          >
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
              <Uu5Elements.HighlightedBox colorScheme={"negative"}>
                <Lsi lsi={LsiData.btNotConnected} />
              </Uu5Elements.HighlightedBox>
            )}
          </Uu5Elements.Block>
        </RouteContainer>
      </RouteController>
    );
  },
});

export default ControlPanel;
