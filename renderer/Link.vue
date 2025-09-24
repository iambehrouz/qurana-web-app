<script setup>
import { usePageContext } from "./usePageContext";

const props = defineProps(["class", "href"]);

const $class = props.class;
const href = props.href;

const pageContext = usePageContext();
</script>

<template>

  <a :class="$class" :href="pageContext.data.lng !== 'fr' ? '/' + pageContext.data.lng + href : href
    ">
    <slot />
  </a>
</template>
