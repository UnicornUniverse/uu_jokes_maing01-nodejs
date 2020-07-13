//@@viewOn:imports
import UU5 from "uu5g04";
import "uu5g04-bricks";
import "uu5g04-forms";
import "uu5codekitg01";
import Calls from "calls";
import { dig } from "../helpers/object-utils";
import Plus4U5 from "uu_plus4u5g01";
import UuContentKit from "uu_contentkitg01";
import LSI from "./init-app-workspace-lsi";
import SpaUnauthorizedInit from "./spa-unauthorized-init";
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
      formControls: Config.CSS + "init-app-workspace-form-controls",
      textBlock: Config.CSS + "init-app-workspace-textblock"
    },
    lsi: LSI,
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState() {
    return {
      initType: "bt",
      form: {
      }
    }
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _handleLoad(dtoIn) {
    return Calls.loadIdentityProfiles(dtoIn);
  },

  _initWorkspace(opt) {
    Calls.initWorkspace(opt.values).then(
      this._form.saveDone,
      this._form.saveFail,
    );
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
                    <UuContentKit.Bricks.BlockDefault className={this.getClassName("textBlock")} icon="mdi-information">
                      <UU5.Bricks.Span>{this.getLsiComponent("appNotInitialized")}</UU5.Bricks.Span>
                    </UuContentKit.Bricks.BlockDefault>
                    <UU5.Forms.Form
                      labelColWidth="m-12"
                      inputColWidth="m-12"
                      ref={(ref) => {
                        this._form = ref;
                      }}
                      onSave={this._initWorkspace}
                      onSaveFail={
                        (opt) => {
                          opt.component.getAlertBus().setAlert({
                            content: "Saving was failed.",
                            colorSchema: "danger"
                          });
                          this.setState({ errorData: opt.dtoOut.dtoOut })
                        }
                      }
                      onSaveDone={
                          (opt) => {
                            const { component, dtoOut: jokesInstance} = opt;

                            const ucIndex = window.location.href.indexOf("sys/uuAppWorkspace/initUve");
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
                          }
                      }
                      className={this.getClassName("form")}
                    >
                      <UU5.Forms.SwitchSelector
                        label={this.getLsiComponent("labelAuthorizationStrategy")}
                        items={[
                          {
                            content: "uuBusinessTerritory",
                            value: "bt"
                          },
                          {
                            content: "uuRoleGroupInterface",
                            value: "profiles"
                          }
                        ]}
                        value={
                          this.state.initType
                        }

                        onChange={ (opt) => {
                          const { logo, state, name, uuAppProfileAuthorities, uuBtLocationUri} = this._form.getValues();
                          this.setState({
                            initType: opt.value,
                            form: {
                              logo,
                              state,
                              name,
                              uuAppProfileAuthorities: uuAppProfileAuthorities || this.state.form.uuAppProfileAuthorities,
                              uuBtLocationUri: uuBtLocationUri || this.state.form.uuBtLocationUri
                            }
                          });
                        }}
                      />
                      {(
                         this.state.initType === "bt"
                           ? <UU5.Forms.Text required name="uuBtLocationUri" label="uuBtLocationUri" value={ this.state.form.uuBtLocationUri || ""} />
                           : <UU5.Forms.Text required name="uuAppProfileAuthorities" label="uuAppProfileAuthorities" value={ this.state.form.uuAppProfileAuthorities || ""}/>
                      )
                      }
                      <UU5.Forms.Text name="name" label={this.getLsiComponent("labelName")} value={ this.state.form.name || "uuJokes"}/>
                      <UU5.Forms.SwitchSelector
                        name="state"
                        label={this.getLsiComponent("labelSysState")}
                        value={this.state.form.state || "active"}
                        items={[
                          {
                            content: this.getLsiComponent("activeSysState"),
                            value: "active"
                          },
                          {
                            content: this.getLsiComponent("underConstructionSysState"),
                            value: "underConstruction"
                          }
                        ]}
                      />
                      <UU5.Forms.File
                        name="logo"
                        label={this.getLsiComponent("labelLogo")}
                        placeholder="Upload file"
                      />
                      <UU5.Bricks.Row display="flex">
                        <UU5.Bricks.Column colWidth="m-12" className={this.getClassName("formControls")}
                        >
                        <UU5.Bricks.Button
                          className={this.getClassName("formControls")}
                          colorSchema="blue"
                          content={this.getLsiComponent("initializeButton")}
                          onClick={() => this._form.save()}
                        />
                      </UU5.Bricks.Column>
                      </UU5.Bricks.Row>


                    </UU5.Forms.Form>
                    {this.state.errorData && <UU5.Common.Error moreInfo={true} errorData={this.state.errorData} />}
                </div>
              );
            } else {
              return <SpaUnauthorizedInit {...this.getMainPropsToPass()} />;
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
  },
  //@@viewOff:render
});

export default InitAppWorkspace;
