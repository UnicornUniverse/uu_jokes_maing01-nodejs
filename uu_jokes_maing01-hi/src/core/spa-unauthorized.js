//@@viewOn:imports
import UU5 from "uu5g04";
import "uu5g04-bricks";
import { createVisualComponent } from "uu5g04-hooks";

import Config from "./config/config.js";

import "./spa-unauthorized.less";
import Lsi from "./spa-unauthorized-lsi";
//@@viewOff:imports

const STATICS = {
  //@@viewOn:statics
  displayName: Config.TAG + "SpaUnauthorized",
  //@@viewOff:statics
};

const CLASS_NAMES = {
  main: Config.CSS + "spaunauthorized",
  errorIcon: Config.CSS + "spaunauthorized" + "-error-icon",
  textError: Config.CSS + "spaunauthorized" + "-text-error",
};

export const SpaUnauthorized = createVisualComponent({
  ...STATICS,

  //@@viewOn:propTypes
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  //@@viewOff:defaultProps

  //@@viewOn:render
  render(props) {
    //@@viewOn:private
    let { children } = props;
    //@@viewOff:private

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:render
    const attrs = UU5.Common.VisualComponent.getAttrs(props, CLASS_NAMES.main);
    return (
      <div {...attrs}>
        <UU5.Bricks.Icon className={CLASS_NAMES.errorIcon} icon="mdi-block-helper" />
        <UU5.Bricks.Text className={CLASS_NAMES.textError}>
          {UU5.Utils.Content.getChildren(children, props, STATICS) || <UU5.Bricks.Lsi lsi={Lsi.unauth.notAuthorized} />}
        </UU5.Bricks.Text>
        <UU5.Bricks.Button
          colorSchema="primary"
          href="https://uuos9.plus4u.net/uu-webkit-maing02/99923616732505139-7c9a436a0eef4c2a810a680d8de65b65/en/"
        >
          <UU5.Bricks.Lsi lsi={Lsi.unauth.continueToMain} />
        </UU5.Bricks.Button>
      </div>
    );
    //@@viewOff:render
  },
});

export default SpaUnauthorized;
