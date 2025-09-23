<script setup>
import { ref, onMounted, watch } from "vue";
import Swiper from "swiper/bundle";
import "swiper/css/bundle";
import axios from "../helpers/axios";
import { usePageContext } from "./../renderer/usePageContext";
import config from "../config.json";
import Link from "../renderer/Link.vue";

const pageContext = usePageContext();
const apiUrl = config.apiUrl;
const productsIds = ref(pageContext.data.offer.productIds);
const countDownDate = ref("");
const lng = ref(pageContext.data.lng);

const products = ref({
  items: [],
  filters: {
    query: {
      productIds: productsIds.value,
      isActive: true,
    },
    offset: null,
    limit: null,
  },
});
var timer = setInterval(function () {
  if (countDownDate.value) {
    var now = new Date().getTime();

    var distance = countDownDate.value - now;

    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (document.getElementById("timer"))
      document.getElementById("timer").innerHTML =
        days +
        "<span> : </span>" +
        hours +
        "<span> : </span>" +
        minutes +
        "<span> : </span>" +
        seconds;
    if (distance < 0) {
      clearInterval(timer);
      document.getElementById("timer").innerHTML = "EXPIRED";
    }
  }
}, 1000);

onMounted(async () => {
  try {
    const res = await axios.post(
      apiUrl + "/products/get",
      products.value.filters
    );
    if (res.status) {
      products.value.items = res.data.data.products.items;
    }
  } catch (err) {
    throw err;
  }
  const swiper = new Swiper(".offer-swiper", {
    loop: true,
    speed: 100,
    slidesPerView: 1,
    spaceBetween: 10,
    // autoplay: {
    //   delay: 5000,
    // },
    // pagination: {
    //   el: ".swiper-pagination",
    //   clickable: true,
    // },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    breakpoints: {
      768: {
        slidesPerView: 3,
      },
      576: {
        slidesPerView: 2,
      },
    },
  });
  countDownDate.value = new Date(
    pageContext.data.offer.expirationDate
  ).getTime();
  //   setInterval(timer(countDownDate.value), 1000);
});
</script>

