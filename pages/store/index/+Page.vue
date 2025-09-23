<script setup>
import { ref, onMounted, watch } from "vue";
import ShopFilters from "../../../components/ShopFilters.vue";
import CategoryFilters from "../../../components/CategoryFilters.vue";
import { usePageContext } from "../../../renderer/usePageContext";
import Pagination from "../../../components/Pagination.vue";
import { navigate } from "vike/client/router";
import config from "../../../config.json";
import * as langauges from "../../../languages/index";
import Link from "../../../renderer/Link.vue";

const apiUrl = config.apiUrl;
const pageContext = usePageContext();
const isMobileFiltersOpen = ref(false);
const order = ref("newest");
const remountKey = ref(0);
const readMoreOpen = ref(false);
const products = ref(pageContext.data.pageProps.products);
const brands = ref(pageContext.data.pageProps.brands);
const activeCategory = ref(pageContext.data.activeCategory);
const data = ref(pageContext.data.storeCategory.childs);
const filterData = ref(pageContext.data.storeCategory);
const phrases = langauges.getPhrases(pageContext.data.lng);

// const products = {
//   items: [],
//   filters: {
//     query: {
//       productId: null,
//     },
//     offset: null,
//     limit: 12,
//     order: "newest",
//   },
// };
const submitFilters = () => {
  let url = pageContext.urlParsed.pathname;
  let categoryFilterItemIds = [];

  if (
    pageContext.urlParsed.search.categoryFilterItemIds &&
    pageContext.urlParsed.search.categoryFilterItemIds.length
  )
    categoryFilterItemIds =
      pageContext.urlParsed.search.categoryFilterItemIds.split(",");
  url = url + "?categoryFilterItemIds=" + categoryFilterItemIds.join(",");
  if (pageContext.urlParsed.search.any)
    url = url + "&any=" + pageContext.urlParsed.search.any;
  if (order.value) url = url + "&order=" + order.value;
  navigate(url);
};

const isMobileSortOpen = ref(false);
const mobileFilters = ref(null);
const toggleMobileFilters = () => {
  isMobileFiltersOpen.value = !isMobileFiltersOpen.value;
  if (isMobileFiltersOpen.value === true) {
    mobileFilters.value.style.transform = "translateX(0%)";
  } else {
    mobileFilters.value.style.transform = "translateX(100%)";
  }
};
const toggleMobileSort = () => {
  isMobileSortOpen.value = !isMobileSortOpen.value;
};

watch(
  () => products.value,
  () => {
    remountKey.value++;
    if (!pageContext.urlParsed.search.order) order.value = "newest";
  }
);
const updateProducts = (newProducts) => {
  products.value = { ...newProducts };
};

watch(
  () => pageContext.data.pageProps.products,
  (newProducts) => {
    updateProducts(newProducts);
  },
  { deep: true }
);

