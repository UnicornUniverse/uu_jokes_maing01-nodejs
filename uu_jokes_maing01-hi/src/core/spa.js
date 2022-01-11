//@@viewOn:imports
import { createVisualComponent } from "uu5g04-hooks";
import Plus4U5 from "uu_plus4u5g02";
import { Jokes } from "uu_jokesg01-core";
import Config from "./config/config.js";
import SpaView from "./spa-view";
//@@viewOff:imports

const STATICS = {
  //@@viewOn:statics
  displayName: Config.TAG + "Spa",
  //@@viewOff:statics
};

export const Spa = createVisualComponent({
  ...STATICS,

  render() {
    //@@viewOn:render
    return (
      <Plus4U5.SpaProvider initialLanguageList={["en", "cs"]} skipAppWorkspaceProvider>
        <Jokes.Provider>
          <Jokes.PermissionProvider>
            <Plus4U5.RouteDataProvider>
              <SpaView />
            </Plus4U5.RouteDataProvider>
          </Jokes.PermissionProvider>
        </Jokes.Provider>
      </Plus4U5.SpaProvider>
    );
    //@@viewOff:render
  },
});

export default Spa;
