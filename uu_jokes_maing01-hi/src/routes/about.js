//@@viewOn:imports
import UU5 from "uu5g04";
import "uu5g04-bricks";
import { createVisualComponent, useLsi } from "uu5g04-hooks";
import Plus4U5 from "uu_plus4u5g01";
import { useSystemData } from "uu_plus4u5g02";
import { withRoute } from "uu_plus4u5g02-app";
import "uu_plus4u5g01-app";

import Config from "./config/config.js";
import Lsi from "../config/lsi.js";
import AboutCfg from "../config/about.js";
//@@viewOff:imports

const STATICS = {
  //@@viewOn:statics
  displayName: Config.TAG + "About",
  //@@viewOff:statics
};

const CLASS_NAMES = {
  main: () => Config.Css.css`
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
  logos: () => Config.Css.css`
    text-align:center;
    margin-top: 56px;

    .uu5-bricks-image {
      height: 80px;
    }
  `,
  termsOfUse: () => Config.Css.css`
    text-align:center;
    margin-top: 56px;
  `,
};

export const About = createVisualComponent({
  ...STATICS,

  //@@viewOn:propTypes
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const { data: system } = useSystemData();
    const aboutLsi = AboutCfg.about || {};
    const licence = AboutCfg.licence || {};
    const usedTechnologies = AboutCfg.usedTechnologies || {};

    // NOTE Some of these cannot be passed as prop={<UU5.Bricks.Lsi />} therefore we're using useLsi() hook.
    let about = useLsi(aboutLsi);
    let organisation = useLsi(licence.organisation);
    let authorities = useLsi(licence.authorities);
    let technologies = useLsi(usedTechnologies.technologies);
    let content = useLsi(usedTechnologies.content);

    let header = useLsi(Lsi.about.header);
    let creatorsHeader = useLsi(Lsi.about.creatorsHeader);
    let termsOfUse = useLsi(Lsi.about.termsOfUse);
    //@@viewOff:private

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:render
    function getAuthors(authors) {
      return (
        authors &&
        authors.slice().map((author) => {
          author = UU5.Common.Tools.merge({}, author);
          author.role =
            author.role && typeof author.role === "object" ? <UU5.Bricks.Lsi lsi={author.role} /> : author.role;
          return author;
        })
      );
    }
    const leadingAuthors = getAuthors(AboutCfg.leadingAuthors);
    const otherAuthors = getAuthors(AboutCfg.otherAuthors);
    const attrs = UU5.Common.VisualComponent.getAttrs(props, CLASS_NAMES.main());
    return (
      <>
        <UU5.Bricks.Section {...attrs}>
          <Plus4U5.App.About header={header} content={about} />

          <Plus4U5.App.Support
            uuFlsUri={system.relatedObjectsMap.uuAppUuFlsBaseUri}
            uuSlsUri={system.relatedObjectsMap.uuAppUuSlsBaseUri}
            productPortalUri={system.relatedObjectsMap.uuAppProductPortalUri}
            productCode="uuJokes"
          />

          <UU5.Bricks.Div className="center">
            {UU5.Common.Tools.findComponent("UuProductCatalogue.Bricks.ProductInfo", {
              baseUri: system.relatedObjectsMap.uuAppBusinessRequestsUri,
              type: "16x9",
            })}
            {UU5.Common.Tools.findComponent("UuProductCatalogue.Bricks.ProductInfo", {
              baseUri: system.relatedObjectsMap.uuAppBusinessModelUri,
              type: "16x9",
            })}
            {UU5.Common.Tools.findComponent("UuProductCatalogue.Bricks.ProductInfo", {
              baseUri: system.relatedObjectsMap.uuAppApplicationModelUri,
              type: "16x9",
            })}
          </UU5.Bricks.Div>

          <Plus4U5.App.Licence organisation={organisation} authorities={authorities} awid={system.awidData.awid} />
          <Plus4U5.App.Authors header={creatorsHeader} leadingAuthors={leadingAuthors} otherAuthors={otherAuthors} />
          <Plus4U5.App.Technologies technologies={technologies} content={content} />
          {licence.termsOfUse && (
            <UU5.Bricks.P className={CLASS_NAMES.termsOfUse()}>
              <UU5.Bricks.Link href={licence.termsOfUse} target="_blank" content={termsOfUse} />
            </UU5.Bricks.P>
          )}
          <UU5.Bricks.Div className={CLASS_NAMES.logos()}>
            <UU5.Bricks.Image responsive={false} src="assets/plus4u.svg" />
            <UU5.Bricks.Image responsive={false} src="assets/unicorn.svg" />
          </UU5.Bricks.Div>
        </UU5.Bricks.Section>
      </>
    );
  },
  //@@viewOff:render
});

export default About;

// ISSUE Visual Identification doesn't work when withRoute is used
// https://uuapp.plus4u.net/uu-sls-maing01/558dcc308da34b82bbe044d94074802f/issueDetail?id=616473e9a57edb002a90cd1b

//export default withRoute(About, { authenticated: true });
