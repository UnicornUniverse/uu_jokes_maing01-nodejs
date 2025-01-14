//@@viewOn:imports
import { Utils, createVisualComponent } from "uu5g05";
import { withRoute } from "uu_plus4u5g02-app";
import UuJokesCore from "uu_jokesg01-core";
import Config from "./config/config";
//@@viewOff:imports

let Joke = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "Joke",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:render
    const { elementProps } = Utils.VisualComponent.splitProps(props);
    return <UuJokesCore.Joke.Detail {...elementProps} nestingLevel="route" />;
    //@@viewOff:render
  },
});

Joke = withRoute(Joke, { authenticated: true });

//@@viewOn:exports
export { Joke };
export default Joke;
//@@viewOff:exports
