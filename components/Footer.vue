<script setup>
import { ref } from "vue";
import { usePageContext } from "../renderer/usePageContext";
import * as langauges from "../languages/index";
import Link from "../renderer/Link.vue";

const pageContext = usePageContext();
const phrases = langauges.getPhrases(pageContext.data.lng);
// const categories = ref(pageContext.data.storeCategory.childs);
function scrollTop() {
  window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
}
</script>

<template>
  <footer class="footer">
    <div>
      <div class="footer-wrapper container pt-5 px-1 px-sm-4 px-lg-5">
        <div class="container-fluid pt-3 pt-lg-5 px-lg-5">
          <div class="row">
            <div class="col-12 mb-2 mb-lg-4">
              <div class="row">
                <div class="col-12 col-sm-8 col-lg-5">
                  <p class="footer-description">
                    {{ phrases.footer.title.first }}
                    <span class="d-block color">{{ phrases.footer.title.second }}</span>
                    <span class="d-block">{{ phrases.footer.title.third }}</span>
                    {{ phrases.footer.title.forth }}
                  </p>
                </div>

                <!-- follow us display in desktop -->
                <div class="col-6 pt-4 mb-5 mb-lg-0 col-lg-2 ps-4">
                  <div class="row">
                    <div class="col-12">
                      <p class="footer-list-title">{{ phrases.footer.linksTitles.sell }}</p>
                    </div>
                    <div class="col-6 col-sm-12">
                      <ul class="list">
                        <li class="list-items"><Link href="/cart"> {{ phrases.footer.linksItem.shoppingCart }}</Link></li>
                        <li class="list-items">
                          <Link href="/store"> {{ phrases.footer.linksItem.store }}</Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div class="col-6 pt-4 mb-5 mb-lg-0 col-lg-2 ps-4">
                  <div class="row">
                    <div class="col-12">
                      <p class="footer-list-title">{{ phrases.footer.linksTitles.category }}</p>
                    </div>
                    <div class="col-6 col-sm-12">
                      <ul class="list">
                        <li
                          class="list-items"
                        >
                          <Link href="/store/women">
                            <span>{{ phrases.footer.linksItem.women }}</span>
                          </Link>
                        </li>
                        <li
                          class="list-items"
                        >
                          <Link href="/store/men">
                            <span>{{ phrases.footer.linksItem.men }}</span>
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div class="col-12 pt-lg-4 mb-5 mb-lg-0 col-lg-3 ps-4">
                  <div class="row">
                    <div class="col-12">
                      <p class="footer-list-title">{{ phrases.footer.linksTitles.quickAccess }}</p>
                    </div>
                    <div class="col-12">
                      <ul class="list">
                        <li class="list-items"><Link href="/"> {{ phrases.footer.linksItem.home }}</Link></li>
                        <li class="list-items">
                          <Link href="/account"> {{ phrases.footer.linksItem.account }}</Link>
                        </li>
                        <li class="list-items">
                          <Link href="/about"> {{ phrases.footer.linksItem.aboutUs }} </Link>
                        </li>
                        <li class="list-items">
                          <Link href="/contact"> {{ phrases.footer.linksItem.contactUs }}</Link>
                        </li>
                        <li class="list-items">
                          <Link href="/terms"> {{ phrases.footer.linksItem.termsConditions }}</Link>
                        </li>
                        <li class="list-items">
                          <Link href="/privacy"> {{ phrases.footer.linksItem.privacyPolicy }}</Link>
                        </li>
                        <li class="list-items">
                          <Link href="/refund"> {{ phrases.footer.linksItem.refundPolicy }}</Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
.footer {
  background-color: var(--primary-color);
  border-radius: 100px 100px 0 0;
  color: var(--text-primary-color);
  @media (min-width: 992px) {
    border-radius: 50% 50% 0 0;
  }
  .footer-wrapper {
    .text-en {
      font-family: "amiri";
    }
    .buttom-icons {
      width: 24px;
    }
    .footer-description {
      font-size: 200%;
      text-align: center;
      padding: 5px 0;
      color: white;
      line-height: 1.2;
      .color {
        color: var(--text-primary-color);
      }
      @media (min-width: 992px) {
        text-align: start;
        font-size: 290%;
      }
    }

    .follow-text {
      color: var(--text-primary-color);
      font-size: 100%;
      font-weight: bold;
    }
    button {
      border: 1px solid var(--border-card-color);
      height: 30px;
      width: 30px;
      text-align: center;
      transform: rotate(90deg);
    }
    .social-icon {
      height: 32px;
    }

    // h5 {
    //   color: var(--third-color);
    //   font-weight: 700;
    //   font-size: 18px;
    // }
    .footer-list-title {
      color: #fff;
      font-weight: bold;
      font-size: 130%;
      margin-bottom: 1.5rem;
    }
    .list {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 0;
    }

    a:link,
    a:visited {
      color: #fff;
      text-decoration: none;
      font-size: 100%;
      font-weight: normal;
      cursor: pointer;
    }
    .list-items {
      margin-bottom: 10px;
    }
    .copy-right-wrapper {
      padding-top: 10px;
      border-top: 1px solid var(--border-card-color);
      p {
        color: var(--text-secondary-color);
        font-size: 14px;
        margin: 0;
      }
    }
    ul,
    ol {
      padding-right: 0;
    }
    .footer-logo {
      height: 24px;
    }
    .line {
      padding: 0 16px;
      height: 1px;
      flex: 1;
      background-color: #dcdcdc;
    }
  }
}
</style>
