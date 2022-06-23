//@@viewOn:imports
import { createVisualComponent } from "uu5g05";
import { useSystemData } from "uu_plus4u5g02";
import { RouteController } from "uu_plus4u5g02-app";
import { PageProvider, View } from "../bricks/about/about";
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
    const { data: systemData } = useSystemData();
    //@@viewOff:private

    //@@viewOn:render
    return (
      <PageProvider baseUri={systemData.relatedObjectsMap.uuAppWebKitUri}>
        {(aboutDataObject) => (
          <RouteController routeDataObject={aboutDataObject}>
            <View aboutPage={aboutDataObject.data} />
          </RouteController>
        )}
      </PageProvider>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { About };
export default About;
//@@viewOff:exports
