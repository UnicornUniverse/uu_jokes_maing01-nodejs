//@@viewOn:imports
//@@viewOn:imports
import UU5 from "uu5g04";
import { createVisualComponent } from "uu5g04-hooks";
import { withRoute } from "uu_plus4u5g02-app";
import UuJokesCore from "uu_jokesg01-core";
import Config from "./config/config";
//@@viewOff:imports

const Categories = createVisualComponent({
  //@@viewOn:statics
  displayName: Config.TAG + "Categories",
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
          <UuJokesCore.Category.List cardView="none" elevation={0} style={{ padding: "40px 24px 0px 24px" }} />
        </UU5.Bricks.Container>
      </>
    );
    //@@viewOff:render
  },
});

export default Categories;

// ISSUE Visual Identification doesn't work when withRoute is used
// https://uuapp.plus4u.net/uu-sls-maing01/558dcc308da34b82bbe044d94074802f/issueDetail?id=616473e9a57edb002a90cd1b

//export default withRoute(Categories, { authenticated: true });
