//@@viewOn:imports
import { createComponent, PropTypes, useDataObject } from "uu5g05";
import Config from "./config/config";
import Calls from "calls";
//@@viewOff:imports

export const PageProvider = createComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "PageProvider",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    baseUri: PropTypes.string,
    pageCode: PropTypes.string,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    pageCode: "about",
  },
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const aboutDataObject = useDataObject({
      handlerMap: {
        load: handleLoad,
      },
    });

    async function handleLoad() {
      const dtoIn = { code: props.pageCode };
      const dtoOut = await Calls.About.loadWebPage(dtoIn, props.baseUri);
      return dtoOut.webPage;
    }
    //@@viewOff:private

    //@@viewOn:render
    return typeof props.children === "function" ? props.children(aboutDataObject) : props.children;
    //@@viewOff:render
  },
});

export default PageProvider;
