import * as langauges from "../../languages/index";
export { onBeforeRender };
const onBeforeRender = async (pageContext) => {

  const phrases = langauges.getPhrases(pageContext.data.lng);
  let title = phrases.pages.privacy.pageTitle;
  let description = phrases.pages.privacy.pageDescription;


  return {
    pageContext: {
      data: {
        storeCategory: pageContext.data.storeCategory,
        lng: pageContext.data.lng,
        lngId: pageContext.data.lngId,
        title,
        description
      },
    },
  };
};
