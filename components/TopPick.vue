<script setup>
import { ref, onMounted } from "vue";
import axios from "../helpers/axios";
import { usePageContext } from "./../renderer/usePageContext";
import config from "../config.json";
const pageContext = usePageContext();
import Link from "../renderer/Link.vue";
const apiUrl = config.apiUrl;
const productsIds = ref(pageContext.data.topPicks);
const lng = ref(pageContext.data.lng);
const products = ref({
  items: [],
  filters: {
    query: {
      productIds: productsIds.value,
      isActive: true,
    },
    offset: null,
    limit: null,
  },
});
onMounted(async () => {
  try {
    const res = await axios.post(
      apiUrl + "/products/get",
      products.value.filters
    );
    if (res.status) {
      products.value.items = res.data.data.products.items;
    }
  } catch (err) {
    throw err;
  }
});
</script>

<template>
  <!-- <pre>{{ productsIds }}</pre> -->
  <section class="container mb-5">
    <div class="row">
      <div
        class="col-12 d-flex align-items-center justify-content-center mb-3 mb-lg-5"
      >
        <div class="section-title">
          <h2>Top Picks for You</h2>
          <span class="text-back-icon">
            <img src="../assets/images/banner-textback.svg" alt="" />
          </span>
        </div>
      </div>
      <div class="col-12 pt-3 pt-lg-0 porduct-wrapper">
        <div class="row" v-if="products.items">
          <div
            class="col-6 col-lg-3 mb-3"
            v-for="(product, index) in products.items.slice(0, 2)"
            :key="index"
          >
            <div class="d-flex w-100 align-items-center justify-content-center">
              <Link
                class="product-box w-100"
                :href="`/store/product/${product.productId}`"
              >
                <div class="product-image-container">
                  <img
                    v-if="product.coverFile"
                    :src="apiUrl + product.coverFile.path"
                    :alt="product.nameEnglish"
                  />
                </div>
              </Link>
            </div>
          </div>
          <div
            class="col-6 mb-3"
            v-for="(product, index) in products.items.slice(2, 3)"
            :key="index"
          >
            <div class="d-flex w-100 align-items-center justify-content-center">
              <Link
                class="product-box w-100"
                :href="`/store/product/${product.productId}`"
              >
                <div class="product-image-container">
                  <img
                    v-if="product.coverFile"
                    :src="apiUrl + product.coverFile.path"
                    :alt="product.nameEnglish"
                  />
                </div>
              </Link>
            </div>
          </div>
          <div
            class="col-6 mb-3"
            v-for="(product, index) in products.items.slice(3, 4)"
            :key="index"
          >
            <div class="d-flex w-100 align-items-center justify-content-center">
              <Link
                class="product-box w-100"
                :href="`/store/product/${product.productId}`"
              >
                <div class="product-image-container">
                  <img
                    v-if="product.coverFile"
                    :src="apiUrl + product.coverFile.path"
                    :alt="product.nameEnglish"
                  />
                </div>
              </Link>
            </div>
          </div>
          <div
            class="col-6 col-lg-3 mb-3"
            v-for="(product, index) in products.items.slice(4, 5)"
            :key="index"
          >
            <div class="d-flex w-100 align-items-center justify-content-center">
              <Link
                class="product-box w-100"
                :href="`/store/product/${product.productId}`"
              >
                <div class="product-image-container">
                  <img
                    v-if="product.coverFile"
                    :src="apiUrl + product.coverFile.path"
                    :alt="product.nameEnglish"
                  />
                </div>
              </Link>
            </div>
          </div>
          <div class="col-6 col-lg-3 mb-3">
            <Link
              href="/store"
              class="d-flex flex-column flex-lg-row align-items-center justify-content-center gap-3 product-box"
            >
              <p class="mb-0">See More</p>
              <span class="d-flex align-items-center justify-content-center">
                <i class="fa-light fa-arrow-right"></i>
              </span>
            </Link>
          </div>
        </div>
        <span class="d-none d-lg-block dot-icon">
          <img src="../assets/images/topPick-icon.svg" alt="" />
        </span>
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
      top: -10px;
      left: 0;
      z-index: -1;
      width: 100%;
      img {
        width: 100%;
      }
    }
  }
  .see-all {
    color: var(--text-primary-color);
  }
  .porduct-wrapper {
    position: relative;
    .dot-icon {
      position: absolute;
      top: -50px;
      right: -30px;
      z-index: -1;
      width: 200px;
      img {
        width: 100%;
      }
    }
    .product-box {
      height: 100%;
      border-radius: 48px;
      height: 140px;
      background-color: var(--background-color);
      .product-image-container {
        height: 100%;
        width: 100%;
        img {
          width: 100%;
          border-radius: 48px;
          height: 100%;
          object-fit: cover;
        }
      }
      p {
        font-size: 150%;
        color: var(--text-primary-color);
        @media (min-width: 768px) {
          font-size: 250%;
        }
      }
      span {
        background-color: var(--secondary-color);
        width: 45px;
        height: 45px;
        border-radius: 50%;
        color: var(--text-primary-color);
        svg {
          height: 20px;
        }
      }
      @media (min-width: 768px) {
        height: 306px;
      }
    }
  }
}
</style>
