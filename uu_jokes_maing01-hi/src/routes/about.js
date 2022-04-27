//@@viewOn:imports
import { createVisualComponent } from "uu5g05";
import { useSystemData } from "uu_plus4u5g02";
import { withRoute } from "uu_plus4u5g02-app";
import Config from "./config/config.js";
import AboutProvider from "../bricks/about/provider";
import AboutView from "../bricks/about/view";
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
    const { data: systemData } = useSystemData();
    //@@viewOff:private

    //@@viewOn:render
    return (
      <AboutProvider baseUri={systemData.relatedObjectsMap.uuAppWebKitUri}>
        {(aboutDataObject) => <AboutView aboutDataObject={aboutDataObject} />}
      </AboutProvider>
    );
    //@@viewOff:render
  },
});

About = withRoute(About);

//@@viewOn:exports
export { About };
export default About;
//@@viewOff:exports
