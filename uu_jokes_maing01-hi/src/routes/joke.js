//@@viewOn:imports
import { Utils, createVisualComponent } from "uu5g05";
import { Breadcrumbs } from "uu5g05-elements";
import { withRoute } from "uu_plus4u5g02-app";
import UuJokesCore from "uu_jokesg01-core";
import Config from "./config/config";
import RouteName from "../core/route-name";
import Route from "../utils/route";
//@@viewOff:imports

const InternalJoke = createVisualComponent({
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
    //@@viewOn:private
    const { elementProps } = Utils.VisualComponent.splitProps(props);

    const subtitle = (
      <Breadcrumbs
        itemList={[
          { children: <RouteName code={Route.JOKES} />, href: Route.JOKES, collapsed: false },
          { children: <RouteName code={Route.JOKE} />, collapsed: false },
        ]}
      />
    );
    //@@viewOff:private

    //@@viewOn:render
    return <UuJokesCore.Joke.Detail {...elementProps} subtitle={subtitle} nestingLevel="route" />;
    //@@viewOff:render
  },
});

const Joke = withRoute(InternalJoke, { authenticated: true });

//@@viewOn:exports
export { Joke };
export default Joke;
//@@viewOff:exports