<template>
  <section class="container-fluid py-5 mb-5">
    <div class="container">
      <div class="row">
        <div
          class="col-12 d-flex align-items-center justify-content-center justify-content-lg-between gap-2 mb-3 mb-lg-5"
        >
          <div class="section-title d-flex align-items-center">
            <h2>Top Holidays Offer</h2>
          </div>
          <div id="timer"></div>
        </div>
        <div class="col-12 pt-3 pt-lg-0">
          <div v-if="products.items" class="products-wrapper">
            <div class="swiper offer-swiper">
              <div class="swiper-wrapper">
                <div
                  class="swiper-slide"
                  v-for="(product, index) in products.items"
                  :key="index"
                >
                  <Link
                    class="product-box"
                    :href="`/store/product/${product.productId}`"
                  >
                    <div class="product-image-container">
                      <img
                        v-if="product.coverFile"
                        :src="apiUrl + product.coverFile.path"
                        :alt="product.nameEnglish"
                      />
                    </div>
                    <div
                      class="product-details pt-lg-2 pb-lg-4 px-1 px-lg-3 w-100 d-flex flex-column"
                    >
                      <div
                        class="onsale-wrapper p-2 mb-3 d-flex align-items-center justify-content-end"
                      >
                        <p class="mb-1 py-2">on sale</p>
                      </div>
                      <p
                        v-if="lng == 'ar'"
                        class="product-name text-start mb-2"
                      >
                        {{ product.nameArabic }}
                      </p>
                      <p v-else class="product-name text-start mb-2">
                        {{ product.nameEnglish }}
                      </p>
                      <div class="d-flex pt-1 mb-3">
                        <span class="price-wrapper d-flex">
                          <span>
                            {{ Number(product.priceMin).toLocaleString("en") }}
                            AED
                          </span>
                        </span>
                      </div>
                      <div class="d-flex justify-content-center w-100">
                        <button class="add-to-cart p-2">Add to card</button>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
              <div class="swiper-button-next">
                <i class="fa-light fa-arrow-right"></i>
              </div>
              <div class="swiper-button-prev">
                <i class="fa-light fa-arrow-left"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.container-fluid {
  background-color: rgba(242, 229, 191, 0.14);
  .section-title {
    position: relative;
    h2 {
      font-size: 100%;
      font-weight: 700;
      margin: 0;
      color: var(--primary-color);
      @media (min-width: 992px) {
        font-size: 200%;
      }
    }
    .text-back-icon {
      position: absolute;
      top: -10;
      left: 0;
      z-index: -1;
      width: 100%;
      img {
        width: 100%;
      }
    }
  }
  .see-all {
    color: var(--text-primary-color);
  }

  .swiper {
    padding-bottom: 10px;
    padding-top: 10px;
    // .swiper-slide {
    //   // height: 100%;
    //   // @media (min-width: 992px) {
    //   //   padding: 15px;
    //   // }
    // }
  }

  .slider-box {
    cursor: pointer;
    height: 100%;
  }

  .slider-box {
    width: 100%;
    display: flex;
    position: relative;
    color: var(--secondary-color);
    border-radius: 70px;
    text-decoration: none;
    cursor: pointer;
    .category-title {
      position: absolute;
      top: 45%;
      color: #fff;
      z-index: 1;
      width: 100%;
    }
    &::after {
      display: block;
      content: "";
      background: rgba(97, 49, 33, 0.4);
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      right: 0;
      border-radius: 25px;
      @media (min-width: 992px) {
        border-radius: 70px;
      }
    }
  }
  .product-box {
    background-color: #fff;
    height: 100%;
    box-shadow: 0px 1px 5px 0px rgba(191, 191, 191, 0.75);
    -webkit-box-shadow: 0px 1px 5px 0px rgba(191, 191, 191, 0.75);
    -moz-box-shadow: 0px 1px 5px 0px rgba(191, 191, 191, 0.75);
    height: 100%;
    display: flex;
    // flex-direction: column;
    align-items: center;
    gap: 1rem;
    color: var(--text-primary-color);
    text-decoration: none;
    border-radius: 30px;
    .product-image-container {
      width: 100%;
      img {
        width: 100%;
        border-radius: 30px 0 0 30px;
        height: 190px;
        object-fit: cover;
        @media (min-width: 992px) {
          height: 210px;
        }
      }
    }
    .onsale-wrapper {
      background-image: url("../assets/images/offer-sale-back.svg");
      background-repeat: no-repeat;
      background-position: right;
      background-size: contain;
      color: black;
      p {
        transform: rotate(24deg);
      }
    }
    .product-name {
      font-size: 70%;
      margin: 0;
      height: 30px;
      overflow: hidden;
      @media (min-width: 992px) {
        font-size: 100%;
        height: 35px;
      }
    }
    .price-wrapper {
      font-size: 75%;
      color: var(--primary-color);
      font-weight: 700;
      @media (min-width: 992px) {
        font-size: 100%;
      }
    }
    .add-to-cart {
      background-color: var(--secondary-color);
      border-radius: 50px;
      font-size: 80%;
      color: var(--text-primary-color);
      @media (min-width: 992px) {
        font-size: 100%;
      }
    }
    // @media (min-width: 992px) {
    //   width: 340px;
    // }
  }
  .ultra-wide {
    width: 100%;
    height: 100%;
    border-radius: 25px;
    @media (min-width: 992px) {
      border-radius: 70px;
    }
  }
  .swiper-button-next {
    background-color: var(--secondary-color);
    color: var(--text-primary-color);
    border-radius: 50%;
    padding: 5px;
    width: 30px;
    height: 30px;
    right: 0;
    @media (min-width: 992px) {
      width: 40px;
      height: 40px;
    }
    &:after {
      content: "" !important;
      width: 30px;
    }
  }
  .swiper-button-prev {
    background-color: var(--secondary-color);
    color: var(--text-primary-color);
    border-radius: 50%;
    padding: 5px;
    width: 30px;
    height: 30px;
    left: 0;
    @media (min-width: 992px) {
      width: 40px;
      height: 40px;
    }
    &:after {
      content: "" !important;
      width: 30px;
    }
  }
  .height-54 {
    height: 54px;
  }
  #timer {
    span {
      color: var(--primary-color);
    }
  }
}
</style>
