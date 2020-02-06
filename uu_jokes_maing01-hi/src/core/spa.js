//@@viewOn:imports
import UU5 from "uu5g04";
import "uu5g04-bricks";
import Plus4U5 from "uu_plus4u5g01";
import "uu_plus4u5g01-bricks";
import "uu_plus4u5g01-app";

import { Session } from "uu_oidcg01";
import Config from "./config/config.js";
import SpaAuthenticated from "./spa-authenticated.js";
import SpaNotAuthenticated from "./spa-not-authenticated.js";

import "./spa.less";
//@@viewOff:imports

const Spa = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "Spa",
    classNames: {
      main: Config.CSS + "spa"
    }
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
      <UU5.Common.Session session={Session.currentSession}>
        <UU5.Common.Identity>
          {({ identity }) => {
            let child;
            if (identity) {
              child = <SpaAuthenticated {...this.getMainPropsToPass()} customComp={this.props.customComp} />;
            } else if (identity === null) {
              child = <SpaNotAuthenticated {...this.getMainPropsToPass()} />;
            } else {
              child = <Plus4U5.App.SpaLoading {...this.getMainPropsToPass()}>uuJokes</Plus4U5.App.SpaLoading>;
            }
            return child;
          }}
        </UU5.Common.Identity>
      </UU5.Common.Session>
    );
  }
  //@@viewOff:render
});

export default Spa;
