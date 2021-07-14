//@@viewOn:imports
import { createVisualComponent } from "uu5g04-hooks";
import { useSubApp } from "uu_plus4u5g01-context";
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

  render(props) {
    //@@viewOn:private
    const { baseUri } = useSubApp();
    //@@viewOff:private

    //@@viewOn:interface
    //@@viewOff:interface

    // TODO Remove baseUri after refactorining in uuJokesg01
    //@@viewOn:render
    return (
      <UuJokesCore.Jokes.JokesProvider baseUri={baseUri}>
        {(jokesDataObject) => (
          <UuJokesCore.Jokes.JokesPermissionProvider profileList={jokesDataObject.data?.authorizedProfileList}>
            <SpaReady />
          </UuJokesCore.Jokes.JokesPermissionProvider>
        )}
      </UuJokesCore.Jokes.JokesProvider>
    );
    //@@viewOff:render
  },
});

export default SpaAuthenticated;
