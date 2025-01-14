//@@viewOn:imports
import UU5 from "uu5g04";
import { createVisualComponent, Lsi, useLsi, Environment, Content } from "uu5g05";
import { HighlightedBox } from "uu5g05-elements";
import { Form, FormText, SubmitButton } from "uu5g05-forms";
import { useSubAppData } from "uu_plus4u5g02";
import { RouteContainer, useAlertBus } from "uu_plus4u5g02-elements";
import { withRoute } from "uu_plus4u5g02-app";
import UuJokesCore from "uu_jokesg01-core";
import Config from "./config/config.js";
import importLsi from "../lsi/import-lsi.js";
//@@viewOff:imports

const RELATIVE_URI_REGEXP = new RegExp(/^\/[^/]/);

const InternalComponent = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "InitAppWorkspace",
  //@@viewOff:statics

  //@@viewOn:propTypes
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  //@@viewOff:defaultProps

  render() {
    //@@viewOn:private
    const jokesDataObject = useSubAppData();
    const jokesPermission = UuJokesCore.Workspace.usePermission();
    const lsi = useLsi(importLsi, [InternalComponent.uu5Tag]);
    const { showError } = useAlertBus(importLsi, ["Errors"]);

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
        InternalComponent.logger.error(error);
        showError(error);
      }
    }
    //@@viewOff:private

    //@@viewOn:render
    const canInit = jokesPermission.workspace.canInit();
    const formInputCss = Config.Css.css`margin-bottom:16px`;

    return (
      <RouteContainer header={lsi.formHeader} info={<Content>{lsi.formHeaderInfo}</Content>}>
        {!canInit && (
          <HighlightedBox>
            <Lsi lsi={lsi.notAuthorizedForInit} />
          </HighlightedBox>
        )}
        {canInit && (
          <Form onSubmit={handleSubmit}>
            <FormText
              name="uuBtLocationUri"
              label={lsi.uuBtLocationUriLabel}
              info={lsi.uuBtLocationUriInfo}
              required
              className={formInputCss}
            />
            <FormText name="name" label={lsi.nameLabel} required className={formInputCss} />
            <div className={Config.Css.css({ display: "flex", gap: 8, justifyContent: "flex-end" })}>
              <SubmitButton>{lsi.initialize}</SubmitButton>
            </div>
          </Form>
        )}
      </RouteContainer>
    );
  },
  //@@viewOff:render
});

const InitAppWorkspace = withRoute(InternalComponent, { authenticated: true });

export { InitAppWorkspace };
export default InitAppWorkspace;
