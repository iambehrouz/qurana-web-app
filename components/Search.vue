<script setup>
import { ref, onMounted } from "vue";
import { navigate } from "vike/client/router";
import axios from "../helpers/axios";
import config from "../config.json";
import { usePageContext } from "../renderer/usePageContext";
import * as langauges from "../languages/index";
const emit = defineEmits(["close-search"]);
const apiUrl = config.apiUrl;
const show = ref(false);
const pageContext = usePageContext();
const phrases = langauges.getPhrases(pageContext.data.lng);
const showEnter = ref(false);
const searchForm = ref(null);
const products = ref({
  items: [],
  loading: false,
  noResults: false,
  show: false,
});
const categories = ref({
  items: [],
});

const close = () => {
  show.value = false;

  setTimeout(() => {
    emit("close-search");
  }, 400);
};

const searchSubmit = async () => {
  const keyword = searchForm.value;
  products.value.noResults = false;
  if (keyword.length < 1) {
    products.value.items = [];
    products.value.show = false;
    showEnter.value = false;
  } else {
    products.value.loading = true;
    products.value.show = true;
    showEnter.value = true;
  }
  if (keyword === searchForm.value) {
    await axios
      .post("search/quick", {
        query: keyword,
        limit: 15,
      })
      .then((response) => {
        products.value.items = response.data.data.products.items;
        categories.value.items = response.data.data.categories.items.slice(
          0,
          3
        );
        if (
          response.data.data.products.items.length < 1 &&
          response.data.data.categories.items.length < 1
        )
          products.value.noResults = true;
        products.value.loading = false;
      })
      .catch((err) => {
        products.value.loading = false;
      });
  }
};
const goToProduct = (id) => {
  products.value.show = false;
  navigate(pageContext.data.lng !== 'en' ? '/' + pageContext.data.lng + "/store/product/" + id : "/store/product/" + id);
  close();
};
onMounted(() => {
  show.value = true;
});
</script>
<template>
  <div class="search-component">
    <Transition name="downward-transition">
      <div class="search-container" v-if="show">
        <!-- <form @submit.prevent="navigate(`/search?q=${filter.query}`)"> -->
        <form
          @submit.prevent="
            () => {
              navigate(`/store?any=${searchForm}`);
              products.show = false;
              close();
            }
          "
        >
          <span @click="close" class="d-lg-none">
            <i class="fa fa-times colse"></i>
          </span>
          <!-- search type to text type -->
          <input
            type="text"
            class="form-control"
            :placeholder="phrases.components.search.searchPlaceHolder"
            v-model="searchForm"
            @input="searchSubmit()"
          />
          <button
            type="submit"
            v-show="show"
            class="enter"
            @click.prevent="
              () => {
                navigate(`/store?any=${searchForm}`);
                products.show = false;
                close();
              }
            "
          >
            <!-- <i class="fa fa-arrow-left"></i> -->
            <img src="../assets/images/search-icon.svg" alt="" />
          </button>
        </form>
        <div class="search-results d-block w-100" v-if="products.show">
          <div v-if="products.loading" class="w-100 text-center">
            <i class="fa fa-spinner fa-pulse fa-2x fa-fw"></i>
          </div>
          <div
            v-if="!products.loading && products.noResults"
            class="no-results"
          >
          {{ phrases.components.search.noItem }}
          </div>
          <div
            v-if="
              !products.loading &&
              (products.items.length || categories.items.length)
            "
          >
            <div>
              <Link
                class="product-link gap-2"
                v-for="(item, index) in categories.items"
                :key="index"
                :href="'/store/' + item.slug"
                @click="
                  products.show = false;
                  close();
                "
              >
                <img
                  v-if="item.coverFile"
                  class="img-fluid"
                  :src="apiUrl + item.coverFile.path"
                />
                <img class="img-fluid" v-else />
                <div class="product-name">
                  <span>{{ phrases.components.search.category }} {{ pageContext.data.lng == 'ar' && item.nameLongArabic ? item.nameLongArabic : item.nameLong }} </span>
                </div>
              </Link>
              <a
                @click="goToProduct(item.productId)"
                class="product-link gap-2"
                v-for="(item, index) in products.items"
                :key="index"
              >
                <img
                  v-if="item.coverFile"
                  class="img-fluid"
                  :src="apiUrl + item.coverFile.path"
                />
                <img class="img-fluid" v-else />

                <div class="product-name">
                  <span>{{ pageContext.data.lng == 'ar' && item.nameArabic ? item.nameArabic : item.nameEnglish }} </span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>
<style lang="scss" scoped>
.search-component {
  .search-container {
    max-width: 100%;
    position: relative;
    // top: 0;
    // left: 0;
    // right: 0;
    z-index: 1500;
    // background-color: #fff;
    // box-shadow: 1px 5px 10px rgba(0, 0, 0, 0.1);
    // direction: ltr;
    display: flex;
    flex-direction: column;
    align-items: start;
    form {
      padding: 10px;
      width: 100%;
      position: relative;
      // height: 85px;
      display: flex;
      align-items: center;
      justify-content: center;

      .colse {
        cursor: pointer;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        left: 5px;
        padding: 15px;
      }
      .enter {
        border: none;
        background: var(--background-color);
        border-radius: 0  var(--border-radius-xl)  var(--border-radius-xl) 0;
        cursor: pointer;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        right: 10px;
        padding: 7px 10px;
        img {
          width: 25px;
        }
      }
      input {
        border-radius: var(--border-radius-xl);
        padding-left: 30px;
        padding-right: 50px;
        height: 40px;
        background-color: #fcfaee;
        color: var(--text-primary-light-color);
        &::placeholder {
          color: var(--text-primary-light-color);
        }
      }
    }
    .search-results {
      background-color: #fff;
      position: absolute;
      top: 50px;
      padding: 10px;
      width: 100%;
      box-shadow: 0px 5px 8px rgba(0, 0, 0, 0.3);
      border-radius: 0 0 7px 7px;
      max-height: 425px;
      overflow-y: auto;
      @media (min-width: 992px) {
        top: 60px;
      }
      .no-results {
        padding: 10px;
      }

      .product-link {
        display: flex;
        align-items: center;
        text-decoration: none;
        padding: 10px;
        color: rgb(88, 88, 88);

        border-bottom: 1px solid #f1f1f1;
        cursor: pointer;
        img {
          width: 60px;
          height: 60px;
          object-fit: contain;
          margin-left: 10px;
        }
        .product-name {
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow-x: hidden;
        }
      }
    }
  }
  // @media (min-width: 768px) {
  //   font-size: 28px;
  // }
}

.downward-transition-enter-active {
  transition: transform 0.2s ease-in-out;
}
.downward-transition-leave-active {
  transition: transform 0.2s ease-in-out;
}

.downward-transition-leave-to {
  transform: translateY(-100%);
}
.downward-transition-enter-from {
  transform: translateY(-100%);
}
</style>
