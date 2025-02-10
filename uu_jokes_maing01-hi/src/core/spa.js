//@@viewOn:imports
import { createVisualComponent, Utils } from "uu5g05";
import Uu5Elements from "uu5g05-elements";
import UuJokesCore from "uu_jokesg01-core";
import Plus4U5, { RouteDataProvider } from "uu_plus4u5g02";
import Plus4U5App from "uu_plus4u5g02-app";
import Config from "./config/config.js";

const About = Utils.Component.lazy(() => import("../routes/about.js"));
const InitAppWorkspace = Utils.Component.lazy(() => import("../routes/init-app-workspace.js"));
const ControlPanel = Utils.Component.lazy(() => import("../routes/control-panel.js"));
const Jokes = Utils.Component.lazy(() => import("../routes/jokes.js"));
const Joke = Utils.Component.lazy(() => import("../routes/joke.js"));
const Categories = Utils.Component.lazy(() => import("../routes/categories.js"));
//@@viewOff:imports

//@@viewOn:constants
const ROUTE_MAP = {
  "": { redirect: "jokes" },
  about: (props) => <About {...props} />,
  "sys/uuAppWorkspace/initUve": (props) => <InitAppWorkspace {...props} />,
  controlPanel: (props) => <ControlPanel {...props} />,
  jokes: (props) => <Jokes {...props} />,
  joke: (props) => <Joke {...props} />,
  categories: (props) => <Categories {...props} />,
  "*": () => (
    <Uu5Elements.Text category="story" segment="heading" type="h1">
      Not Found
    </Uu5Elements.Text>
  ),
};
//@@viewOff:constants

const Spa = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "Spa",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render() {
    //@@viewOn:private
    //@@viewOff:private

    //@@viewOn:render
    return (
      <Plus4U5.SpaProvider initialLanguageList={["en", "cs"]} skipAppWorkspaceProvider>
        <UuJokesCore.Workspace.Provider>
          <UuJokesCore.Workspace.PermissionProvider>
            <RouteDataProvider>
              <Plus4U5App.Spa routeMap={ROUTE_MAP} />
            </RouteDataProvider>
          </UuJokesCore.Workspace.PermissionProvider>
        </UuJokesCore.Workspace.Provider>
      </Plus4U5.SpaProvider>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { Spa };
export default Spa;
//@@viewOff:exports
