<script setup>
import { ref } from "vue";
import { usePageContext } from "../renderer/usePageContext";
import * as langauges from "../languages/index";
import Link from "../renderer/Link.vue";

const pageContext = usePageContext();
const phrases = langauges.getPhrases(pageContext.data.lng);
function scrollTop() {
  window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
}
</script>

<template>
  <footer class="footer py-2" id="footer-wrapper">
    <div>
      <div class="footer-wrapper container px-1 px-sm-4 px-lg-5">
        <div class="container-fluid pt-3 py-lg-2 px-lg-5">
          <div class="row">
            <div class="col-12">
              <p>{{ phrases.footer.rules }}</p>
            </div>
            <div class="col-12">
              <h1>{{ phrases.footer.rights }}</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer-icon-text d-lg-none">
      <p>{{ phrases.footer.join }}</p>
    </div>
    <a class="footer-icon p-1 instagram">
      <img
        src="../assets/images/instagram-icon.svg"
        alt="footer-icon"
        height="15"
      />
    </a>
    <a class="footer-icon p-1 facebook">
      <img
        src="../assets/images/facebook-icon.svg"
        alt="footer-icon"
        height="15"
      />
    </a>
    <a class="footer-icon p-1 linkedin">
      <img
        src="../assets/images/linkedin-icon.svg"
        alt="footer-icon"
        height="15"
      />
    </a>
    <a class="footer-icon p-1 whatsapp">
      <img
        src="../assets/images/whatsapp-icon.svg"
        alt="footer-icon"
        height="15"
      />
    </a>
  </footer>
</template>

<style lang="scss" scoped>
.darkFooter {
    background-image: url(../assets/images/footer-shape-dark.svg) !important;
    p{
      // display: none !important;
      color: #fff !important;
    }
    h1{
      // margin-top: 15px;
      // margin-bottom: 10px !important;
      color: #fff !important;
    }
    .footer-icon {
      background-color: #72227D !important;
      img {
        filter: brightness(0) invert(1);
      }
    }
    .footer-icon-text {
      p {
        color: #72227D !important;
      }
    }
  }
#footer-wrapper {
  margin-top: -66px;
  background-image: url(../assets/images/footer-shape.svg);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  // border-radius: 100px 100px 0 0;
  color: var(--text-primary-color);
  @media (min-width: 992px) {
    border-radius: 50% 50% 0 0;
    margin-top: -38px;
  }
  .footer-wrapper {
    .text-en {
      font-family: "amiri";
    }
    p {
      color: var(--secondary-color);
      font-size: 90%;
      font-weight: 200;
      text-align: center;
      margin-bottom: 0;
      @media (min-width: 992px) {
        font-size: 100%;
      }
    }
    h1 {
      color: var(--secondary-color);
      font-size: 90%;
      font-weight: 600;
      text-align: center;
      margin-bottom: 0;
      @media (min-width: 992px) {
        font-size: 100%;
      }
    }
  }
  .footer-icon {
    background-color: #fff;
    position: absolute;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 23px;
    height: 23px;
    @media (min-width: 992px) {
      width: 33px;
      height: 33px;
    }
  }
  .footer-icon-text {
    position: absolute;
    top: -13%;
    right: 36%;
    width: 88px;
    text-align: center;
    p {
      color: #fff;
      font-size: 90%;
    }
  }
  .instagram {
    top: -10%;
    left: 13%;
  }
  .facebook {
    top: -13%;
    left: 23%;
  }
  .linkedin {
    top: -13%;
    right: 23%;
  }
  .whatsapp {
    top: -10%;
    right: 13%;
  }
}
</style>
