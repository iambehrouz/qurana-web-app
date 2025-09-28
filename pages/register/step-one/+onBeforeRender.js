import * as langauges from "../../../languages/index";
export { onBeforeRender };
const onBeforeRender = async (pageContext) => {

  const phrases = langauges.getPhrases(pageContext.data.lng);
  let title = phrases.pages.login.pageTitle;
  let description = phrases.pages.login.pageDescription;


  return {
    pageContext: {
      data: {
        lng: pageContext.data.lng,
        lngId: pageContext.data.lngId,
        title,
        description
      },
    },
  };
};
