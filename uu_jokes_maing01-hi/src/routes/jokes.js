//@@viewOn:imports
import UU5 from "uu5g04";
import { createVisualComponent } from "uu5g04-hooks";
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
    const { jokesDataObject } = UuJokesCore.Jokes.useJokes();
    const jokesPermission = UuJokesCore.Jokes.useJokesPermission();
    //@@viewOff:private

    //@@viewOn:render
    return (
      <UuJokesCore.Joke.JokeListProvider>
        {({ jokeDataList }) => (
          <UU5.Bricks.Container noSpacing>
            <UuJokesCore.Joke.JokeListView
              jokesDataObject={jokesDataObject}
              jokeDataList={jokeDataList}
              jokesPermission={jokesPermission}
              cardView="none"
              elevation={0}
              style={{ padding: "0px 24px 0px 24px" }}
            />
          </UU5.Bricks.Container>
        )}
      </UuJokesCore.Joke.JokeListProvider>
    );
    //@@viewOff:render
  },
});

export default Jokes;
