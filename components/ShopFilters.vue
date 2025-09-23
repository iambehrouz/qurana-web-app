<script setup>
import { ref, onMounted } from "vue";
import { usePageContext } from "../renderer/usePageContext";
import * as langauges from "../languages/index";
import FiltersCategories from "./FiltersCategories.vue";
import { navigate } from "vike/client/router";

const pageContext = usePageContext();
const phrases = langauges.getPhrases(pageContext.data.lng);
// const data = ref(pageContext.data.storeCategory.childs);
const props = defineProps(["data"]);


</script>
<template>
  <h2
    class="category-name mb-3"
    v-if="pageContext.data.activeCategory.category"
  >
    <span v-if="lng == 'ar'">{{ pageContext.data.activeCategory.category.nameShortArabic }}</span>
    <span v-else>{{ pageContext.data.activeCategory.category.nameShort }}</span>
  </h2>
  <h2 class="category-name mb-3" v-else>
    {{ phrases.pages.store.index.store }}
  </h2>
  <div class="filters-component row">
    <div v-if="data" class="filter-wrapper d-flex align-items-center col-12">
      <FiltersCategories :data="pageContext.data.activeCategory.childs" />
    </div>
  </div>
</template>
<style scoped lang="scss">
.category-name {
  font-size: 175%;
}
.filters-component {
  width: 100%;
  .filter-wrapper {
    overflow-x: auto;

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
    padding-left: 35px;
    margin-bottom: 5px;
    cursor: pointer;
    font-size: 15px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    padding-right: 25px;
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
    height: calc(100vh - 333px);
    overflow: auto;
    @media (min-width: 992px) {
      height: unset;
    }
  }
}
</style>
