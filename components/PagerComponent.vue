<script>
export default {
  props: ["collection"],
  setup(props, { emit }) {
    const searchSubmit = (page) => {
      emit("search", page);
    };

    const change = (event) => {
      setTimeout(() => {
        searchSubmit(Number(event.target.value));
      }, "1000");
    };

    return { searchSubmit, change };
  },
};
</script>

<template>
  <div class="pager-module" v-if="collection.items != ''">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12 col-md-6 p-0">
          <div class="actions d-flex mb-2">
            <div class="input-group input-group-sm">
              <button
                class="btn btn-outline-secondary fas fa-angle-double-left"
                type="button"
                @click="searchSubmit(1)"
                v-bind:disabled="collection.pager.currentPage == 1"
              ></button>
              <button
                class="btn btn-outline-secondary fas fa-angle-left"
                type="button"
                @click="searchSubmit(collection.pager.currentPage - 1)"
                :disabled="collection.pager.currentPage == 1"
              ></button>
              <input
                type="number"
                class="text-center active flex-fill flex-md-grow-0"
                :value="collection.pager.currentPage"
                min="1"
                :max="collection.pager.pagesCount"
                @input="change"
              />
              <button
                class="btn btn-outline-secondary fas fa-angle-right"
                type="button"
                @click="searchSubmit(collection.pager.currentPage + 1)"
                :disabled="
                  collection.pager.currentPage == collection.pager.pagesCount
                "
              ></button>
              <button
                class="btn btn-outline-secondary fas fa-angle-double-right"
                type="button"
                @click="searchSubmit(collection.pager.pagesCount)"
                :disabled="
                  collection.pager.currentPage == collection.pager.pagesCount
                "
              ></button>
            </div>
          </div>
        </div>
        <div class="col-12 col-md-6 p-0">
          <div class="info mb-2">
            <span>rows</span>
            <span>{{ collection.filters.offset + 1 }}</span>
            <span>to</span>
            <span v-if="collection.filters.offset == null">1</span>
            <span
              v-else-if="
                collection.filters.offset + collection.filters.limit >
                collection.pager.itemsCount
              "
              >{{ collection.pager.itemsCount }}</span
            >
            <span v-else>{{
              collection.filters.offset + collection.filters.limit
            }}</span>
            <span>from</span>
            <span>{{ collection.pager.itemsCount }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
