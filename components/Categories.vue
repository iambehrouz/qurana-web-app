<script setup>
import { ref, onMounted } from "vue";
import axios from "../helpers/axios";
import { usePageContext } from "./../renderer/usePageContext";
import config from "../config.json";
import * as langauges from "./../languages/index";
import Link from "../renderer/Link.vue";

const pageContext = usePageContext();
const apiUrl = config.apiUrl;
const data = ref(pageContext.data.storeCategory.childs);
const lng = ref(pageContext.data.lng);
const phrases = langauges.getPhrases(pageContext.data.lng);

onMounted(async () => {});
</script>

<template>
  <section class="container mb-5">
    <div class="row">
      <div
        class="col-12 d-flex align-items-center justify-content-center mb-3 mb-lg-5"
      >
        <div class="section-title">
          <h2>Category</h2>
          <span class="text-back-icon">
            <img src="../assets/images/banner-textback.svg" alt="" />
          </span>
        </div>
      </div>
      <div class="col-12 pt-3 pt-lg-0">
        <div v-if="data">
          <div class="row justify-content-center">
            <div
              class="col-12 col-lg-5 mb-2"
              v-for="(category, index) in data"
              :key="index"
            >
              <Link class="slider-box" :href="'/store/' + category.slug">
                <img
                  class="ultra-wide"
                  v-if="category.coverFile"
                  :src="apiUrl + category.coverFile.path"
                  alt=""
                />
                <div class="category-title">
                  <h2 class="text-center" v-if="lng == 'ar'">{{ category.nameShortArabic }}</h2>
                  <h2 class="text-center" v-else>{{ category.nameShort }}</h2>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.container {
  .section-title {
    position: relative;
    h2 {
      font-size: 130%;
      font-weight: 700;
      margin: 0;
      color: var(--text-primary-color);
      @media (min-width: 992px) {
        font-size: 200%;
      }
    }
    .text-back-icon {
      position: absolute;
      top: 15%;
      left: 0;
      z-index: -1;
      width: 100%;
      img {
        width: 100%;
      }
    }
  }
  .product-box {
    background-color: var(--divider-color);
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    color: var(--text-primary-color);
    text-decoration: none;
    .product-image-container {
      // width: 130px;
      img {
        width: 100%;
      }
    }
    .product-name {
      font-size: 62%;
      margin: 0;
    }
    .price-wrapper {
      font-size: 75%;
    }
    @media (min-width: 992px) {
      // width: 340px;
    }
  }

  .slider-box {
    cursor: pointer;
    height: 100%;
  }

  .slider-box {
    width: 100%;
    display: flex;
    position: relative;
    color: var(--secondary-color);
    border-radius: 70px;
    text-decoration: none;
    max-height: 400px;
    @media (min-width: 992px) {
      max-height: 500px;
    }
    cursor: pointer;
    .category-title {
      position: absolute;
      top: 45%;
      color: #fff;
      z-index: 1;
      width: 100%;
    }
    &::after {
      display: block;
      content: "";
      background: rgba(97, 49, 33, 0.4);
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      right: 0;
      border-radius: 25px;
      @media (min-width: 992px) {
        border-radius: 70px;
      }
    }
  }
  .ultra-wide {
    width: 100%;
    height: 100%;
    border-radius: 25px;
    object-fit: cover;
    @media (min-width: 992px) {
      border-radius: 70px;
    }
  }
  .height-54 {
    height: 54px;
  }
}
</style>
