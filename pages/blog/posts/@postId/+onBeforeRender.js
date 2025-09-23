import axios from "../../../../helpers/axios";
import { marked } from "marked";
import config from "../../../../config.json";
export { onBeforeRender };

async function onBeforeRender(pageContext) {
  const postId = parseInt(pageContext.routeParams.postId);
  // await axios.post("/posts/views-increase", {
  //   postId,
  // });
  let reviews;
  await axios
    .post(
      config.apiUrl + "/reviews/get",
      {
        query: {
          objectId: pageContext.routeParams.postId,
          objectType: "post",
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

  const source = await axios.post("/posts/get", {
    query: {
      postId: postId,
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
  });

  const response = await source.data;

  let post = response.data.posts.items[0];

  if (post && post.contextType === "markdown" && post.context) {
    post.context = marked(post.context);
  }
  const title = post.title
  const description = post.description

  return {
    pageContext: {
      data: {
        xAccessToken: pageContext.data.xAccessToken,
        settings: pageContext.data.settings,
        user: pageContext.data.user,
        storeCategory: pageContext.data.storeCategory,
        reviews,
        post,
        title,
        description,
        lng: pageContext.data.lng,
        lngId: pageContext.data.lngId,
      },
    },
  };
}
