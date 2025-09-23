<script setup>
import { ref } from "vue";
import { usePageContext } from "../renderer/usePageContext";
import { navigate } from "vike/client/router";

defineProps(["pager"]);
const pageContext = usePageContext();

const url = ref(pageContext.urlParsed.pathname);
const page = ref(parseInt(pageContext.urlParsed.search.page || 1));

const changePage = (pageNumber) => {
  page.value = pageNumber;
  //remove page from search params
  const filtered = Object.fromEntries(
    Object.entries(pageContext.urlParsed.search).filter(
      ([key]) => !key.includes("page")
    )
  );

  //get remaining search params in array
  const searchParams = Object.keys(filtered).map((key) => [key, filtered[key]]);
  let newUrl = pageContext.urlParsed.pathname + "?page=" + page.value;
  for (const key in searchParams) {
    const item = searchParams[key];
    newUrl = newUrl + "&" + item[0] + "=" + item[1];
  }
  navigate(newUrl);
};
</script>
<template>
  <div class="pagination-component">
    <a
      class="btn"
      type="button"
      @click="changePage(1)"
      v-if="pager.currentPage != 1"
    >
      <img
        src="./../assets/images/pagination-double-arrow-left.png"
        alt=""
        width="16"
      />
    </a>
    <a
      class="btn"
      type="button"
      @click="changePage(pager.currentPage - 1)"
      v-if="pager.currentPage != 1"
    >
      <img
        src="./../assets/images/pagination-arrow-left.png"
        alt=""
        width="16"
      />
    </a>
    <a
      class="btn"
      v-for="(_page, index) in pager.pagesCount"
      :key="index"
      @click="changePage(_page)"
      :class="{ active: _page == pager.currentPage }"
    >
      {{ _page }}
    </a>
    <a
      class="btn"
      type="button"
      @click="changePage(pager.currentPage + 1)"
      v-if="pager.currentPage != pager.pagesCount"
    >
      <img
        src="./../assets/images/pagination-arrow-right.png"
        alt=""
        width="16"
      />
    </a>
    <a
      class="btn"
      type="button"
      @click="changePage(pager.pagesCount)"
      v-if="pager.currentPage != pager.pagesCount"
    >
      <img
        src="./../assets/images/pagination-double-arrow-right.png"
        alt=""
        width="16"
      />
    </a>
  </div>
</template>
