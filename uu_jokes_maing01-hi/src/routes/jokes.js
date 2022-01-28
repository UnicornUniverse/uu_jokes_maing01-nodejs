//@@viewOn:imports
import { createVisualComponent } from "uu5g05";
import UuJokesCore from "uu_jokesg01-core";
import { RouteController } from "uu_plus4u5g02-app";
import RouteContainer from "../core/route-container";
import Config from "./config/config";
//@@viewOff:imports

const Jokes = createVisualComponent({
  //@@viewOn:statics
  displayName: Config.TAG + "Jokes",
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
      <RouteController>
        <RouteContainer>
          <UuJokesCore.Joke.List card="none" />
        </RouteContainer>
      </RouteController>
    );
    //@@viewOff:render
  },
});

export default Jokes;
