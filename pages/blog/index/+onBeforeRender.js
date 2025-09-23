import axios from "../../../helpers/axios";
import * as langauges from "../../../languages/index";
export { onBeforeRender };
const onBeforeRender = async (pageContext) => {
  const page = parseInt(pageContext.urlParsed.search.page || 1);

  const promoPosts = {
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
      limit: 5,
      order: "newest",
    },
    pager: {
      itemsCount: 0,
      pagesCount: 1,
      currentPage: 1,
    },
  };

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
      limit: 5,
      order: "newest",
    },
    pager: {
      itemsCount: 0,
      pagesCount: 1,
      currentPage: page,
    },
  };
  posts.filters.offset = page * posts.filters.limit - posts.filters.limit;

  const source = await axios.post("/posts/get", posts.filters);
  const response = source.data;
  posts.items = response.data.posts.items;
  posts.pager.itemsCount = response.data.posts.count;
  posts.pager.pagesCount = Math.floor(
    posts.pager.itemsCount / posts.filters.limit
  );
  if (posts.pager.itemsCount % posts.filters.limit != 0) {
    posts.pager.pagesCount++;
  }

  const promoSource = await axios.post("/posts/get", promoPosts.filters);
  const promoResponse = await promoSource.data;

  promoPosts.items = promoResponse.data.posts.items;

  const phrases = langauges.getPhrases(pageContext.data.lng);
  let title = phrases.pages.blog.pageTitle;
  let description = phrases.pages.blog.pageDescription;


  return {
    pageContext: {
      data: {
        xAccessToken: pageContext.data.xAccessToken,
        settings: pageContext.data.settings,
        activeCategory: pageContext.data.activeCategory,
        storeCategory: pageContext.data.storeCategory,
        user: pageContext.data.user,
        sidebarPosts: pageContext.data.sidebarPosts,
        posts,
        promoPosts,
        title,
        description,
        lng: pageContext.data.lng,
        lngId: pageContext.data.lngId,
      },
    },
  };
};
