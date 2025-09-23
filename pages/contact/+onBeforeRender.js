import * as langauges from "../../languages/index";
export { onBeforeRender };
const onBeforeRender = async (pageContext) => {

  const phrases = langauges.getPhrases(pageContext.data.lng);
  let title = phrases.pages.contact.pageTitle;
  let description = phrases.pages.contact.pageDescription;


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
