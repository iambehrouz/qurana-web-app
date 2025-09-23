<script setup>
import { ref, onMounted } from "vue";
import axios from "../helpers/axios";
import { usePageContext } from "./../renderer/usePageContext";
import config from "../config.json";
import Link from "../renderer/Link.vue";
const pageContext = usePageContext();
const apiUrl = config.apiUrl;
const productsIds = ref(pageContext.data.newest);
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
        class="col-12 d-flex align-items-center justify-content-center justify-content-lg-end mb-3 mb-lg-5"
      >
        <div
          class="col-7 ps-lg-4 d-flex align-items-center justify-content-center justify-content-lg-between"
        >
          <div class="section-title">
            <h2>New Arrival</h2>
            <span class="text-back-icon">
              <img src="../assets/images/banner-textback.svg" alt="" />
            </span>
          </div>
          <Link
            href="/store"
            class="see-all d-none d-lg-flex align-items-center gap-2"
          >
            <span>see all products</span>
            <i class="fa-light fa-arrow-right"></i>
          </Link>
        </div>
      </div>
      <div class="col-12 pt-3 pt-lg-0">
        <div class="row" v-if="products.items">
          <div
            class="col-6 col-lg-3 mb-3"
            v-for="(product, index) in products.items"
            :key="index"
          >
            <div
              class="p-lg-2 d-flex align-items-center justify-content-center"
            >
              <Link
                class="product-box"
                :href="`/store/product/${product.productId}`"
              >
                <div class="product-image-container">
                  <img
                    v-if="product.coverFile"
                    :src="apiUrl + product.coverFile.path"
                    :alt="product.nameEnglish"
                  />
                </div>
                <div
                  class="product-details pt-2 pb-4 px-3 w-100 d-flex flex-column"
                >
                  <p v-if="lng == 'ar'" class="product-name text-start mb-2">
                    {{ product.nameArabic }}
                  </p>
                  <p v-else class="product-name text-start mb-2">
                    {{ product.nameEnglish }}
                  </p>
                  <div class="d-flex pt-1 mb-2">
                    <span class="price-wrapper d-flex">
                      <span>
                        {{ Number(product.priceMin).toLocaleString("en") }}
                        AED
                      </span>
                    </span>
                  </div>
                  <div class="d-flex justify-content-center w-100">
                    <button class="add-to-cart p-2">Add to card</button>
                  </div>
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
  .see-all {
    color: var(--text-primary-color);
  }
  .product-box {
    background-color: #fff;
    box-shadow: 0px 1px 5px 0px rgba(191, 191, 191, 0.75);
    -webkit-box-shadow: 0px 1px 5px 0px rgba(191, 191, 191, 0.75);
    -moz-box-shadow: 0px 1px 5px 0px rgba(191, 191, 191, 0.75);
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    color: var(--text-primary-color);
    text-decoration: none;
    border-radius: 48px;
    .product-image-container {
      // width: 130px;
      img {
        width: 100%;
        border-radius: 48px 48px 0 0;
      }
    }
    .product-name {
      font-size: 70%;
      margin: 0;
      height: 33px;
      overflow: hidden;
      @media (min-width: 992px) {
        font-size: 100%;
        height: 31px;
      }
    }
    .price-wrapper {
      font-size: 75%;
      color: var(--primary-color);
      font-weight: 700;
      @media (min-width: 992px) {
        font-size: 100%;
      }
    }
    .add-to-cart {
      background-color: var(--secondary-color);
      border-radius: 50px;
      font-size: 80%;
      color: var(--text-primary-color);
      @media (min-width: 992px) {
        font-size: 100%;
      }
    }
    // @media (min-width: 992px) {
    //   width: 340px;
    // }
  }
}
</style>
