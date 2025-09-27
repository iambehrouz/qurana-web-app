<script setup>
import { onMounted } from "vue";
import "../assets/libs/bootstrap-5.2.3-dist/css/bootstrap.rtl.min.css";
import "../assets/fonts/fontawesome.pro.6.5.2/js/all.js";
import "../assets/fonts/amiri/style.css";
import "../assets/fonts/orator/style.css";
import "../assets/styles/main.scss";
import Header from "./../components/Header.vue";
import Footer from "./../components/Footer.vue";
import Toast from "../components/Toast.vue";
import { useMainStore } from "../stores/main";
import { usePageContext } from "./usePageContext";

const pageContext = usePageContext();
const store = useMainStore();
// const mainStore = useToastsStore();

onMounted(() => {
  if (localStorage.cart && !store.cart.items.length) {
    store.cart = JSON.parse(localStorage.cart);
  }
  store.settings = pageContext.data.settings;
  // store.accountGet();

  const existingLink = document.getElementById("bootstrap-style");
  if (existingLink) {
    existingLink.parentNode.removeChild(existingLink);
  }

  // Create a new link element
  const link = window.document.createElement("link");
  link.id = "bootstrap-style";
  link.rel = "stylesheet";
  link.type = "text/css";

  link.href = "/assets/libs/bootstrap-5.2.3-dist/css/bootstrap.min.css";

  // Append to head
  window.document.head.insertBefore(link, window.document.head.firstChild);
});
</script>

<template>
  <Header />

  <slot />
  <Footer />
  <div class="toast-container position-fixed bottom-0 start-0 p-3">
    <Toast
      :key="index"
      :index="index"
      :type="toast.type"
      :title="toast.title"
      :message="toast.message"
      :datetime="toast.datetime"
      v-for="(toast, index) in store.layout.toasts"
    ></Toast>
  </div>
</template>

<style lang="scss" scoped></style>
