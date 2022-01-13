import { Utils, createVisualComponent, Environment, useLsi, Lsi, DynamicLibraryComponent, useSession } from "uu5g05";
import Uu5Elements from "uu5g05-elements";
import Plus4U5 from "uu_plus4u5g01";
import "uu_plus4u5g01-app";
import { useSubApp, useSystemData } from "uu_plus4u5g02";
import { RouteController } from "uu_plus4u5g02-app";

import Config from "./config/config.js";
import LSI from "../config/lsi.js";
import AboutCfg from "../config/about.js";
//@@viewOff:imports

//@@viewOn:css
const Css = {
  main: () => Config.Css.css`
    margin: 0 auto;
    max-width: 920px;

    .plus4u5-app-about > .uu5-bricks-header,
    .plus4u5-app-licence > .uu5-bricks-header,
    .plus4u5-app-authors > .uu5-bricks-header,
    .plus4u5-app-technologies > .uu5-bricks-header {
      border-bottom: 0;
    }

    .plus4u5-app-authors > .uu5-bricks-header {
      margin: 20px 0 10px 0;
      text-align: center;
    }

    > *:last-child {
      padding-bottom: 56px;
    }
  `,
  technologies: () => Config.Css.css({ maxWidth: 480 }),
  logos: () => Config.Css.css({ textAlign: "center", marginTop: 56 }),
  common: () => Config.Css.css`
    max-width: 480px;
    margin: 12px auto 56px;
  
    & > * {
      border-top: 1px solid rgba(0, 0, 0, 0.12);
      padding: 9px 0 12px;
      text-align: center;
      color: #828282;
      &:last-child {
        border-bottom: 1px solid rgba(0, 0, 0, 0.12);
      }
    }
  `,
  technologiesLicenseRow: () =>
    Config.Css.css({
      display: "grid",
      gridTemplateColumns: "minmax(0, 12fr)",
      marginTop: 40,
      padding: "0 8px",
      gap: "0 16px",
      borderTop: "1px solid rgba(0,0,0,.12)",
      ...Utils.Style.getMinMediaQueries("l", {
        gridTemplateColumns: "minmax(0, 8fr) minmax(0, 4fr)",
      }),
    }),
  license: () => Config.Css.css({ width: "auto" }),
};
//@@viewOff:css

//@@viewOn:helpers
function getAuthors(authors) {
  return authors?.map((author) => {
    author = { ...author };
    author.role = author.role && typeof author.role === "object" ? <Lsi lsi={author.role} /> : author.role;
    return author;
  });
}
//@@viewOff:helpers

export const About = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "About",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const { awid } = useSubApp();
    const { state: sessionState } = useSession();
    const { data: systemData } = useSystemData();
    const {
      uuAppUuFlsBaseUri,
      uuAppUuSlsBaseUri,
      uuAppBusinessModelUri,
      uuAppApplicationModelUri,
      uuAppBusinessRequestsUri,
      uuAppUserGuideUri,
      uuAppWebKitUri,
      uuAppProductPortalUri,
    } = systemData?.relatedObjectsMap || {};
    const products = [];
    if (uuAppBusinessModelUri) products.push({ baseUri: uuAppBusinessModelUri });
    if (uuAppApplicationModelUri) products.push({ baseUri: uuAppApplicationModelUri });
    if (uuAppBusinessRequestsUri) products.push({ baseUri: uuAppBusinessRequestsUri });
    if (uuAppUserGuideUri) products.push({ baseUri: uuAppUserGuideUri });
    if (uuAppWebKitUri) products.push({ baseUri: uuAppWebKitUri });

    const aboutLsi = AboutCfg.about || {};
    const licence = AboutCfg.licence || {};
    const usedTechnologies = AboutCfg.usedTechnologies || {};

    // NOTE Some of these cannot be passed as prop={<Lsi />} therefore we're using useLsi() hook.
    const about = useLsi(aboutLsi);
    const organisation = useLsi(licence.organisation);
    const authorities = useLsi(licence.authorities);
    const technologies = useLsi(usedTechnologies.technologies);
    const content = useLsi(usedTechnologies.content);

    const header = useLsi(LSI.about.header);
    const creatorsHeader = useLsi(LSI.about.creatorsHeader);
    const termsOfUse = useLsi(LSI.about.termsOfUse);
    //@@viewOff:private

    //@@viewOn:render
    const leadingAuthors = getAuthors(AboutCfg.leadingAuthors);
    const otherAuthors = getAuthors(AboutCfg.otherAuthors);
    const attrs = Utils.VisualComponent.getAttrs(props, Css.main());

    return (
      <RouteController>
        <div {...attrs}>
          <Plus4U5.App.About header={header} content={about} />
          {sessionState === "authenticated" ? (
            <Plus4U5.App.Support
              uuFlsUri={uuAppUuFlsBaseUri}
              uuSlsUri={uuAppUuSlsBaseUri}
              productCode="uuJokes"
              productPortalUri={uuAppProductPortalUri}
            />
          ) : null}
          {products.length > 0 ? (
            <DynamicLibraryComponent
              uu5Tag="UuProductCatalogue.Bricks.ProductList"
              props={{
                type: "16x9",
                products,
              }}
            />
          ) : null}
          <div className={Css.common()}>
            <div>{`uuJokes ${Environment.appVersion}`}</div>
            {licence.termsOfUse && (
              <div>
                <Uu5Elements.Link href={licence.termsOfUse} target="_blank">
                  {termsOfUse}
                </Uu5Elements.Link>
              </div>
            )}
          </div>
          <Plus4U5.App.Authors header={creatorsHeader} leadingAuthors={leadingAuthors} otherAuthors={otherAuthors} />
          <div className={Css.technologiesLicenseRow()}>
            <div>
              <Plus4U5.App.Technologies
                technologies={technologies}
                content={content}
                textAlign="left"
                className={Css.technologies()}
              />
            </div>
            <div>
              <Plus4U5.App.Licence
                organisation={organisation}
                authorities={authorities}
                awid={<Uu5Elements.Link href={Environment.appBaseUri}>{awid}</Uu5Elements.Link>}
                textAlign="left"
                className={Css.license()}
              />
            </div>
          </div>
          <div className={Css.logos()}>
            <img height={80} src="assets/plus4u.svg" />
            <img height={80} src="assets/unicorn.svg" />
          </div>
        </div>
      </RouteController>
    );
  },
  //@@viewOff:render
});

export default About;
