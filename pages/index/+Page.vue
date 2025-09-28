<script setup>
// import Banner from "../../components/Banner.vue";
import { onMounted } from "vue";
import HeroSection from "../../components/HeroSection.vue";
// import AboutSection from "../../components/AboutSection.vue";

onMounted(() => {
  const footer = document.getElementById("footer-wrapper");
  if(footer) {
    footer.classList.remove("darkFooter");
  }
});
</script>

<template>
  <HeroSection />
  <!-- <Blog /> -->
  <!-- <FaqSection /> -->
</template>
