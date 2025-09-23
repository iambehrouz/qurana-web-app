<script setup>
import { ref } from "vue";
import helpers from "../../../../helpers";
import * as langauges from "../../../../languages/index";
import { usePageContext } from "../../../../renderer/usePageContext";
import config from "../../../../config.json";
import CommentForm from "../../../../components/CommentForm.vue";
import axios from "axios";

const pageContext = usePageContext();
const post = ref(pageContext.data.post);
const apiUrl = config.apiUrl;
const gregorianToJalali = helpers.datetime.gregorianToJalali;
const phrases = langauges.getPhrases(pageContext.data.lng);

const reviews = ref(pageContext.data.reviews);

const getReviews = async () => {
  const response = await axios("/reviews/get", {
    query: {
      objectId: pageContext.routeParams.postId,
      objectType: "post",
      isActive: true,
    },
    offset: null,
    limit: null,
    order: "newest",
  });
  reviews.value = response.data.reviews.items;
};
</script>
<template>
  <div v-if="post" class="container-md blog-post-page">
    <div class="row my-4">
      <div class="col-12">
        <div class="post-container col-12 p-2 p-lg-4 mb-4">
          <div class="post-info d-flex align-items-center gap-2 mb-1">
            <img
              src="../../../../assets/images/clock-regular.svg"
              alt=""
              width="15px"
              class="mb-1"
            />
            <span dir="ltr">
              {{ gregorianToJalali(post.createdAt) }}
            </span>

            <img
              src="../../../../assets/images/eye-regular.svg"
              alt=""
              width="15px"
              class="mb-1"
            />
            <span>{{ post.views }} {{ phrases.pages.blog.view }}</span>
          </div>
          <h1 class="mb-4">{{ post.title }}</h1>
          <img
            v-if="post.coverFile"
            class="post-cover mb-4 img-fluid"
            :src="apiUrl + post.coverFile.path"
            :alt="post.title"
          />
          <div class="tags mb-4 d-flex flex-wrap">
            <a
              v-for="(item, index) in post.tags"
              class="d-block m-1"
              :key="index"
              ><span class="tag">{{ item.name }}</span></a
            >
          </div>

          <div class="post-description"
            v-if="
              post.contextType === 'html' || post.contextType === 'markdown'
            "
            v-html="post.context"
          ></div>

          <div class="post-description" v-if="post.contextType === 'plain'">
            <p>{{ post.context }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="container-lg mb-3">
    <div class="container-fluid" style="background: #fff">
      <div class="row py-3">
        <div class="col-12">
          <p class="product-head">{{ phrases.pages.blog.userReviews }}</p>
          <div class="tab reviews-tab">
            <CommentForm
              :objectType="'post'"
              :objectId="post.postId"
              :reviews="reviews"
              @reviewAdded="getReviews"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
h3 {
  font-size: 1rem;
}
.post-cover {
  border-radius: 10px;
}
</style>
