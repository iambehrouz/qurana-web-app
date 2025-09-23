<script setup>
import Link from "../renderer/Link.vue";
</script>

<template>
  <div class="container mb-5">
    <div class="row middle-section-wrapper">
      <div
        class="col-12 col-lg-4 d-flex flex-column justify-content-end gap-2 gap-lg-4 px-lg-5"
      >
        <h2>Traveling Bag and Running Shoes</h2>
        <p>
          Get spooky-season picks at scary good prices.Top Picks for You Top
          Picks get spooky-season picks at scary good
        </p>
      </div>
      <div class="col-lg-2"></div>
      <div class="col-12 col-lg-6 image-wrapper">
        <div class="px-4 pt-3 pt-lg-5">
          <img src="../assets/images/middle-section-image.png" alt="" />
        </div>
        <span class="d-none d-lg-block round-lines-icon">
          <img src="../assets/images/middle-section-round-icon.svg" alt="" />
        </span>
        <div class="shop-button">
          <Link class="p-1 p-lg-3 d-flex align-items-center" href="/store">
            <span
              class="p-lg-3 w-100 d-flex align-items-center justify-content-center text-wrap"
              >Shop Now</span
            >
          </Link>
        </div>
      </div>
      <span class="d-none d-lg-block arrow-icon">
        <img src="../assets/images/middle-section-arrow.svg" alt="" />
      </span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.container {
  .middle-section-wrapper {
    position: relative;
    h2 {
      font-size: 100%;
      font-weight: 700;
      margin: 0;
      letter-spacing: 2px;
      line-height: 1.5;
      color: var(--primary-color);
      @media (min-width: 992px) {
        font-size: 200%;
      }
    }
    p {
      font-size: 90%;
      font-weight: 500;
      margin: 0;
      line-height: 1.7;
      text-align: justify;
      color: var(--text-primary-color);
      @media (min-width: 992px) {
        font-size: 120%;
      }
    }
    .image-wrapper {
      position: relative;
      img {
        width: 100%;
      }
      .round-lines-icon {
        position: absolute;
        top: -30px;
        right: 5%;
        z-index: -1;
        width: 90%;
        img {
          width: 100%;
        }
      }
      .shop-button {
        position: absolute;
        bottom: 0;
        right: 0;
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
            width: 140px;
            height: 140px;
          }
        }
        @media (min-width: 992px) {
          bottom: 0;
          left: -50px;
        }
      }
    }
    .arrow-icon {
      position: absolute;
      top: 50%;
      left: 40%;
      z-index: -1;
      width: 100px;
      img {
        width: 100%;
      }
    }
  }
}
</style>
