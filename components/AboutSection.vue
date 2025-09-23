<script setup></script>

<template>
  <div class="container-fluid py-5 mb-5">
    <div class="container pt-4">
      <div class="row">
        <div
          class="col-12 d-flex flex-column gap-4 align-items-center justify-content-center mb-3 mb-lg-5"
        >
          <div class="section-title">
            <h2>What is Trendy Trades?</h2>
            <span class="text-back-icon">
              <img src="../assets/images/about-section-icon.svg" alt="" />
            </span>
          </div>
          <p class="mb-0 text-center">
            Support independent creators There’s no Etsy warehouse – just
            millions of people selling the things they love. We make the whole
            process easy, helping you connect directly with makers to find
            something extraordinary.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.container-fluid {
  background-color: rgba(165, 182, 141, 0.5);
  .section-title {
    position: relative;
    h2 {
        position: relative;
      font-size: 130%;
      font-weight: 700;
      margin: 0;
      z-index: 2;
      color: var(--text-primary-color);
      @media (min-width: 992px) {
        font-size: 200%;
      }
    }
    .text-back-icon {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
      width: 100%;
      img {
        width: 100%;
      }
    }
  }
  p {
      font-size: 100%;
      margin: 0;
      font-weight: 300;
      line-height: 1.4;
      color: var(--text-primary-color);
      @media (min-width: 992px) {
        font-size: 130%;
        width: 50%;
      }
    }
}
</style>
