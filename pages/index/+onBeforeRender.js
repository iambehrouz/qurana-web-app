import axios from "../../helpers/axios";
export { onBeforeRender };
const onBeforeRender = async (pageContext) => {

  const posts = {
    items: [],
    filters: {
      query: {
        postId: null,
        languageId: pageContext.data.lngId,
        title: null,
        isActive: true,
        minDate: null,
        maxDate: null,
        any: null,
        tag: {
          tagId: null,
          name: null,
        },
      },
      offset: null,
      limit: 4,
      order: "newest",
    }
  };

  const source = await axios.post("/posts/get", posts.filters);
  const response = source.data;
  posts.items = response.data.posts.items;


  return {
    pageContext: {
      data: {
        posts,
        bannerSlides: pageContext.data.settings.value.pages.index.slider.images,
        mostSelling: pageContext.data.settings.value.pages.index.mostSelling.productIds,
        newest: pageContext.data.settings.value.pages.index.newest.productIds,
        offer: pageContext.data.settings.value.pages.index.offer,
        topPicks: pageContext.data.settings.value.pages.index.topPicks.productIds,
        storeCategory: pageContext.data.storeCategory,
        lng: pageContext.data.lng,
        lngId: pageContext.data.lngId
      },
    },
  };
};
