//@@viewOn:imports
import { createVisualComponent, Lsi, DynamicLibraryComponent, useLsi } from "uu5g05";
import { RouteContainer } from "uu_plus4u5g02-elements";
import { Text, HighlightedBox, Grid } from "uu5g05-elements";
import { useAwscData, useSystemData } from "uu_plus4u5g02";
import { withRoute } from "uu_plus4u5g02-app";
import { Uri } from "uu_appg01_core";
import UuJokesCore from "uu_jokesg01-core";
import RouteName from "../core/route-name";
import Route from "../utils/route";
import Config from "./config/config";
import importLsi from "../lsi/import-lsi";
//@@viewOff:imports

const InternalControlPanel = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "ControlPanel",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const lsi = useLsi(importLsi, [InternalControlPanel.uu5Tag]);
    const { data: awsc } = useAwscData();
    const { data: system } = useSystemData();
    let uuTerritoryBaseUri;

    if (awsc) {
      const artifactUri = Uri.Uri.parse(system.awidData.artifactUri);
      uuTerritoryBaseUri = artifactUri.getBaseUri().toString();
    }

    const headerElement = (
      <Text category="story" segment="heading" type="h1">
        <RouteName code={Route.CONTROL_PANEL} />
      </Text>
    );
    //@@viewOff:private

    //@@viewOn:render
    return (
      <RouteContainer header={headerElement}>
        <Grid>
          <Grid.Item>
            <UuJokesCore.Workspace.BasicInfo />
          </Grid.Item>
          {awsc && (
            <>
              <Grid.Item>
                <DynamicLibraryComponent
                  uu5Tag="UuTerritory.ArtifactIfc.Bricks.StateHistory"
                  territoryBaseUri={uuTerritoryBaseUri}
                  artifactId={awsc.data.artifact.id}
                  contextType="none"
                  cardView="full"
                />
              </Grid.Item>
              <Grid.Item>
                <DynamicLibraryComponent
                  uu5Tag="UuTerritory.Activity.Bricks.ActivityList"
                  territoryBaseUri={uuTerritoryBaseUri}
                  artifactId={awsc.data.artifact.id}
                  contextType="none"
                  cardView="full"
                />
              </Grid.Item>
              <Grid.Item>
                <DynamicLibraryComponent
                  uu5Tag="UuTerritory.ArtifactIfc.Bricks.PermissionSettings"
                  territoryBaseUri={uuTerritoryBaseUri}
                  artifactId={awsc.data.artifact.id}
                  contextType="none"
                  cardView="full"
                />
              </Grid.Item>
            </>
          )}
          {!awsc && (
            <Grid.Item>
              <HighlightedBox colorScheme={"negative"}>
                <Lsi lsi={lsi.btNotConnected} />
              </HighlightedBox>
            </Grid.Item>
          )}
        </Grid>
      </RouteContainer>
    );
    //@@viewOff:render
  },
});

const ControlPanel = withRoute(InternalControlPanel, { authenticated: true });

//@@viewOn:exports
export { ControlPanel };
export default ControlPanel;
//@@viewOff:exports
