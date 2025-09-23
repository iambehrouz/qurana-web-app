<script setup>
import { ref, onMounted } from "vue";
import { usePageContext } from "../renderer/usePageContext";
import FiltersCategories from "./FiltersCategories.vue";
import { navigate } from "vike/client/router";
import * as langauges from "../languages/index";

const pageContext = usePageContext();
const data = ref(pageContext.data.storeCategory.childs);

// const data = ref();
// onMounted(() => {
//   data.value = pageContext.data.storeCategory;
// });
// console.log(data.value, "Childs");
// const data = ref(pageContext.data.storeCategory.childs);
// const data = ref(pageContext.data.storeCategory.childs);

const categoryFilterItemIds = ref([]);
const url = ref(pageContext.urlParsed.pathname);
const any = ref(null);
const order = ref(null);
const hasFilters = ref(false);
const props = defineProps(["brands", "activeCategory"]);
const phrases = langauges.getPhrases(pageContext.data.lng);
const brandIds = ref([]);

const handleFilterItemChange = (e, id, type) => {
  if (type === "filters") {
    if (e.target.checked) {
      categoryFilterItemIds.value.push(id);
    } else {
      const index = categoryFilterItemIds.value.findIndex(
        (value) => value == id
      );
      categoryFilterItemIds.value.splice(index, 1);
    }
  }
  if (type === "brands") {
    if (e.target.checked) {
      brandIds.value.push(id);
    } else {
      const index = brandIds.value.findIndex((value) => value == id);
      brandIds.value.splice(index, 1);
    }
  }

  let newUrl =
    url.value +
    "?categoryFilterItemIds=" +
    categoryFilterItemIds.value.join(",") +
    "&brandIds=" +
    brandIds.value.join(",");
  if (any.value) newUrl = newUrl + "&any=" + any.value;
  if (order.value) newUrl = newUrl + "&order=" + order.value;

  navigate(newUrl);
};
// const submitFilters = () => {
//   let newUrl =
//     url.value +
//     "?categoryFilterItemIds=" +
//     categoryFilterItemIds.value.join(",");
//   if (any.value) newUrl = newUrl + "&any=" + any.value;
//   if (order.value) newUrl = newUrl + "&order=" + order.value;

