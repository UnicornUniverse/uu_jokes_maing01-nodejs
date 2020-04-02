//@@viewOn:imports
import UU5 from "uu5g04";
import "uu5g04-bricks";
import "uu5g04-forms";
import "uu5codekitg01";
import Calls from "calls";
import { dig } from "../helpers/object-utils";
import Plus4U5 from "uu_plus4u5g01";
import UuContentKit from "uu_contentkitg01";
import LSI from "./spa-authenticated-lsi";
import SpaUnauthorized from "./spa-unauthorized";
import Config from "./config/config";

import "./init-app-workspace.less";
//@@viewOff:imports

const RELATIVE_URI_REGEXP = new RegExp(/^\/[^/]/);

export const InitAppWorkspace = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.PureRenderMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "InitAppWorkspace",
    classNames: {
      main: Config.CSS + "init-app-workspace",
      form: Config.CSS + "init-app-workspace-form",
      button: Config.CSS + "init-app-workspace-button"
    },
    lsi: LSI
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
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
  _handleLoad(data) {
    return Calls.loadIdentityProfiles(data).then(data => {
      return data;
    });
  },
  _initWorkspace() {
    Calls.initWorkspace(JSON.parse(this.form.getValue())).then(
      jokesInstance => {
        const ucIndex = window.location.href.indexOf("sys/appWorkspace/initUve");
        let redirectPath = window.location.href.slice(0, ucIndex);
        if (jokesInstance.uuBtLocationUri) {
          redirectPath = redirectPath + "controlPanel";
        } else {
          const originalUrl = new URLSearchParams(window.location.search).get("originalUrl");
          if (originalUrl && RELATIVE_URI_REGEXP.test(originalUrl)) {
            redirectPath = originalUrl;
          }
        }
        window.location.replace(redirectPath);
      },
      error => this.setState({ errorData: error.dtoOut })
    );
  },
  _storeFormRef(ref) {
    this.form = ref;
  },
  _getChild() {
    return (
      <UU5.Common.Loader onLoad={this._handleLoad}>
        {({ isLoading, isError, data }) => {
          if (isError) {
            return (
              <Plus4U5.App.SpaError
                {...this.getMainPropsToPass()}
                error={data.dtoOut}
                errorData={dig(data, "dtoOut", "uuAppErrorMap")}
                content={this.getLsiComponent("notAuthorized")}
              />
            );
          } else if (isLoading) {
            return <UU5.Bricks.Loading />;
          } else {
            if (Array.isArray(data.identityProfileList) && data.identityProfileList.includes("AwidLicenseOwner")) {
              return (
                <div>
                  <div className={this.getClassName("form")}>
                    <UuContentKit.Bricks.BlockDefault icon="mdi-help-circle">
                      <UU5.Bricks.Span>{this.getLsiComponent("appNotInitialized")}</UU5.Bricks.Span>
                    </UuContentKit.Bricks.BlockDefault>
                    <UU5.Forms.Form>
                      <UU5.CodeKit.JsonEditor
                        rows={10}
                        ref_={this._storeFormRef}
                        value={
                          "{" +
                          '\n  "name": "Jokes Test",' +
                          '\n  "uuAppProfileAuthorities": "urn:uu:GGALL",' +
                          '\n  "uuBtLocationUri": "https://uuappg01-eu-w-1.plus4u.net/uu-businessterritory-maing01/f69130799e8649ffa07eb81aae84bec5?id=5e7df2b47c0b32001c0b4bb4"' +
                          "\n}"
                        }
                      />
                      <UU5.Bricks.Button
                        className={this.getClassName("button")}
                        colorSchema="blue"
                        content="Initialize"
                        onClick={this._initWorkspace}
                      />
                    </UU5.Forms.Form>
                  </div>
                  {this.state.errorData && <UU5.Common.Error errorData={this.state.errorData} />}
                </div>
              );
            } else {
              return (
                <SpaUnauthorized
                  {...this.getMainPropsToPass()}
                  error={data.dtoOut}
                  errorData={dig(data, "dtoOut", "uuAppErrorMap")}
                  content={this.getLsiComponent("notAuthorizedForInit")}
                  icon="uu5-alert-circle"
                />
              );
            }
          }
        }}
      </UU5.Common.Loader>
    );
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return this._getChild();
  }
  //@@viewOff:render
});

export default InitAppWorkspace;
