import axios from "axios";
import config from "./../../../config.json";
import * as langauges from "./../../../languages/index";

export { onBeforeRender };

async function onBeforeRender(pageContext) {
  const page = parseInt(pageContext.urlParsed.search.page || 1);
  let categoryFilterItemIds = null;
  if (pageContext.urlParsed.search.categoryFilterItemIds)
    categoryFilterItemIds =
      pageContext.urlParsed.search.categoryFilterItemIds.split(",");
  let brandIds = null;
  if (pageContext.urlParsed.search.brandIds)
    brandIds = pageContext.urlParsed.search.brandIds.split(",");

  let categorySlug = pageContext.routeParams.categorySlug;
  let order = "newest";
  if (pageContext.urlParsed.search.order)
    order = pageContext.urlParsed.search.order;
  const categories = {
    items: [],
    filters: {
      query: {
        categoryId: null,
        slug: null,
      },
    },
  };

  const products = {
    items: [],
    filters: {
      query: {
        productId: null,
        isActive: true,
        brandIds,
        category: {
          categoryId: null,
          slug: null,
        },
        categoryFilterItemIds: categoryFilterItemIds,
      },
      offset: null,
      limit: 12,
      order: order,
    },
    pager: {
      itemsCount: 0,
      pagesCount: 1,
      currentPage: 1,
    },
  };

  products.pager.currentPage = page;
  products.filters.offset =
    page * products.filters.limit - products.filters.limit;

  if (categorySlug) {
    products.filters.query.category.slug = categorySlug;
    categories.filters.query.slug = categorySlug;
    await axios
      .post(config.apiUrl + "/categories/get", categories.filters, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(function (response) {
        categories.items = response.data.data;
      })
      .catch(function (err) {
        return err;
      });
  }
  if (pageContext.urlParsed.search.any) {
    products.filters.query.any = pageContext.urlParsed.search.any;
  }
  // if (pageContext.urlParsed.search.q) {
  //   products.filters.query.namePersian = pageContext.urlParsed.search.q;
  // }

  await axios
    .post(config.apiUrl + "/products/get", products.filters, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then(function (response) {
      products.items = response.data.data.products.items;
      products.pager.itemsCount = response.data.data.products.count;
      products.pager.pagesCount = Math.floor(
        products.pager.itemsCount / products.filters.limit
      );
      if (products.pager.itemsCount % products.filters.limit != 0) {
        products.pager.pagesCount++;
      }
    })
    .catch(function (err) {
      return err;
    });

  if (categorySlug) {
    pageContext.data.activeCategory = categories.items;
  } else {
    pageContext.data.activeCategory = {
      category: null,
      childs: [],
      parent: null,
      ordering: null,
      parentId: null,
      path: null,
      slug: null,
    };
  }
  let productsData = products;

  let pageTitle = " فروشگاه - داروخانه آنلاین خانه دارو";
  let pageDescription = null;

  if (
    categorySlug &&
    pageContext.data.activeCategory &&
    pageContext.data.activeCategory.category
  ) {
    pageTitle = ` ${pageContext.data.activeCategory.category.nameLong} - داروخانه آنلاین خانه دارو`;
    if (
      pageContext.data.activeCategory.category.description &&
      pageContext.data.activeCategory.category.description.length
    )
      pageDescription = pageContext.data.activeCategory.category.description;
  }

  // console.log(products);

  const phrases = langauges.getPhrases(pageContext.data.lng);
  let title = phrases.pages.store.index.pageTitle;
  let description = phrases.pages.store.index.pageTitle;

  const brands = {
    items: [],
    filters: {
      query: {
        nameEnglish: null,
        namePersian: null,
        brandId: null,
        any: null,
        minDate: null,
        maxDate: null,
        order: "newest",
        minDateJalali: null,
        maxDateJalali: null,
      },
      order: "newest",
    },
  };
  await axios
    .post(config.apiUrl + "/brands/get", brands.filters, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then(function (response) {
      brands.items = response.data.data.brands.items;
    })
    .catch(function (err) {
      return err;
    });

  return {
    pageContext: {
      data: {
        xAccessToken: pageContext.data.xAccessToken,
        settings: pageContext.data.settings,
        activeCategory: pageContext.data.activeCategory,
        storeCategory: pageContext.data.storeCategory,
        user: pageContext.data.user,
        sidebarPosts: pageContext.data.sidebarPosts,
        pageProps: {
          products,
          productsData,
          brands,
        },
        title,
        description,
        lng: pageContext.data.lng,
        lngId: pageContext.data.lngId
      },
    },
  };
}
