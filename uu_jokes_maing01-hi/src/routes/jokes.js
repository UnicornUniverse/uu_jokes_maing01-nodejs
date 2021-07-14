//@@viewOn:imports
import UU5 from "uu5g04";
import { createVisualComponent } from "uu5g04-hooks";
import { useSubApp } from "uu_plus4u5g01-context";
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
    const { baseUri } = useSubApp();
    //@@viewOff:private

    //@@viewOn:render
    return (
      <UuJokesCore.Jokes.JokesProvider baseUri={baseUri}>
        {(jokesDataObject) => (
          <UuJokesCore.Jokes.JokesPermissionProvider profileList={jokesDataObject.data?.authorizedProfileList}>
            {(jokesPermission) => (
              <UuJokesCore.Joke.JokeListProvider baseUri={baseUri}>
                {(jokeDataList) => (
                  <UU5.Bricks.Container noSpacing>
                    <UuJokesCore.Joke.JokeListView
                      jokesDataObject={jokesDataObject}
                      jokeDataList={jokeDataList}
                      jokesPermission={jokesPermission}
                      baseUri={baseUri}
                      cardView="none"
                      elevation={0}
                      style={{ padding: "0px 24px 0px 24px" }}
                    />
                  </UU5.Bricks.Container>
                )}
              </UuJokesCore.Joke.JokeListProvider>
            )}
          </UuJokesCore.Jokes.JokesPermissionProvider>
        )}
      </UuJokesCore.Jokes.JokesProvider>
    );
    //@@viewOff:render
  },
});

export default Jokes;
