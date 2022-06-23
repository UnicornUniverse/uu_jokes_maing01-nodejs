//@@viewOn:imports
import { Content, createVisualComponent, PropTypes, Environment, DynamicLibraryComponent, useLsi } from "uu5g05";
import { Link } from "uu5g05-elements";
import { useSubApp } from "uu_plus4u5g02";
import Config from "./config/config";
import LsiData from "./view-lsi";
//@@viewOff:imports

//@@viewOn:css
const Css = {
  license: () => Config.Css.css({ width: "auto", marginTop: "0px !important" }),
  common: () =>
    Config.Css.css({
      maxWidth: 480,
      margin: "0px auto",

      "& > *": {
        borderTop: "1px solid rgba(0, 0, 0, 0.12)",
        padding: "9px 0 12px",
        textAlign: "center",
        color: "#828282",
        "&:last-child": {
          borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
        },
      },
    }),
};
//@@viewOff:css

export const View = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "View",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    aboutPage: PropTypes.object.isRequired,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const { awid } = useSubApp();

    // ISSUE Plus4U5.App.Licence - add support for awidLicenceOwnerList
    // https://uuapp.plus4u.net/uu-sls-maing01/558dcc308da34b82bbe044d94074802f/issueDetail?id=61e182429e65970029021890
    const authorities = useLsi(LsiData.authorities);

    // ISSUE Plus4U5.App.Licence - Improve support for organization
    // https://uuapp.plus4u.net/uu-sls-maing01/558dcc308da34b82bbe044d94074802f/issueDetail?id=61e185689e65970029021a1d
    const organisation = useLsi(LsiData.organisation);
    //@@viewOff:private

    //@@viewOn:render
    return (
      <>
        {props.aboutPage.body?.map((section) => {
          return <Content key={section.code}>{section.content}</Content>;
        })}
        <div className={Css.common()}>
          <div>{`uuJokes ${Environment.appVersion}`}</div>
          <DynamicLibraryComponent
            uu5Tag="Plus4U5.App.Licence"
            organisation={organisation}
            authorities={authorities}
            awid={<Link href={Environment.appBaseUri}>{awid}</Link>}
            className={Css.license()}
          />
        </div>
      </>
    );
    //@@viewOff:render
  },
});

export default View;