//   navigate(newUrl);
//   hasFilters.value = true;
// };
const deleteFilters = () => {
  if (
    props.activeCategory &&
    props.activeCategory.category &&
    props.activeCategory.category.categoryFilters.length &&
    props.activeCategory.category.slug != 'store'
  ) {
    navigate("/store/" + props.activeCategory.category.slug);
  } else {
    navigate("/store");
  }
};
const isFilterItemChecked = (id) => {
  const index = categoryFilterItemIds.value.findIndex((value) => value == id);

  if (index < 0) {
    return false;
  } else {
    return true;
  }
};
const isBrandChecked = (id) => {
  const index = brandIds.value.findIndex((value) => value == id);

  if (index < 0) {
    return false;
  } else {
    return true;
  }
};
onMounted(() => {
  // console.log(props.brands);

  if (
    pageContext.urlParsed.search.categoryFilterItemIds &&
    pageContext.urlParsed.search.categoryFilterItemIds.length
  )
    categoryFilterItemIds.value =
      pageContext.urlParsed.search.categoryFilterItemIds.split(",");

  if (
    pageContext.urlParsed.search.brandIds &&
    pageContext.urlParsed.search.brandIds.length
  )
    brandIds.value = pageContext.urlParsed.search.brandIds.split(",");

  if (pageContext.urlParsed.search.order)
    order.value = pageContext.urlParsed.search.order;

  console.log(pageContext.urlParsed.search);
  if (
    pageContext.urlParsed.search.categoryFilterItemIds ||
    pageContext.urlParsed.search.brandIds ||
    pageContext.urlParsed.search.order
  ) {
    hasFilters.value = true;
  } else {
    hasFilters.value = false;
  }
});
</script>
<template>
  <div class="container-fluid py-3">
    <div class="d-flex justify-content-between align-items-center filter-title">
      <h3>{{ phrases.pages.store.index.filter }}</h3>
      <a v-if="hasFilters" class="p-2" @click="deleteFilters">{{ phrases.pages.store.index.removeFilters }}</a>
    </div>
    <div class="filters-component row">
      <div
        v-if="brands"
        class="filter-container col-12 d-flex flex-column justify-content-center align-items-between mb-4"
      >
        <div class="filter-wrapper">
          <p class="title fw-bold">{{ phrases.pages.store.index.brands }}</p>
          <div>
            <label
              class="radio-container"
              v-for="(brand, index) in brands"
              :key="index"
            >
              <input
                type="checkbox"
                :checked="isBrandChecked(brand.brandId)"
                name="radio"
                @change="
                  (e) => handleFilterItemChange(e, brand.brandId, 'brands')
                "
              />
              <span class="checkmark"></span>
              {{ brand.nameEnglish }}
            </label>
          </div>
        </div>
      </div>
    </div>
    <div class="filters-component row">
      <div
        v-if="
          activeCategory &&
          activeCategory.category &&
          activeCategory.category.categoryFilters.length
        "
        class="filter-container col-12 d-flex flex-column justify-content-center align-items-between mb-4"
      >
        <div
          class="filter-wrapper mb-3"
          v-for="(filter, index) in activeCategory.category
            .categoryFilters"
          :key="index"
        >
          <p class="title fw-bold">{{ filter.name }}</p>
          <div>
            <label
              class="radio-container"
              v-for="(item, index) in filter.categoryFilterItems"
              :key="index"
            >
              <input
                type="checkbox"
                :checked="isFilterItemChecked(item.categoryFilterItemId)"
                name="radio"
                @change="
                  (e) =>
                    handleFilterItemChange(
                      e,
                      item.categoryFilterItemId,
                      'filters'
                    )
                "
              />
              <span class="checkmark"></span>
              {{ item.value }}
            </label>
          </div>
        </div>
      </div>
      <!-- <div
        class="col-12 text-center d-flex justify-content-center align-items-center gap-2"
      >
        <button class="btn mb-0 p-2 submit-filters" @click="submitFilters">
          submit filters
        </button>
      </div> -->
      <!-- <div class="text-center">
    </div> -->
    </div>
  </div>
</template>
<style scoped lang="scss">
.category-name {
  font-size: 175%;
}
.filter-title {
  a {
    font-size: 100%;
    color: var(--primary-color);
    cursor: pointer;
  }
}
.filters-component {
  width: 100%;
  .filter-wrapper {
    &:last-of-type {
      border-bottom: none;
    }
  }
  .filter-search {
    padding-left: 35px;
  }
  .search-icon {
    position: absolute;
    font-size: 1.8rem;
    top: 5px;
    left: 7px;
  }
  .title {
    padding-right: 10px;
    font-size: 1.3rem;
  }
  .radio-container {
    display: block;
    position: relative;
    padding-left: 15px;
    margin-bottom: 10px;
    cursor: pointer;
    font-size: 15px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    // padding-right: 25px;
  }
  .radio-container input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
  }
  .checkmark {
    position: absolute;
    top: 2px;
    right: 0;
    height: 16px;
    width: 16px;
    background-color: #eee;
  }
  .radio-container:hover input ~ .checkmark {
    background-color: #ccc;
  }

  .radio-container input:checked ~ .checkmark {
    background-color: var(--primary-color);
  }

  .checkmark:after {
    content: "";
    position: absolute;
    display: none;
  }

  .radio-container input:checked ~ .checkmark:after {
    display: block;
  }
  .radio-container .checkmark:after {
    top: 5px;
    left: 5px;
    width: 6px;
    height: 6px;
    background: white;
  }

  .submit-filters {
    background-color: var(--secondary-color);
    color: #fff;
    font-size: 12px;
    width: 100%;
    @media (min-width: 992px) {
      font-size: 14px;
      width: unset;
    }
  }
  .filter-container {
    margin-top: 20px;
    @media (min-width: 992px) {
      height: unset;
    }
  }
}
</style>
