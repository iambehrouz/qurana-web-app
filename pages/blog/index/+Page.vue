<script setup>
import { ref, watch } from "vue";
import { usePageContext } from "./../../../renderer/usePageContext";
import config from "../../../config.json";
import Pageination from "../../../components/Pagination.vue";
import helpers from "../../../helpers";
import * as langauges from "../../../languages/index";
import Link from "../../../renderer/Link.vue";

const pageContext = usePageContext();
const posts = ref(pageContext.data.posts);

const promoPosts = ref(pageContext.data.promoPosts);
const apiUrl = config.apiUrl;
const phrases = langauges.getPhrases(pageContext.data.lng);

const separateDateAndTime = helpers.datetime.toLocaleString;

watch(
  () => pageContext.data.posts,
  () => {
    posts.value = pageContext.data.posts;
  }
);
</script>

<template>
  <div class="container-lg blog-page">
    <div class="row my-4">
      <div
        class="d-none promo-container"
        :class="promoPosts.items.length >= 5 ? 'd-lg-block' : ''"
      >
        <div class="promo">
          <div class="row">
            <div class="col-6">
              <Link
                v-if="promoPosts.items[0].coverFile"
                :href="'/blog/posts/' + promoPosts.items[0].postId"
                class="promo-item promo-item-lg"
                :style="{
                  backgroundImage: `url(${
                    apiUrl + promoPosts.items[0].coverFile.path + '/512'
                  })`,
                }"
              >
                <span>{{ promoPosts.items[0].description }}</span>
              </Link>
              <Link
                v-else
                :href="'/blog/posts/' + promoPosts.items[0].postId"
                class="promo-item promo-item-lg"
                :style="{
                  backgroundImage: `url(${apiUrl + 'noImage'})`,
                }"
              >
                <span>{{ promoPosts.items[0].description }}</span>
              </Link>
            </div>
            <div class="col-6">
              <div class="row">
                <div
                  v-for="(item, index) in promoPosts.items.slice(1, 5)"
                  class="col-6 pb-2"
                  :key="index"
                >
                  <Link
                    v-if="item.coverFile"
                    :href="'/blog/posts/' + item.postId"
                    class="promo-item"
                    :style="{
                      backgroundImage: `url(${apiUrl + item.coverFile.path})`,
                    }"
                    ><span>{{ item.description }}</span></Link
                  >
                  <Link
                    v-else
                    :href="'/blog/posts/' + item.postId"
                    class="promo-item"
                    ><span>{{ item.description }}</span></Link
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-12 col-sm-11 col-md-10 col-lg-8 mx-auto">
        <div>
          <h1 class="page-title">{{ phrases.pages.blog.title }}</h1>
        </div>
        <div
          v-for="(item, index) in posts.items"
          class="blog-list-item d-md-flex"
          :key="index"
        >
          <Link :href="'/blog/posts/' + item.postId" class="item-image">
            <img
              :src="apiUrl + item.coverFile.path + '/256'"
              :alt="item.title"
              v-if="item.coverFile"
            />
          </Link>
          <div class="item-info ms-lg-3">
            <h3>
              <Link :href="'/blog/posts/' + item.postId">
                {{ item.title }}
              </Link>
            </h3>
            <div class="item-">
              <span dir="ltr">
                {{ separateDateAndTime(item.createdAt) }}
              </span>

              <span class="d-flex gap-1 align-items-center"
                >{{ item.views }}
                <img
                  src="./../../../assets/images/eye-regular.svg"
                  alt=""
                  width="14"
                />
                {{ phrases.pages.blog.view }}</span
              >
            </div>
            <p>{{ item.description }}</p>
            <div class="tags d-flex flex-wrap"></div>
          </div>
        </div>

        <div>
          <Pageination :pager="posts.pager" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.blog-page {
  .promo-container {
    margin: 20px 0 60px 0;
    padding: 30px;
    border-radius: 5px;
    box-shadow: 0 5px 30px 0px rgba(59, 59, 59, 0.07);
  }
  .promo-item.promo-item-lg {
    width: 100%;
    height: 240px;
  }

  .promo-item {
    color: var(--text-primary-color);
    display: block;
    position: relative;
    border-radius: 5px;
    background-repeat: no-repeat;
    background-position: center center;
    background-size: cover;
    width: 100%;
    height: 118px;

    span {
      height: 50px;
      font-size: 80%;
      position: absolute;
      bottom: 0;
      width: 100%;
      text-align: center;
      background-color: rgba(255, 255, 255, 0.8);
      height: 67px;
      padding: 10px 5px;
      transition: all 0.3s ease;
      overflow-y: hidden;
    }
    &:hover {
      span {
        height: 100%;
      }
    }
  }
  .blog-list-item {
    box-shadow: 0 5px 30px 0 rgba(59, 59, 59, 0.07);
    text-align: justify;
    padding: 30px 15px;
    margin-bottom: 25px;
    justify-content: end;

    .item-image {
      display: block;
      max-width: 100%;
      width: 350px;
      height: 180px;
      margin: 0 auto 15px;
      // border: 1px solid #f1f1f1;
      border-radius: 5px;

      img {
        width: 100%;
        height: auto;
        max-height: 100%;
        border-radius: 5px;
        object-fit: cover;
      }
    }
    .item-info {
      width: 100%;
      h3 {
        font-size: 140%;
        font-weight: bold;
        line-height: 150%;
        a {
          text-decoration: none;
          color: var(--primary-dark-color);
        }
      }
    }

    .item-date {
      font-size: 90%;
      margin-bottom: 5px;
    }
    p {
      color: var(--text-primary-color);
    }
  }
}
@media (min-width: 992px) {
  .blog-page {
    .blog-list-item {
      margin-left: 15px;
    }
  }
}

@media (min-width: 768px) {
  .blog-page {
    .blog-list-item {
      .item-image {
        img {
          width: 250px;
          height: 100%;
        }
      }
      .item-info {
        padding: 0 15px;
      }
    }
  }
}

tags {
  a {
    text-decoration: none;
    display: block;
  }
  .tag {
    padding: 2px 10px;
    font-size: 90%;
    background-color: #ff5e5e;
    color: white;
    border-radius: 5px;
  }
}
</style>
