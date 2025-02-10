//@@viewOn:imports
import { createVisualComponent, useEffect } from "uu5g05";
import { withRoute } from "uu_plus4u5g02-app";
import Plus4U5 from "uu_plus4u5g02";

import Config from "./config/config.js";
//@@viewOff:imports

let About = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "About",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render() {
    //@@viewOn:private
    const { data: systemData } = Plus4U5.useSystemData();

    useEffect(() => {
      if (systemData) {
        const uri = Plus4U5.Utils.Uri.join(systemData.relatedObjectsMap.uuAppWebKitUri, "about-product");
        Plus4U5.Utils.Uri.open(uri.toString());
      }
    }, [systemData]);
    //@@viewOff:private

    //@@viewOn:render
    return null;
    //@@viewOff:render
  },
});

About = withRoute(About);

//@@viewOn:exports
export { About };
export default About;
//@@viewOff:exports
