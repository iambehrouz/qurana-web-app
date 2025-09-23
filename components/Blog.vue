<script setup>
import { ref } from "vue";
import { usePageContext } from "../renderer/usePageContext";
import config from "../config.json";
import Link from "../renderer/Link.vue";

const apiUrl = config.apiUrl;

const pageContext = usePageContext();
const posts = ref(pageContext.data.posts);
</script>

<template>
  <section class="container-fluid mb-5">
    <div class="row">
      <div
        class="col-12 d-flex py-lg-5 px-lg-5 justify-content-between align-items-center gap-2 gap-lg-4"
      >
        <h2>Latest news and articles</h2>
        <span class="line"></span>
        <Link class="d-flex px-0 gap-2 align-items-center" href="/blog">
          <span>see all</span>
        </Link>
      </div>
      <div class="col-12 pt-3 pt-lg-0 px-lg-4">
        <div class="row">
          <Link
            class="blog-box col-6 col-lg-3 py-3 d-flex flex-column align-items-center gap-2"
            v-for="item in posts.items"
            :key="item.postId"
            :href="'/blog/posts/' + item.postId"
          >
            <div class="post-image-wrapper">
              <img
                v-if="item.coverFile"
                :src="apiUrl + item.coverFile.path"
                alt=""
              />
            </div>
            <div class="px-2 px-lg-4">
              <h3>{{ item.title }}</h3>
              <p>{{ item.description }}</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.container-fluid {
  position: relative;

  h2 {
    font-size: 90%;
    font-weight: 700;
    margin: 0;
    @media (min-width: 992px) {
      font-size: 150%;
    }
  }
  h3 {
    font-size: 90%;
    font-weight: 700;
    margin: 10px 0 0;
    height: 40px;
    @media (min-width: 992px) {
      font-size: 100%;
      margin: 10px 0;
    }
  }
  p {
    font-size: 80%;
    font-weight: 700;
    margin: 0;
    color: var(--text-secondary-color);
    height: 40px;
    overflow: hidden;
    @media (min-width: 992px) {
      font-size: 87%;
      height: 85px;
    }
  }
  .line {
    padding: 0 16px;
    height: 1px;
    flex: 1;
    background-color: #dcdcdc;
  }
  a {
    text-decoration: none;
    color: var(--text-primary-color);
    font-size: 90%;
    font-weight: 700;
    @media (min-width: 992px) {
      font-size: 100%;
    }
  }
  .blog-box {
    @media (min-width: 992px) {
      &:hover {
        // border: 1px solid var(--secondary-color);
        box-shadow: 0px 0px 8px 0px rgba(237,234,234,0.75);
-webkit-box-shadow: 0px 0px 8px 0px rgba(237,234,234,0.75);
-moz-box-shadow: 0px 0px 8px 0px rgba(237,234,234,0.75);
      }
    }
  }
  .post-image-wrapper {
    width: 140px;
    img {
      width: 100%;
      height: auto;
    }
    @media (min-width: 992px) {
      width: 280px;
    }
  }
}
</style>