onMounted(() => {
  mobileFilters.value = document.getElementById("mobile-filters");
  if (pageContext.urlParsed.search.order)
    order.value = pageContext.urlParsed.search.order;
});
</script>
<template>
  <div class="product-page-wrapper">
    <div class="shop-page container-lg">
      <div class="row my-4">
        <!-- <pre>{{ remountKey }}</pre> -->
        <div class="col-12 d-none d-lg-block mb-2">
          <div>
            <ShopFilters :data="data" :key="remountKey" />
          </div>
        </div>
        <div class="col-12">
          <div class="">
            <div class="col-12 d-flex d-lg-none mb-3 shop-mobile-bar">
              <div class="filter w-50">
                <button @click="toggleMobileFilters">
                  <svg
                    class="me-1"
                    width="24"
                    height="25"
                    viewBox="0 0 24 25"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M21.6299 15.0942C21.6299 15.9842 21.3799 16.8243 20.9399 17.5443C20.1199 18.9243 18.6099 19.8442 16.8799 19.8442C15.1499 19.8442 13.6399 18.9143 12.8199 17.5443C12.3799 16.8343 12.1299 15.9842 12.1299 15.0942C12.1299 12.4742 14.2599 10.3442 16.8799 10.3442C19.4999 10.3442 21.6299 12.4742 21.6299 15.0942Z"
                      stroke="#292D32"
                      stroke-width="1.5"
                      stroke-miterlimit="10"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                    <path
                      d="M18.6599 15.0742H15.1099"
                      stroke="#292D32"
                      stroke-width="1.5"
                      stroke-miterlimit="10"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                    <path
                      d="M16.8799 13.3442V16.8942"
                      stroke="#292D32"
                      stroke-width="1.5"
                      stroke-miterlimit="10"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                    <path
                      d="M20.6901 4.36426V6.58423C20.6901 7.39423 20.1801 8.40425 19.6801 8.91425L17.9201 10.4642C17.5901 10.3842 17.2401 10.3442 16.8801 10.3442C14.2601 10.3442 12.1301 12.4742 12.1301 15.0942C12.1301 15.9842 12.3801 16.8243 12.8201 17.5443C13.1901 18.1643 13.7001 18.6942 14.3201 19.0742V19.4142C14.3201 20.0242 13.9201 20.8342 13.4101 21.1342L12.0001 22.0443C10.6901 22.8543 8.87006 21.9442 8.87006 20.3242V14.9742C8.87006 14.2642 8.46006 13.3542 8.06006 12.8542L4.22006 8.81421C3.72006 8.30421 3.31006 7.39425 3.31006 6.79425V4.46423C3.31006 3.25423 4.22006 2.34424 5.33006 2.34424H18.6701C19.7801 2.34424 20.6901 3.25426 20.6901 4.36426Z"
                      stroke="#292D32"
                      stroke-width="1.5"
                      stroke-miterlimit="10"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                  </svg>
                  <span>{{ phrases.pages.store.index.filter }}</span>
                </button>
              </div>
              <div class="sort w-50">
                <button @click="toggleMobileSort">
                  <svg
                    class="me-1"
                    width="24"
                    height="25"
                    viewBox="0 0 24 25"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M17 10.3442H19C21 10.3442 22 9.34424 22 7.34424V5.34424C22 3.34424 21 2.34424 19 2.34424H17C15 2.34424 14 3.34424 14 5.34424V7.34424C14 9.34424 15 10.3442 17 10.3442Z"
                      stroke="#292D32"
                      stroke-width="1.5"
                      stroke-miterlimit="10"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                    <path
                      d="M5 22.3442H7C9 22.3442 10 21.3442 10 19.3442V17.3442C10 15.3442 9 14.3442 7 14.3442H5C3 14.3442 2 15.3442 2 17.3442V19.3442C2 21.3442 3 22.3442 5 22.3442Z"
                      stroke="#292D32"
                      stroke-width="1.5"
                      stroke-miterlimit="10"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                    <path
                      d="M6 10.3442C8.20914 10.3442 10 8.55338 10 6.34424C10 4.1351 8.20914 2.34424 6 2.34424C3.79086 2.34424 2 4.1351 2 6.34424C2 8.55338 3.79086 10.3442 6 10.3442Z"
                      stroke="#292D32"
                      stroke-width="1.5"
                      stroke-miterlimit="10"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                    <path
                      d="M18 22.3442C20.2091 22.3442 22 20.5534 22 18.3442C22 16.1351 20.2091 14.3442 18 14.3442C15.7909 14.3442 14 16.1351 14 18.3442C14 20.5534 15.7909 22.3442 18 22.3442Z"
                      stroke="#292D32"
                      stroke-width="1.5"
                      stroke-miterlimit="10"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                  </svg>
                  <span> {{ phrases.pages.store.index.sortBy }} </span>
                </button>
                <div v-show="isMobileSortOpen" class="sort-dropdown">
                  <div class="sort-dropdown">
                    <button
                      @click="
                        () => {
                          order = 'newest';
                          toggleMobileSort();
                          submitFilters();
                        }
                      "
                      :class="order === 'newest' ? 'active' : ''"
                    >
                      {{ phrases.pages.store.index.newest }}
                    </button>
                    <button
                      @click="
                        () => {
                          order = 'cheapest';
                          toggleMobileSort();
                          submitFilters();
                        }
                      "
                      :class="order === 'cheapest' ? 'active' : ''"
                    >
                      {{ phrases.pages.store.index.lowest }}
                    </button>
                    <button
                      @click="
                        () => {
                          order = 'most-expensive';
                          toggleMobileSort();
                          submitFilters();
                        }
                      "
                      :class="order === 'most-expensive' ? 'active' : ''"
                    >
                      {{ phrases.pages.store.index.highest }}
                    </button>
                    <!-- <button
                      @click="toggleMobileSort"
                      :class="order === 'newest' ? 'active' : ''"
                    >
                      محبوب ترین
                    </button> -->
                    <button
                      @click="
                        () => {
                          order = 'most-sale';
                          toggleMobileSort();
                          submitFilters();
                        }
                      "
                      :class="order === 'most-sale' ? 'active' : ''"
                    >
                      {{ phrases.pages.store.index.bestSeller }}
                    </button>
                    <button
                      @click="
                        () => {
                          order = 'top-rate';
                          toggleMobileSort();
                          submitFilters();
                        }
                      "
                      :class="order === 'top-rate' ? 'active' : ''"
                    >
                      {{ phrases.pages.store.index.mostLiked }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-12 d-none d-lg-flex mb-3 shop-desktop-bar">
              <div class="sort-title">
                <svg
                  class="ms-3"
                  width="24"
                  height="25"
                  viewBox="0 0 24 25"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17 10.3442H19C21 10.3442 22 9.34424 22 7.34424V5.34424C22 3.34424 21 2.34424 19 2.34424H17C15 2.34424 14 3.34424 14 5.34424V7.34424C14 9.34424 15 10.3442 17 10.3442Z"
                    stroke="#292D32"
                    stroke-width="1.5"
                    stroke-miterlimit="10"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                  <path
                    d="M5 22.3442H7C9 22.3442 10 21.3442 10 19.3442V17.3442C10 15.3442 9 14.3442 7 14.3442H5C3 14.3442 2 15.3442 2 17.3442V19.3442C2 21.3442 3 22.3442 5 22.3442Z"
                    stroke="#292D32"
                    stroke-width="1.5"
                    stroke-miterlimit="10"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                  <path
                    d="M6 10.3442C8.20914 10.3442 10 8.55338 10 6.34424C10 4.1351 8.20914 2.34424 6 2.34424C3.79086 2.34424 2 4.1351 2 6.34424C2 8.55338 3.79086 10.3442 6 10.3442Z"
                    stroke="#292D32"
                    stroke-width="1.5"
                    stroke-miterlimit="10"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                  <path
                    d="M18 22.3442C20.2091 22.3442 22 20.5534 22 18.3442C22 16.1351 20.2091 14.3442 18 14.3442C15.7909 14.3442 14 16.1351 14 18.3442C14 20.5534 15.7909 22.3442 18 22.3442Z"
                    stroke="#292D32"
                    stroke-width="1.5"
                    stroke-miterlimit="10"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                </svg>
                <span> {{ phrases.pages.store.index.sortBy }}</span>
              </div>
              <div class="d-flex pe-4">
                <button
                  @click="
                    () => {
                      order = 'newest';
                      submitFilters();
                    }
                  "
                  class="sort-btn"
                  :class="order === 'newest' ? 'active' : ''"
                >
                  {{ phrases.pages.store.index.newest }}
                </button>
                <!-- <button
                  class="sort-btn"
                  :class="order === 'oldest' ? 'active' : ''"
                >
                  قدیمی ترین
                </button> -->
                <button
                  @click="
                    () => {
                      order = 'cheapest';
                      submitFilters();
                    }
                  "
                  class="sort-btn"
                  :class="order === 'cheapest' ? 'active' : ''"
                >
                  {{ phrases.pages.store.index.lowest }}
                </button>
                <button
                  @click="
                    () => {
                      order = 'most-expensive';
                      submitFilters();
                    }
                  "
                  class="sort-btn"
                  :class="order === 'most-expensive' ? 'active' : ''"
                >
                  {{ phrases.pages.store.index.highest }}
                </button>
                <!-- <button
                  class="sort-btn"
                  :class="order === 'newest' ? 'active' : ''"
                >
                  محبوب ترین
                </button> -->
                <button
                  @click="
                    () => {
                      order = 'most-sale';
                      submitFilters();
                    }
                  "
                  class="sort-btn"
                  :class="order === 'most-sale' ? 'active' : ''"
                >
                  {{ phrases.pages.store.index.bestSeller }}
                </button>
                <button
                  @click="
                    () => {
                      order = 'top-rate';
                      submitFilters();
                    }
                  "
                  class="sort-btn"
                  :class="order === 'top-rate' ? 'active' : ''"
                >
                  {{ phrases.pages.store.index.mostLiked }}
                </button>
              </div>
            </div>
            <div class="row">
              <div class="col-3 desktop-filter-wrapper d-none d-lg-block">
                <div class="container-fluid desktop-filter-container">
                  <CategoryFilters
                    :activeCategory="filterData"
                    :key="remountKey"
                    :brands="brands.items"
                  />
                </div>
              </div>
              <div class="col-12 col-lg-9">
                <div class="row g-2">
                  <div
                    class="col-6 col-md-4 col-lg-3"
                    v-for="(product, index) in products.items"
                    :key="index"
                  >
                    <Link
                      :href="`/store/product/${product.productId}`"
                      class="product-box"
                    >
                      <div class="product-img">
                        <img
                          v-if="product.coverFile"
                          :src="apiUrl + product.coverFile.path + '/256'"
                        />
                      </div>
                      <div class="product-info px-1 px-lg-2">
                        <span class="product-name mb-3">
                          <span v-if="pageContext.data.lng == 'ar'">{{
                            product.nameArabic
                          }}</span>
                          <span v-else>{{ product.nameEnglish }}</span>
                        </span>
                        <hr class="text-secondary" />
                        <div
                          class="available px-1 d-flex flex-wrap justify-content-end align-items-center"
                          v-if="product.inStock && product.priceMin"
                        >
                          <span class="price">{{ product.priceMin }}</span>
                          <span class="currency ms-1">AED</span>
                        </div>
                        <div class="unavailable px-1" v-else>
                          <span>{{
                            phrases.pages.store.index.outofstock
                          }}</span>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="text-center mb-3" v-if="products.items.length">
        <Pagination :pager="products.pager" />
      </div>
      <div
        v-if="
          pageContext.data.activeCategory &&
          pageContext.data.activeCategory.category &&
          pageContext.data.activeCategory.category.overview
        "
      >
        <div
          :style="readMoreOpen ? { height: 'auto' } : { maxHeight: '200px' }"
          class="category-overview border"
        >
          <div v-html="pageContext.data.activeCategory.category.overview"></div>

          <div class="btn-container">
            <button @click="readMoreOpen = !readMoreOpen" class="btn-secondary">
              {{
                readMoreOpen
                  ? phrases.pages.store.index.close
                  : phrases.pages.store.index.readMore
              }}
              <i
                :class="
                  readMoreOpen ? 'fa fa-chevron-up' : 'fa fa-chevron-down'
                "
              ></i>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="mobile-filters" id="mobile-filters">
      <div class="d-flex justify-content-end ms-3">
        <button @click="toggleMobileFilters" class="btn btn-dark px-3">
          <i class="fa fa-close"></i>
        </button>
      </div>
      <ShopFilters :data="data" :key="remountKey" />
      <CategoryFilters
        :activeCategory="filterData"
        :key="remountKey"
        :brands="brands.items"
      />
    </div>
  </div>
</template>
<style scoped lang="scss">
.product-page-wrapper {
  font: normal 1rem orator !important;
}
.shop .active {
  background-color: rgb(26, 26, 26) !important;
  color: rgb(255, 255, 255) !important;
}
.shop-page {
  position: relative;
  display: block;
}
.category-overview {
  background-color: #fff;
  overflow: hidden;
  position: relative;
  padding-bottom: 60px;
  border-radius: 5px;
  img {
    max-width: 100%;
  }
  div.btn-container {
    width: 100%;
    height: 40px;
    position: absolute;
    background-color: #fff;

    bottom: 0;
    left: 0;
    height: 50px;
  }
  div {
    height: 100%;
    overflow: hidden;
    text-align: justify;
    padding: 2rem;
  }

  button {
    position: absolute;
    bottom: 16px;
    left: 16px;
    padding: 5px 15px;
    border-radius: 5px;
    border: none;
    color: white;
  }
}

/*#region Shop page*/
.shop-mobile-bar {
  text-align: center;
  min-height: 50px;
  background-color: #ecebeb;
  border-radius: var(--border-radius-sm);
  position: sticky;
  top: 60px;
  .sort {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    .sort-dropdown {
      position: absolute;
      background-color: #ecebeb;
      top: 100%;
      width: 100%;
      z-index: 2;
      border-radius: 0 0 5px 5px;
      box-shadow: var(--container-shadow);
    }
  }
  .filter {
    display: flex;
    align-items: center;
    justify-content: center;
    border-left: 1px solid #fff;
    // position: relative;
  }
  .filter,
  .sort {
    span {
      font-size: 13px;
    }
  }
  button {
    background-color: transparent;
    border: none;
    font-size: 1rem;
    width: 100%;
    height: 100%;
    padding: 10px;
    font-weight: 100;
    color: #212529;
  }
}
.shop-desktop-bar {
  min-height: 50px;
  background-color: rgba(165, 182, 141, 0.5);
  padding: 10px;
  border-radius: var(--border-radius-sm);
  align-items: center;
  font-size: 1rem;
  height: 100%;

  .sort-title {
    border-left: 2px solid #fff;
    padding-left: 15px;
  }
  .sort-btn {
    border: none;
    padding: 10px;
    border-radius: 5px;
    margin-left: 10px;
    background-color: transparent;
  }
}
.product-box {
  background-color: #fff;
  border-radius: var(--border-radius-sm);
  box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.13);
  height: 100%;
  text-decoration: none;
  color: #000;
  margin-bottom: 10px;
  transition: var(--transition);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 180px;

  &:hover {
    color: #000;
    background-color: var(--divider-color);
    box-shadow: var(--container-shadow);
  }
  .product-img {
    height: 100%;
    max-height: 180px;
    min-height: 60px;
    padding: 10px;
    object-fit: cover;
    @media (min-width: 992px) {
      max-height: 300px;
    }
  }

  img {
    width: 100%;
    height: 100%;
    // object-fit: contain;
  }
  .product-info {
    background-color: #fff;
    padding: 10px 0 15px;
  }
  .product-name {
    font-weight: 500;
    font-size: 85%;
    display: -webkit-box;
    line-clamp: 2;
    -webkit-line-clamp: 2;
    height: 33px;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    @media (min-width: 992px) {
      font-size: 100%;
    }
  }
  .text-secondary {
    color: white !important;
  }

  .available {
    text-align: end;
    .price {
      color: var(--primary-color);
      font-weight: bold;
    }
    .currency {
      font-size: 12px;
      margin-right: 3px;
      color: var(--primary-color);
      @media (min-width: 992px) {
        font-size: 14px;
      }
    }
  }
  .unavailable {
    text-align: end;
    font-weight: bold;
    font-size: 90%;
    color: gray;
    @media (min-width: 992px) {
      font-size: 100%;
    }
  }
}
.mobile-filters {
  position: fixed;
  top: 50px;
  background-color: white;
  width: 100%;
  height: 100%;
  z-index: 4;
  padding: 20px;
  transform: translateX(100%);
  transition: var(--transition);
  overflow: auto;
}
.active {
  background-color: #1a1a1a !important;
  color: #fff !important;
}
.desktop-filter-wrapper {
  .desktop-filter-container {
    background-color: #fff;
    height: 80%;
    overflow-y: auto;
    position: relative;
  }
}
/*#endregion */
</style>
