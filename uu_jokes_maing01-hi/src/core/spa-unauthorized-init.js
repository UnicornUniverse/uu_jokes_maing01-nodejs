//@@viewOn:imports
import UU5 from "uu5g04";
import "uu5g04-bricks";
import { createVisualComponent } from "uu5g04-hooks";
import * as UuProductCatalogue from "uu_productcatalogueg01";

import Config from "./config/config.js";

import "./spa-unauthorized-init.less";
import Lsi from "./spa-unauthorized-init-lsi";
//@@viewOff:imports

const STATICS = {
  //@@viewOn:statics
  displayName: Config.TAG + "SpaUnauthorizedInit",
  //@@viewOff:statics
};

const CLASS_NAMES = {
  main: Config.CSS + "spaunauthorizedinit",
  errorIcon: Config.CSS + "spaunauthorizedinit" + "-error-icon",
  textError: Config.CSS + "spaunauthorizedinit" + "-text-error",
  textErrorBig: Config.CSS + "spaunauthorizedinit" + "-text-error" + "-big",
};

export const SpaUnauthorizedInit = createVisualComponent({
  ...STATICS,

  //@@viewOn:propTypes
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  //@@viewOff:defaultProps

  //@@viewOn:render
  render(props) {
    //@@viewOn:private
    //@@viewOff:private

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:render
    const attrs = UU5.Common.VisualComponent.getAttrs(props, CLASS_NAMES.main);
    return (
      <div {...attrs}>
        <UU5.Bricks.Icon className={CLASS_NAMES.errorIcon} icon="mdi-block-helper" />
        <UU5.Bricks.Text className={CLASS_NAMES.textErrorBig}>
          <UU5.Bricks.Lsi lsi={Lsi.notAuthorized} />
        </UU5.Bricks.Text>
        <UU5.Bricks.Text className={CLASS_NAMES.textError}>
          <UU5.Bricks.Lsi lsi={Lsi.buyYourOwn} />
        </UU5.Bricks.Text>
        <UuProductCatalogue.Bricks.ProductInfo
          baseUri="https://uuos9.plus4u.net/uu-webkit-maing02/99923616732505139-7c9a436a0eef4c2a810a680d8de65b65/"
          type="16x9"
        />
      </div>
    );
    //@@viewOff:render
  },
});

export default SpaUnauthorizedInit;
