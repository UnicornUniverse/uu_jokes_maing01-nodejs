//@@viewOn:imports
import UU5 from "uu5g04";
import UuTerritory from "uu_territoryg01";
import "uu_territoryg01-artifactifc";
import "uu5g04-bricks";
import "uu5g04-forms";
import "uu5codekitg01";
import LSI from "../core/spa-authenticated-lsi";


//@@viewOff:imports

export const ControlPanel = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.PureRenderMixin],
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
  _getChild() {
    return (<UuTerritory.ArtifactIfc.Bricks.PermissionSettings territoryBaseUri="https://uuappg01-eu-w-1.plus4u.net/uu-businessterritory-maing01/f69130799e8649ffa07eb81aae84bec5" artifactId="5e7df2b47c0b32001c0b4bb4"/>);
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return this._getChild();
  }
  //@@viewOff:render
});

export default ControlPanel;
