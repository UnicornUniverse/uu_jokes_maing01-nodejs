//@@viewOn:imports
import { createVisualComponent, Lsi, DynamicLibraryComponent } from "uu5g05";
import { Text, Block, HighlightedBox } from "uu5g05-elements";
import { useAwscData, useSystemData } from "uu_plus4u5g02";
import { Uri } from "uu_appg01_core";
import { Jokes } from "uu_jokesg01-core";
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
    const { data: system } = useSystemData();
    let uuTerritoryBaseUri;

    if (awsc) {
      const artifactUri = Uri.Uri.parse(system.awidData.artifactUri);
      uuTerritoryBaseUri = artifactUri.getBaseUri().toString();
    }
    //@@viewOff:private

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:render
    const headerElement = (
      <Text category="story" segment="heading" type="h1">
        <Lsi lsi={LsiData.title} />
      </Text>
    );

    return (
      <RouteController>
        <RouteContainer>
          <Block header={headerElement} collapsible={false}>
            <Jokes.BasicInfo />
            {awsc && (
              <>
                <DynamicLibraryComponent
                  uu5Tag="UuTerritory.ArtifactIfc.Bricks.StateHistory"
                  territoryBaseUri={uuTerritoryBaseUri}
                  artifactId={awsc.data.artifact.id}
                  contextType="none"
                  cardView="full"
                />
                <DynamicLibraryComponent
                  uu5Tag="UuTerritory.Activity.Bricks.ActivityList"
                  territoryBaseUri={uuTerritoryBaseUri}
                  artifactId={awsc.data.artifact.id}
                  contextType="none"
                  cardView="full"
                />
                <DynamicLibraryComponent
                  uu5Tag="UuTerritory.ArtifactIfc.Bricks.PermissionSettings"
                  territoryBaseUri={uuTerritoryBaseUri}
                  artifactId={awsc.data.artifact.id}
                  contextType="none"
                  cardView="full"
                />
              </>
            )}
            {!awsc && (
              <HighlightedBox colorScheme={"negative"} className={Css.noBt()}>
                <Lsi lsi={LsiData.btNotConnected} />
              </HighlightedBox>
            )}
          </Block>
        </RouteContainer>
      </RouteController>
    );
  },
});

//@@viewOn:css
const Css = {
  noBt: () => Config.Css.css`margin-top: 16px`,
};
//@@viewOff:css

export default ControlPanel;
