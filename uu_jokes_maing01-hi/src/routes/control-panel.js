//@@viewOn:imports
import UU5 from "uu5g04";
import UuTerritory from "uu_territoryg01";
import "uu_territoryg01-artifactifc";
import "uu5g04-bricks";
import "uu5g04-forms";
import "uu5codekitg01";
import Plus4U5 from "uu_plus4u5g01";
import UuContentKit from "uu_contentkitg01";

import Calls from "calls";
import { dig } from "../helpers/object-utils";
import LSI from "./control-panel-lsi";

//@@viewOff:imports

export const ControlPanel = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.PureRenderMixin, UU5.Common.RouteMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: "ControlPanel",
    classNames: {
      main: "ControlPanel"
    },
    lsi: LSI
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _handleLoad() {
    return Calls.getWorkspace();
  },

  _getChild() {
    return (
      <UU5.Common.Loader onLoad={this._handleLoad}>
        {({ isLoading, isError, data }) => {
          if (isError) {
            return (
              <Plus4U5.Bricks.Error
                {...this.getMainPropsToPass()}
                error={data.dtoOut}
                errorData={dig(data, "dtoOut", "uuAppErrorMap")}
                content={this.getLsiComponent("rightsError")}
              />
            );
          } else if (isLoading) {
            return <UU5.Bricks.Loading/>;
          } else if (data.artifactUri) {
            const url = new URL(data.artifactUri);
            return (
              <UuTerritory.ArtifactIfc.Bricks.PermissionSettings
                style={{ marginLeft: "30px", marginRight: "30px", width: "initial" }}
                territoryBaseUri={url.href.split("?")[0]}
                artifactId={url.searchParams.get("id")}
              />
            );
          } else {
            return (
              <UuContentKit.Bricks.BlockDanger>
                {this.getLsiComponent("btNotConnected")}
              </UuContentKit.Bricks.BlockDanger>
            );
          }
        }}
      </UU5.Common.Loader>
    );
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return this._getChild();
  }
  //@@viewOff:render
});

export default ControlPanel;
