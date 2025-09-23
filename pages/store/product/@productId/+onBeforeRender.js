import config from "../../../../config.json";
import * as langauges from "../../../../languages/index";
import axios from "axios";
export { onBeforeRender };

async function onBeforeRender(pageContext) {
  let productItems = [];
  let reviews;

  await axios
    .post(
      config.apiUrl + "/products/items/get",
      { query: { productId: pageContext.routeParams.productId } },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then(function (response) {
      productItems = response.data.data.productItems.items;
    })
    .catch(function (err) {
      return err;
    });

  let product = {};
  await axios
    .post(
      config.apiUrl + "/products/get",
      { query: { productId: pageContext.routeParams.productId } },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then(function (response) {
      product = response.data.data.products.items[0];
    })
    .catch(function (err) {
      return err;
    });

  await axios
    .post(
      config.apiUrl + "/reviews/get",
      {
        query: {
          objectId: pageContext.routeParams.productId,
          objectType: "product",
          isActive: true,
        },
        offset: null,
        limit: null,
        order: "newest",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then(function (response) {
      reviews = response.data.data.reviews.items;
    })
    .catch(function (err) {
      return err;
    });

  let favorite = null;
  if (pageContext.data.user) {
    await axios
      .post(
        config.apiUrl + "/favorites/get",
        {
          query: {
            objectId: pageContext.routeParams.productId,
            objectType: "product",
            userId: pageContext.data.user.userId,
          },
          "x-access-token": pageContext.data.xAccessToken,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then(function (response) {
        if (
          response.data.status === true &&
          response.data.data.favorites.count >= 1
        ) {
          favorite = response.data.data.favorites.items[0];
        }
      })
      .catch(function (err) {
        return err;
      });
  }

  let documentTitle;
  const phrases = langauges.getPhrases(pageContext.data.lng);
  if (productItems.length) {
    documentTitle =
      product.namePersian + " " + productItems[0].name + " - " + phrases.pages.store.product.pageTitle;
  } else if (product) {
    documentTitle = product.namePersian + " - " + phrases.pages.store.product.pageTitle;
  }

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
          product,
          productItems,
          reviews,
          favorite,
        },
        title : documentTitle,
        description : documentTitle,
        lng: pageContext.data.lng,
        lngId: pageContext.data.lngId
      },
    },
  };
}
