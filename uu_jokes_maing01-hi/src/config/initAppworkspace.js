//@@viewOn:imports
import UU5 from "uu5g04";
import "uu5g04-bricks";
import "uu5g04-forms";
import {Session} from 'uu_appg01_oidc';
import Calls from "calls";

//@@viewOff:imports

export const InitAppWorkspace = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.PureRenderMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: "InitAppWorkspace",
    classNames: {
      main: "InitAppWorkspace"
    }
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
    return Calls.loadWorkspace(data).then(data => {
      return data;
    });
  },

  initWorkspace(dataIn) {
    Calls.initWorkspace(JSON.parse(dataIn)).then(() => window.location.replace(UU5.Common.Url.parse(window.location.href).set({useCase: ""}).toString()));
  },

  _getChild() {
    return (<UU5.Common.Loader onLoad={this._handleLoad}>
        {({isLoading, isError, data}) => {
          if (isError) {
            return <UU5.Bricks.Error content="error load workspace"/>
          } else if (isLoading) {
            return <UU5.Bricks.Loading/>
          } else {
            return (
              <UU5.Common.Session session={Session.currentSession}>
                <UU5.Common.Identity>
                  {({identity, login, logout, ...opt}) => {
                    if (data.awidLicenseOwnerList.includes(identity.uuIdentity)) {
                      return (<div style={{"text-align": "center"}}>
                        <h1>Aplication not initialized. You can initialize it now.</h1>
                        <UU5.Forms.Form>
                          <UU5.Forms.TextArea rows={10}
                                              ref_={ref => this.form = ref}
                                              value='{
            "uuAppProfileAuthorities": "urn:uu:GGALL",
            "name": "Jokes Test"
          }'/>
                          <UU5.Bricks.Button content="Initialize" colorSchema="blue" style="marginTop:8px"
                                             onClick={() => this.initWorkspace(this.form.getValue())}/>
                        </UU5.Forms.Form>
                      </div>)
                    } else {
                      return (<UU5.Bricks.Error content="Not authorized to initialize worksapce"/>);
                    }
                  }}
                </UU5.Common.Identity>
              </UU5.Common.Session>)
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
