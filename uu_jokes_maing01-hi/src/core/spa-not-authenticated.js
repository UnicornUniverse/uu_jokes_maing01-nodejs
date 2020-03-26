//@@viewOn:imports
import UU5 from "uu5g04";
import "uu5g04-bricks";
import Plus4U5 from "uu_plus4u5g01";
import "uu_plus4u5g01-app";

import Config from "./config/config.js";
import Left from "./left.js";
import Bottom from "./bottom.js";
import About from "../routes/about.js";
import Login from "../routes/not-authenticated.js";

import "./spa-not-authenticated.less";
import LSI from "./spa-not-authenticated-lsi.js";
import SpaUnauthorized from "./spa-unauthorized";
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
        left={<Left />}
        leftWidth="!xs-320px !s-320px !m-256px l-256px xl-256px"
      >
        <UU5.Common.Router
          route=""
          notFoundRoute="login"
          routes={{
            login: { component: <Login /> },
            "": "login",
            about: { component: <About /> },
            "sys/appWorkspace/initUve": { component: <SpaUnauthorized icon="uu5-alert-circle" showLogin /> }
          }}
        />
      </Plus4U5.App.Page>
    );
  }
  //@@viewOff:render
});

export default SpaNotAuthenticated;
