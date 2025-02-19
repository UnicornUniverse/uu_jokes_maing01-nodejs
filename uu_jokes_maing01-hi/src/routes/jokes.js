//@@viewOn:imports
import { Utils, createVisualComponent } from "uu5g05";
import { withRoute } from "uu_plus4u5g02-app";
import UuJokesCore from "uu_jokesg01-core";
import Config from "./config/config";
//@@viewOff:imports

let Jokes = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "Jokes",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    //@@viewOff:private

    //@@viewOn:render
    const { elementProps } = Utils.VisualComponent.splitProps(props);
    return <UuJokesCore.Joke.List {...elementProps} nestingLevel="route" uu5Id="6b4167380d815474a851e48482d4ecda" />;
    //@@viewOff:render
  },
});

Jokes = withRoute(Jokes, { authenticated: true });

//@@viewOn:exports
export { Jokes };
export default Jokes;
//@@viewOff:exports
