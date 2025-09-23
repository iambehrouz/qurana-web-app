<script>
import { ref, defineAsyncComponent, onMounted } from "vue";
import { usePageContext } from "../renderer/usePageContext";
import config from "../config.json";
import Link from "../renderer/Link.vue";

export default {
  components: {
    FiltersCategories: defineAsyncComponent(() =>
      import("./FiltersCategories.vue")
    ),
    Link
  },
  props: ["item"],

  setup(props) {
    const pageContext = usePageContext();
    const lng = ref(pageContext.data.lng);
    const isOpen = ref(false);
    const remountKey = ref(0);
    const apiUrl = config.apiUrl;

    const toggle = () => {
      isOpen.value = !isOpen.value;
    };
    const isActive = ref(false);
    const hasItems = () => {
      return props.item.childs && props.item.childs.length > 0;
    };

    onMounted(() => {
      if (
        pageContext.data.activeCategory &&
        pageContext.data.activeCategory.category &&
        pageContext.data.activeCategory.category.categoryId ==
          props.item.categoryId
      ) {
        isActive.value = true;
        if (hasItems()) {
          isOpen.value = true;
        }
      }
      if (
        pageContext.data.activeCategory &&
        pageContext.data.activeCategory.parents
      ) {
        for (const key in pageContext.data.activeCategory.parents) {
          const parent = pageContext.data.activeCategory.parents[key];
          if (props.item.categoryId == parent.categoryId) {
            isOpen.value = true;
          }
        }
      }
    });
    return { isOpen, toggle, hasItems, isActive, apiUrl, lng};
  },
};
</script>
<template>
  <!-- <pre>{{ item.coverFile.path }}</pre> -->
  <div class="filters-categories-item">
    <div class="d-flex">
      <Link
        :href="'/store/' + item.slug"
        :class="[
          isActive ? 'active' : '',
        ]"
        class="d-flex flex-column align-items-center pe-4 d-block"
      >
        <img class="mb-2" v-if="item.coverFile" :src="apiUrl + item.coverFile.path" style="width: 80px;" height="80px" alt="">
        <p class="item-name m-0">{{ lng == 'ar' && item.nameLongArabic ? item.nameLongArabic : item.nameLong }}</p>
      </Link>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.item-name {
  font-size: 85%;
}
.filters-categories-item {
  a {
    text-decoration: none;
    p {
      color: black;
    }
    &:hover {
      p {
        color: var(--secondary-color);
        font-weight: 600;
      }
    }
  }
}
.active {
  .item-name {
    color: var(--secondary-color);
    font-weight: 600;
  }
}
</style>
