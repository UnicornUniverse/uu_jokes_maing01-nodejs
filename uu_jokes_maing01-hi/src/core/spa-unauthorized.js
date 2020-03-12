//@@viewOn:imports
import UU5 from "uu5g04";
import "uu5g04-bricks";
import Plus4U5 from "uu_plus4u5g01";
import "uu_plus4u5g01-app";

import Config from "./config/config.js";

import "./spa-unauthorized.less";
import LSI from "./spa-unauthorized-lsi.js";
//@@viewOff:imports

const SpaUnauthorized = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.ContentMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "SpaUnauthorized",
    classNames: {
      main: Config.CSS + "spaunauthorized",
      error: Config.CSS + "spaunauthorized" + "-error",
      bgFilled: Config.CSS + "spaunauthorized" + "-bg-style-filled",
      errorIcon: Config.CSS + "spaunauthorized" + "-error-icon",
      textError: Config.CSS + "spaunauthorized" + "-text-error",
      buttonError: Config.CSS + "spaunauthorized" + "-button-error",
      errorTextWrapper: Config.CSS + "spaunauthorized" + "-remark-text-wrapper"
    },
    lsi: LSI
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      errorData: undefined,
      error: undefined,
      bgStyle: "filled",
      icon: "mdi-close-network",
      showLogin: false
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _getMainPropsToPass() {
    let mainProps = this.getMainPropsToPass();
    mainProps.className += " " + this.getClassName("bgFilled");
    return mainProps;
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return (
      <UU5.Common.Identity>
        {({ login }) => {
          let buttonLogin = null;
          if (this.props.showLogin) {
            buttonLogin = (
              <UU5.Bricks.Button
                onClick={login}
                size="xl"
                bgStyle="outline"
                colorSchema={"white"}
                className={this.getClassName("buttonError")}
              >
                {this.getLsiComponent("login")}
              </UU5.Bricks.Button>
            );
          }
          return (
            <UU5.Bricks.Div {...this._getMainPropsToPass()} content={null}>
              <div className={this.getClassName("errorTextWrapper")}>
                <UU5.Bricks.Icon className={this.getClassName("errorIcon")} icon={this.props.icon} />
                <UU5.Bricks.Text colorSchema={"white"} className={this.getClassName("textError")}>
                  {this.getChildren() || this.getLsiComponent("notAuthorized")}
                </UU5.Bricks.Text>
                {buttonLogin}
              </div>
              <Plus4U5.Bricks.Error
                id={this.getId() + "-error"}
                className={this.getClassName("error")}
                content={this.props.content || this.props.children}
                errorData={this.props.errorData}
                error={this.props.error}
              />
            </UU5.Bricks.Div>
          );
        }}
      </UU5.Common.Identity>
    );
  }
  //@@viewOff:render
});

export default SpaUnauthorized;
