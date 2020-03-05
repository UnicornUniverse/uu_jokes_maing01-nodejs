//@@viewOn:imports
import UU5 from "uu5g04";
import "uu5g04-bricks";
import "uu5g04-forms";
import "uu5codekitg01";
import Calls from "calls";
import { dig } from "../helpers/object-utils";
import Plus4U5 from "uu_plus4u5g01";
import LSI from "./spa-authenticated-lsi";

//@@viewOff:imports

const RELATIVE_URI_REGEXP = new RegExp(/^\/[^/]/);

export const InitAppWorkspace = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.PureRenderMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: "InitAppWorkspace",
    classNames: {
      main: "InitAppWorkspace"
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

  initWorkspace(dataIn) {
    Calls.initWorkspace(JSON.parse(dataIn)).then(
      () => {
        let newPath = new URLSearchParams(window.location.search).get("originalUrl");
        if (!newPath || !RELATIVE_URI_REGEXP.test(newPath)) {
          const ucIndex = window.location.href.indexOf("sys/appWorkspace/initUve");
          newPath = window.location.href.slice(0, ucIndex);
        }
        window.location.replace(newPath);
      },
      error => this.setState({errorData: error.dtoOut})
    );
  },

  _getChild() {
    return (
      <UU5.Common.Loader onLoad={this._handleLoad}>
        {({isLoading, isError, data}) => {
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
            return <UU5.Bricks.Loading/>
          } else {
            if (Array.isArray(data.identityProfileList) && data.identityProfileList.includes("AwidLicenseOwner")) {
              return (
                <div>
                  <div style={{"textAlign": "center"}}>
                    <h1>Application is not initialized. You can initialize it now.</h1>
                    <UU5.Forms.Form>
                      <UU5.CodeKit.JsonEditor
                        rows={10}
                        ref_={ref => this.form = ref}
                        value='{
                          "uuAppProfileAuthorities": "urn:uu:GGALL",
                          "name": "Jokes Test"
                        }'/>
                      <UU5.Bricks.Button content="Initialize" colorSchema="blue" style="marginTop:8px"
                                         onClick={() => this.initWorkspace(this.form.getValue())}/>
                    </UU5.Forms.Form>
                  </div>
                  {(this.state.errorData) && <UU5.Common.Error errorData={this.state.errorData} />}
                </div>
              )
            } else {
              return (
                <Plus4U5.App.SpaError
                  {...this.getMainPropsToPass()}
                  error={data.dtoOut}
                  errorData={dig(data, "dtoOut", "uuAppErrorMap")}
                  content={this.getLsiComponent("notAuthorized")}
                />
              );
            }
          }
        }}
      </UU5.Common.Loader>
    )
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return (
      this._getChild()
    );
  }
  //@@viewOff:render
});

export default InitAppWorkspace;
