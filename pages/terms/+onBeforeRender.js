import * as langauges from "../../languages/index";
export { onBeforeRender };
const onBeforeRender = async (pageContext) => {

  const phrases = langauges.getPhrases(pageContext.data.lng);
  let title = phrases.pages.terms.pageTitle;
  let description = phrases.pages.terms.pageDescription;


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
