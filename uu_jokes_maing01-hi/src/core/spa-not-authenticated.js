//@@viewOn:imports
import UU5 from "uu5g04";
import "uu5g04-bricks";
import Plus4U5 from "uu_plus4u5g01";
import "uu_plus4u5g01-app";

import Config from "./config/config.js";
import Bottom from "./bottom.js";
import SpaUnauthorized from "./spa-unauthorized";
import "./spa-not-authenticated.less";
import LSI from "./spa-not-authenticated-lsi.js";
//@@viewOff:imports

const SpaNotAuthenticated = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "SpaNotAuthenticated",
    classNames: {
      main: Config.CSS + "spanotauthenticated"
    },
    lsi: LSI
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return (
      <Plus4U5.App.Page
        {...this.getMainPropsToPass()}
        top={<Plus4U5.App.Top content={this.getLsiComponent("appName")} />}
        bottom={<Bottom />}
        type={1}
        displayedLanguages={["cs", "en"]}
      >
        <SpaUnauthorized icon="uu5-alert-circle" showLogin />
      </Plus4U5.App.Page>
    );
  }
  //@@viewOff:render
});

export default SpaNotAuthenticated;
