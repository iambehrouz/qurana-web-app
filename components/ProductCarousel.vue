<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import _fancybox from "@fancyapps/ui/dist/fancybox/fancybox.umd.js";
const { Fancybox } = _fancybox;
import _carousel from "@fancyapps/ui/dist/carousel/carousel.umd.js";
const { Carousel } = _carousel;
import _carouselThumbs from "@fancyapps/ui/dist/carousel/carousel.thumbs.umd.js";
const { Thumbs } = _carouselThumbs;

import "@fancyapps/ui/dist/fancybox/fancybox.css";
import "@fancyapps/ui/dist/carousel/carousel.css";
import "@fancyapps/ui/dist/carousel/carousel.thumbs.css";
import config from "../config.json";

const props = defineProps(["productItemFiles"]);
const apiUrl = config.apiUrl;
var carousel;
onMounted(() => {
  const container = document.getElementById("productCarousel");
  const options = {
    transition: "slide",
    preload: 3,

    Dots: false,
    Thumbs: {
      type: "classic",
    },
  };
  carousel = new Carousel(container, options, { Thumbs });
  Fancybox.bind('[data-fancybox="gallery"]', {
    // Your custom options
  });
});
onUnmounted(() => {
  carousel.destroy();
});
</script>
<template>
  <div class="f-carousel w-100" id="productCarousel">
    <div class="f-carousel__viewport">
      <div class="f-carousel__track">
        <template v-if="productItemFiles">
          <div
            v-for="(file, index) in productItemFiles"
            :key="index"
            class="f-carousel__slide"
            :data-thumb-src="file.file.mimeType.includes('video') ? '/assets/images/play-video.jpg' : apiUrl + file.file.path + '/128'"
          >
            <a data-fancybox="gallery" :src="apiUrl + file.file.path">
              <video v-if="file.file.mimeType.includes('video')" controls>
                <source :src="apiUrl + file.file.path" type="video/mp4" />
              </video>
              <img v-else :src="apiUrl + file.file.path + '/1024'" />
            </a>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
#productCarousel {
  width: 100%;
  img, video {
    width: 100%;
    height: auto;
  }
  .f-carousel__slide {
    min-height: 300px;
    max-height: 420px;
    img {
      height: 100%;
      width: 100%;
      object-fit: contain;
    }
  }
}
.f-thumbs__track {
  transform: matrix(1, 0, 0, 1, -155, 0) !important;
}
</style>
