//@@viewOn:imports
import UU5 from "uu5g04";
import { createVisualComponent, Lsi, useLsiValues, useSession, useRef } from "uu5g05";
import { Block, HighlightedBox } from "uu5g05-elements";
import { Form, FormText, SubmitButton } from "uu5g05-forms";
import { useSubAppData } from "uu_plus4u5g02";
import { RouteController } from "uu_plus4u5g02-app";
import { Core, Jokes } from "uu_jokesg01-core";
import "uu5g04-bricks";
import "uu5g05-forms";
import Config from "./config/config.js";
import RouteContainer from "../core/route-container.js";
import LsiData from "./init-app-workspace-lsi.js";
//@@viewOff:imports

const RELATIVE_URI_REGEXP = new RegExp(/^\/[^/]/);

const STATICS = {
  //@@viewOn:statics
  displayName: Config.TAG + "InitAppWorkspace",
  //@@viewOff:statics
};

export const InitAppWorkspace = createVisualComponent({
  ...STATICS,

  //@@viewOn:propTypes
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const jokesDataObject = useSubAppData();
    const jokesPermission = Jokes.usePermission();
    const formLsi = useLsiValues(LsiData);
    const alertBusRef = useRef();

    async function handleSubmit(event) {
      try {
        let originalUrl = new URLSearchParams(window.location.search).get("originalUrl");
        await jokesDataObject.handlerMap.init(event.data.value);

        let redirectPath;

        if (originalUrl) {
          if (RELATIVE_URI_REGEXP.test(originalUrl)) {
            redirectPath = originalUrl;
          } else {
            redirectPath = UU5.Environment.appBaseUri();
          }
        } else {
          redirectPath = Environment.appBaseUri() + "/controlPanel";
        }

        window.location.replace(redirectPath);
      } catch (error) {
        console.error(error);
        alertBusRef.current.addAlert({
          content: <Core.Error errorData={error} />,
          colorSchema: "danger",
        });
      }
    }
    //@@viewOff:private

    //@@viewOn:render
    const canInit = jokesPermission.jokes.canInit();
    const formInputCss = Config.Css.css`margin-bottom:16px`;
    const blockCss = Config.Css.css`max-width: 600px;margin: auto`;

    return (
      <RouteController>
        <UU5.Bricks.AlertBus ref_={alertBusRef} location="portal" />
        <RouteContainer>
          {!canInit && (
            <HighlightedBox>
              <Lsi lsi={LsiData.notAuthorizedForInit} />
            </HighlightedBox>
          )}
          {canInit && (
            <Block
              header={<Lsi lsi={LsiData.header} />}
              headerType="title"
              info={<Lsi lsi={LsiData.info} />}
              collapsible={false}
              className={blockCss}
            >
              <Form onSubmit={handleSubmit}>
                <FormText
                  name="uuBtLocationUri"
                  label={formLsi.uuBtLocationUri}
                  info={formLsi.uuBtLocationUriInfo}
                  required
                  className={formInputCss}
                />
                <FormText name="name" label={formLsi.name} required className={formInputCss} />
                <div className={Config.Css.css({ display: "flex", gap: 8, justifyContent: "flex-end" })}>
                  <SubmitButton>
                    <Lsi lsi={LsiData.initialize} />
                  </SubmitButton>
                </div>
              </Form>
            </Block>
          )}
        </RouteContainer>
      </RouteController>
    );
  },
  //@@viewOff:render
});

export default InitAppWorkspace;
