//@@viewOn:imports
//@@viewOn:imports
import UU5 from "uu5g04";
import { createVisualComponent } from "uu5g04-hooks";
import { withRoute } from "uu_plus4u5g02-app";
import UuJokesCore from "uu_jokesg01-core";
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
      <>
        <UU5.Bricks.Container noSpacing>
          <UuJokesCore.Joke.List cardView="none" elevation={0} style={{ padding: "40px 24px 0px 24px" }} />
        </UU5.Bricks.Container>
      </>
    );
    //@@viewOff:render
  },
});

export default withRoute(Jokes);
