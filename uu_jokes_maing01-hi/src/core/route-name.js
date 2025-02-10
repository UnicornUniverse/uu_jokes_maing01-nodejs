//@@viewOn:imports
import { createVisualComponent, PropTypes, useLsi, Utils } from "uu5g05";
import Config from "./config/config.js";
import importLsi from "../lsi/import-lsi.js";
//@@viewOff:imports

const RouteName = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "RouteName",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    code: PropTypes.string.isRequired,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render({ code, ...propsToPass }) {
    //@@viewOn:private
    const lsi = useLsi(importLsi, [RouteName.uu5Tag]);
    const attrs = Utils.VisualComponent.getAttrs(propsToPass);
    //@@viewOff:private

    //@@viewOn:render
    return <span {...attrs}>{lsi[code]}</span>;
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { RouteName };
export default RouteName;
//@@viewOff:exports
