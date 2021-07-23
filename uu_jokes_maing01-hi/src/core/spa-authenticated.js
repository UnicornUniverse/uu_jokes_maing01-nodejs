//@@viewOn:imports
import { createVisualComponent } from "uu5g04-hooks";
import Plus4U5 from "uu_plus4u5g01";
import UuJokesCore from "uu_jokesg01-core";
import "uu_plus4u5g01-app";

import Config from "./config/config.js";
import SpaReady from "./spa-ready.js";
//@@viewOff:imports

const STATICS = {
  //@@viewOn:statics
  displayName: Config.TAG + "Spa",
  //@@viewOff:statics
};

export const SpaAuthenticated = createVisualComponent({
  ...STATICS,

  //@@viewOn:propTypes
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  //@@viewOff:defaultProps

  render() {
    //@@viewOn:private
    //@@viewOff:private

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:render
    return (
      <UuJokesCore.Jokes.JokesProvider>
        {({jokesDataObject}) => {
          switch (jokesDataObject.state) {
            case "pendingNoData":
              return <Plus4U5.App.SpaLoading>uuJokes</Plus4U5.App.SpaLoading>;
            case "errorNoData":
              return <Plus4U5.App.SpaError errorData={jokesDataObject.errorData} />;
            default:
              return <SpaReady jokesDataObject={jokesDataObject} />;
          }
        }}
      </UuJokesCore.Jokes.JokesProvider>
    );
    //@@viewOff:render
  },
});

export default SpaAuthenticated;
