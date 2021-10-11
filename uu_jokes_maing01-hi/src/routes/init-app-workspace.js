//@@viewOn:imports
import UU5 from "uu5g04";
import { createVisualComponent, useCallback, useLsiValues, useSession } from "uu5g04-hooks";
import { useSystemData } from "uu_plus4u5g02";
import { withRoute } from "uu_plus4u5g02-app";
import { Core } from "uu_jokesg01-core";

import "uu5g04-forms";
import Calls from "calls";
import Config from "./config/config.js";
import SpaUnauthorizedInit from "../core/spa-unauthorized-init.js";
import Lsi from "./init-app-workspace-lsi.js";
//@@viewOff:imports

const RELATIVE_URI_REGEXP = new RegExp(/^\/[^/]/);

const STATICS = {
  //@@viewOn:statics
  displayName: Config.TAG + "InitAppWorkspace",
  //@@viewOff:statics
};

const CLASS_NAMES = {
  main: () => Config.Css.css`
    max-width: 512px;
    margin: auto;
    padding: 10px;
  `,
  cancelButton: () => Config.Css.css`
    display: none;
  `,
};

export const InitAppWorkspace = createVisualComponent({
  ...STATICS,

  //@@viewOn:propTypes
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const { data: system } = useSystemData();
    const { identity } = useSession();
    const routeLsi = useLsiValues(Lsi);

    let handleSave = useCallback(async ({ component, values }) => {
      try {
        let originalUrl = new URLSearchParams(window.location.search).get("originalUrl");
        // TODO Add operation init to JokesProvider
        await Calls.initWorkspace(values);
        component.saveDone();

        let redirectPath;

        if (originalUrl) {
          if (RELATIVE_URI_REGEXP.test(originalUrl)) {
            redirectPath = originalUrl;
          } else {
            redirectPath = UU5.Environment.getAppBasePath();
          }
        } else {
          redirectPath = UU5.Environment.getAppBasePath() + "controlPanel";
        }

        window.location.replace(redirectPath);
      } catch (error) {
        console.error(error);
        component.saveFail();
        component.getAlertBus().addAlert({
          content: <Core.Error errorData={error} />,
          colorSchema: "danger",
        });
      }
    }, []);
    //@@viewOff:private

    //@@viewOn:render
    let attrs = UU5.Common.VisualComponent.getAttrs(props, CLASS_NAMES.main());

    // TODO Add permission to jokesPermission
    if (!system.awidData.awidLicenseOwnerList.some((owner) => owner === identity.uuIdentity)) {
      return (
        <SpaUnauthorizedInit>
          <UU5.Bricks.Lsi lsi={Lsi.notAuthorizedForInit} />
        </SpaUnauthorizedInit>
      );
    }

    return (
      <>
        <UU5.Bricks.Container noSpacing>
          <UU5.Forms.ContextSection
            {...attrs}
            header={
              <UU5.Forms.ContextHeader
                content={<UU5.Bricks.Lsi lsi={Lsi.formHeader} />}
                info={<UU5.Bricks.Lsi lsi={Lsi.formHeaderInfo} />}
              />
            }
          >
            <UU5.Forms.ContextForm
              onSave={handleSave}
              onSaveDone={() => {}}
              onSaveFail={() => {}}
              controlled={false}
              inputColWidth={"m-12"}
              labelColWidth={"m-12"}
            >
              <UU5.Forms.Text
                required
                name="uuBtLocationUri"
                label={routeLsi.uuBtLocationUriLabel}
                tooltip={routeLsi.uuBtLocationUriTooltip}
                controlled={false}
              />
              <UU5.Forms.Text name="name" label={routeLsi.nameLabel} controlled={false} />
              <UU5.Forms.ContextControls
                buttonSubmitProps={{ content: <UU5.Bricks.Lsi lsi={Lsi.initialize} /> }}
                buttonCancelProps={{ className: CLASS_NAMES.cancelButton() }}
              />
            </UU5.Forms.ContextForm>
          </UU5.Forms.ContextSection>
        </UU5.Bricks.Container>
      </>
    );
  },
  //@@viewOff:render
});

export default InitAppWorkspace;

// ISSUE Visual Identification doesn't work when withRoute is used
// https://uuapp.plus4u.net/uu-sls-maing01/558dcc308da34b82bbe044d94074802f/issueDetail?id=616473e9a57edb002a90cd1b

//export default withRoute(InitAppWorkspace, { authenticated: true });
