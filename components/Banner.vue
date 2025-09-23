<script setup>
// import { onMounted, ref } from "vue";
import { onMounted, ref } from "vue";
import { usePageContext } from "../renderer/usePageContext";
import config from "../config.json";
import * as langauges from "../languages/index";
import Link from "../renderer/Link.vue";

const pageContext = usePageContext();
const apiUrl = config.apiUrl;
const lng = ref(pageContext.data.lng);
const phrases = langauges.getPhrases(pageContext.data.lng);
</script>

<template>
  <section class="container pt-4 pt-lg-5 mb-5">
    <div class="banner-wrapper row">
      <div
        class="col-12 col-lg-4 d-flex flex-lg-column justify-content-between align-items-center align-items-lg-start  banner-text-wrapper"
      >
        <div class="banner-title">
          <h1>Trendy Trades</h1>
          <h2>Be with us be the best</h2>
          <span class="text-back-icon">
            <img src="../assets/images/banner-textback.svg" alt="" />
          </span>
        </div>
        <div class="ps-lg-5 pb-lg-4 banner-button">
          <Link class="p-1 p-lg-4 d-flex align-items-center" href="/store">
            <span
              class="p-lg-3 w-100 d-flex align-items-center justify-content-center text-wrap"
              >Shop Now</span
            >
          </Link>
          <span class="round-lines-icon d-none d-lg-block">
            <img
              src="../assets/images/banner-round-lines.svg"
              width="260px"
              alt=""
            />
          </span>
        </div>
      </div>
      <div class="col-12 col-lg-8 banner-images-wrapper">
        <div class="row">
          <div class="col-6 d-flex align-items-end">
            <img class="banner-first-image" src="../assets/images/hero-left.png" alt="" />
          </div>
          <div class="col-6">
            <img class="banner-second-image" src="../assets/images/hero-right.png" alt="" />
          </div>
        </div>
      </div>
      <span class="d-none d-lg-block star-icon">
        <img src="../assets/images/banner-star-icon.svg" alt="" />
      </span>
      <span class="arrow-icon d-none d-lg-block">
        <img
          src="../assets/images/banner-arrow-icon.svg"
          alt=""
        />
      </span>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.container {
  position: relative;
  .banner-wrapper {
    .banner-text-wrapper {
      // @media (min-width: 992px) {
      //   overflow: visible;
      // }
      h1 {
        font-size: 200%;
        color: var(--primary-color);
        line-height: 1;
        @media (min-width: 992px) {
          width: 600px;
          font-size: 500%;
          letter-spacing: 3px;
        }
      }
      h2 {
        font-size: 100%;
        color: var(--primary-color);
        line-height: 1;
        @media (min-width: 992px) {
          width: 600px;
          font-size: 300%;
          letter-spacing: 3px;
          width: 90%;
        }
      }
      a {
        border-radius: 50%;
        background-color: var(--secondary-color);
        color: var(--text-primary-color);
        width: 70px;
        height: 70px;
        span {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          font-size: 100%;
          line-height: 1.4;
          text-align: center;
          border: 2px solid #f2e5bf;
          @media (min-width: 992px) {
            font-size: 150%;
          }
        }
        @media (min-width: 992px) {
          width: 170px;
          height: 170px;
        }
      }
      .banner-title,
      .banner-button {
        position: relative;
      }
      .banner-title {
        img {
          width: 100%;
        }
      }
    }
    .banner-images-wrapper {
      img {
        width: 100%;
        // border-radius: var(--border-radius-lg);
        border-radius: 50px;
      }
      .banner-first-image {
        // height: 420px;
        @media (min-width: 992px) {
          height: 420px;
        }
      }
    }
    .star-icon {
      position: absolute;
      top: 0;
      left: 58%;
      z-index: -1;
      width: 150px;
      img {
        width: 100%;
      }
    }
    .text-back-icon {
      position: absolute;
      top: 15%;
      left: 0;
      z-index: -1;
    }
    .arrow-icon {
      position: absolute;
      top: 65%;
      left: 20%;
      z-index: -1;
      width: 150px;
      img {
        width: 100%;
      }
    }
    .round-lines-icon {
      position: absolute;
      bottom: -30%;
      left: 1%;
      z-index: -1;
    }
  }
}
</style>
