//@@viewOn:imports
import { createVisualComponent, PropTypes } from "uu5g05";
import { Core } from "uu_jokesg01-core";
import Config from "./config/config";
//@@viewOff:imports

export const View = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "View",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    aboutDataObject: PropTypes.object.isRequired,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    //@@viewOff:private

    //@@viewOn:render
    return (
      <Core.DataObjectStateResolver dataObject={props.aboutDataObject}>
        <pre>{JSON.stringify(props.aboutDataObject.data, null, 2)}</pre>
      </Core.DataObjectStateResolver>
    );
    //@@viewOff:render
  },
});

export default View;
