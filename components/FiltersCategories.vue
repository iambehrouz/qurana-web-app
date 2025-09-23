<script>
import { ref } from "vue";
import FiltersCategoriesItem from "./FiltersCategoriesItem.vue";
export default {
  components: {
    FiltersCategoriesItem,
  },
  props: ["data"],
  setup(props) {},
};
</script>
<template>
  <div class="filters-categories w-100 d-flex">
    <FiltersCategoriesItem
      v-for="(item, index) in data"
      :item="item"
      class="mb-2 me-1"
      :key="index"
    />
  </div>
</template>
<style scoped lang="scss">
</style>
