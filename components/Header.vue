<script setup>
import { ref } from "vue";
import CartSidebar from "./CartSideBar.vue";
import { usePageContext } from "../renderer/usePageContext";
import axios from "axios";
import config from "../config.json";
import Search from "./Search.vue";
import DesktopSearch from "./DesktopSearch.vue";
import * as langauges from "../languages/index";
import Link from "../renderer/Link.vue";

const isSearchOpen = ref(false);
const isActive = ref(false);
const isShowCategories = ref(false);
const isShowProducts = ref(false);
const isShowLanguages = ref(false);
const pageContext = usePageContext();
const phrases = langauges.getPhrases(pageContext.data.lng);

const cartSidebar = ref(null);
const cartSidebarOverlay = ref(null);

const openCartSidebar = () => {
  cartSidebar.value.style.transform = "translateX(0)";
  cartSidebarOverlay.value.style.display = "block";
};

function toggleMobileMenu() {
  isActive.value = !isActive.value;
  if (isActive.value) {
    window.document.body.classList.add("modal-open");
    window.document.querySelector(".back").classList.add("overlay");
  } else {
    isShowCategories.value = false;
    window.document.body.classList.remove("modal-open");
    window.document.querySelector(".back").classList.remove("overlay");
  }
}
function toggleIsShowCategories() {
  isShowCategories.value = !isShowCategories.value;
}
const changeLng = (href) => {
  window.location.href = href;
};

// // js sticky header
import { onMounted, onBeforeUnmount } from "vue";

const isSticky = ref(false);

const handleScroll = () => {
  isSticky.value = window.scrollY > 0;
};

const showCall = ref(false);

const showCallToggle = () => {
  showCall.value = !showCall.value;
  console.log(showCall.value);
};

// const categories = ref(pageContext.data.storeCategory.childs);

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
  cartSidebar.value = document.getElementById("cart-menu-container");
  cartSidebarOverlay.value = document.getElementById("cart-menu-overlay");
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<template>
  <div class="header-container" id="header" :class="{ sticky: isSticky }">
    <div class="header-wrapper">
      <header
        class="d-flex flex-lg-column justify-content-between align-items-center"
      >
        <div
          class="d-flex w-100 justify-content-between align-items-center px-2 px-lg-5"
        >
          <div class="d-flex d-lg-none align-items-center gap-2">
            <button class="hm-menu" @click="toggleMobileMenu">
              <img
                src="../assets/images/humbergar-menu.svg"
                alt="hamberger-menu"
              />
            </button>
            <div class="d-flex align-items-center">
              <div class="dropdown language-selector">
                <button
                  class="language-button dropdown-toggle"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  @click="isShowLanguages = !isShowLanguages"
                >
                  <img
                    class="menu-icon"
                    src="../assets/images/language.svg"
                    style="width: 35px; height: 35px"
                  />
                </button>
                <ul
                  class="language-dropdown dropdown-menu d-block text-center"
                  v-if="isShowLanguages"
                >
                  <li>
                    <div class="dropdown-item curser" @click="changeLng('/')">
                      {{ phrases.header.english }}
                    </div>
                  </li>
                  <li>
                    <div class="dropdown-item curser" @click="changeLng('/ar')">
                      {{ phrases.header.arabic }}
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <Link class="header-logo-container" href="/">
            <img
              class="header-logo m-0"
              src="./../assets/images/tt-logo-brown.png"
              alt="trendy-trades"
            />
          </Link>

          <div class="d-none d-lg-block desktop-search-wrapper">
            <DesktopSearch />
          </div>

          <div class="d-flex gap-2 align-items-center">
            <div class="d-none d-lg-flex align-items-center">
              <div class="dropdown language-selector">
                <button
                  class="language-button dropdown-toggle"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  @click="isShowLanguages = !isShowLanguages"
                >
                  <img
                    class="menu-icon"
                    src="../assets/images/language.svg"
                    style="width: 35px; height: 35px"
                  />
                </button>
                <ul
                  class="language-dropdown dropdown-menu d-block text-center"
                  v-if="isShowLanguages"
                >
                  <li>
                    <div class="dropdown-item curser" @click="changeLng('/')">
                      {{ phrases.header.english }}
                    </div>
                  </li>
                  <li>
                    <div class="dropdown-item curser" @click="changeLng('/ar')">
                      {{ phrases.header.arabic }}
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <Link href="/cart">
              <img
                class="mx-lg-1"
                src="../assets/images/shopping-bag.svg"
                style="height: 28px"
                alt="shopping_basket"
              />
            </Link>
            <Link
              class="desktop-account-button d-none d-lg-block px-3 py-2"
              href="/account"
            >
              {{ phrases.header.menu.account }}
            </Link>
            <button class="d-lg-none" @click="isSearchOpen = true">
              <img
                src="../assets/images/search-icon.svg"
                style="height: 28px"
                alt=""
              />
            </button>
          </div>

          <div class="back d-none" @click="toggleMobileMenu"></div>

          <div :class="{ active: isActive }" class="mobile-menu">
            <!-- modal img  -->
            <Link href="/">
              <img
                class="header-logo-menu mb-4"
                src="./../assets/images/tt-logotext.png"
                alt="trendy-trades"
              />
            </Link>

            <!-- accocunt  -->
            <Link
              href="/account"
              class="cta d-flex gap-2 align-items-center justify-content-center py-3 px-4"
              @click="toggleMobileMenu"
            >
              <i class="fa-solid fa-user-vneck"></i>
              <span>{{ phrases.header.menu.account }}</span>
            </Link>
            <div v-if="!isShowCategories && !isShowProducts" dir="rtl">
              <!-- links -->
              <Link
              :class=" pageContext.data.lng == 'en' ? 'flex-row-reverse' : 'flex-row'"
                class="d-flex align-items-center border-bottom pb-3 gap-3 mb-2"
                href="/"
                @click="toggleMobileMenu"
              >
                <img src="../assets/images/home-b.svg" alt="" />
                <span>{{ phrases.header.menu.home }}</span>
              </Link>
              <div
              :class=" pageContext.data.lng == 'en' ? 'flex-row-reverse' : 'flex-row'"
                class="d-flex align-items-center border-bottom pb-3 gap-3 mb-2 curser"
                @click="toggleIsShowCategories"
              >
                <i class="fa-solid fa-bag-shopping menu-icon"></i>
                <span>{{ phrases.header.menu.store }}</span>
              </div>

              <Link
              :class=" pageContext.data.lng == 'en' ? 'flex-row-reverse' : 'flex-row'"
                class="d-flex align-items-center border-bottom pb-3 gap-3 mb-2"
                href="/blog"
                @click="toggleMobileMenu"
              >
                <img src="../assets/images/pencil-fill.svg" alt="" />
                <span> {{ phrases.header.menu.blog }}</span>
              </Link>
              <Link
              :class=" pageContext.data.lng == 'en' ? 'flex-row-reverse' : 'flex-row'"
                class="d-flex align-items-center border-bottom pb-3 gap-3 mb-2"
                href="/about"
                @click="toggleMobileMenu"
              >
                <img src="../assets/images/info-circle-b.svg" alt="" />
                <span>{{ phrases.header.menu.aboutUs }}</span>
              </Link>
              <Link
              :class=" pageContext.data.lng == 'en' ? 'flex-row-reverse' : 'flex-row'"
                class="call-us d-flex align-items-center border-bottom pb-3 gap-3"
                href="/contact"
                @click="toggleMobileMenu"
              >
                <img src="../assets/images/telephone-b.svg" alt="" />
                <span> {{ phrases.header.menu.contactUs }}</span>
              </Link>

              <!-- email  -->

              <a
                target="_blank"
                href="info@trendytrades.io"
                class="email-info d-block"
                @click="toggleMobileMenu"
              >
                <img class="me-2" src="./../assets/images/mail-b.svg" alt="" />
                <span>info@trendytrades.io</span>
              </a>

              <!-- social media  -->

              <a href="#" target="_blank" @click="toggleMobileMenu">
                <img
                  class="soical-icon-mobile me-2"
                  src="../assets/images/whatsapp.svg"
                  alt="whatsapp"
                />
              </a>
              <a href="#" target="_blank" @click="toggleMobileMenu">
                <img
                  class="soical-icon-mobile me-2"
                  src="../assets/images/telegram-b.svg"
                  alt="telegram"
                />
              </a>
              <a href="#" target="_blank" @click="toggleMobileMenu">
                <img
                  class="soical-icon-mobile me-2"
                  src="../assets/images/instagram.svg"
                  alt="instagram"
                />
              </a>
              <a href="#" target="_blank" @click="toggleMobileMenu">
                <img
                  class="soical-icon-mobile"
                  src="../assets/images/linkedin-black.svg"
                  alt="linkedin"
                />
              </a>
            </div>

            <div v-if="isShowCategories" dir="rtl">
              <Link
              :class=" pageContext.data.lng == 'en' ? 'flex-row-reverse' : 'flex-row'"
                class="d-flex align-items-center border-bottom pb-3 gap-3 mb-2"
                href="/store/women"
                @click="toggleMobileMenu"
              >
                <i class="fa-regular fa-clothes-hanger"></i>
                <span>{{ phrases.header.menu.women }}</span>
              </Link>
              <Link
              :class=" pageContext.data.lng == 'en' ? 'flex-row-reverse' : 'flex-row'"
                class="d-flex align-items-center border-bottom pb-3 gap-3 mb-2"
                href="/store/men"
                @click="toggleMobileMenu"
              >
                <i class="fa-regular fa-clothes-hanger"></i>
                <span>{{ phrases.header.menu.men }}</span>
              </Link>

              <button class="btn-back py-2" @click="toggleIsShowCategories">
                {{ phrases.header.btnBack }}
              </button>
            </div>
          </div>
        </div>
        <ul
          class="top-menu py-3 w-100 px-lg-5 d-none d-lg-flex align-items-center"
        >
          <li class="dropdown">
            <span class="main-item"> {{ phrases.header.category }} </span>
            <img src="./../assets/images/down.svg" alt="" />

            <div class="sub-menu sub-menu-p">
              <div class="sub-menu-body d-flex">
                <div class="border-r">
                  <div class="blur-mode"></div>
                </div>

                <!-- <a
                  class="box"
                  v-for="(category, index) in categories"
                  :key="index"
                  :href="`/store/${category.slug}`"
                >
                  <div class="menu-item-icon">
                    <img
                      v-if="category.coverFile"
                      class="normal-icon"
                      :src="category.coverFile"
                      alt=""
                    />
                  </div>
                  <div class="menu-item-titles">
                    <div class="menu-item-fa mb-2">{{ category.nameLong }}</div>
                    <div class="menu-item-en">Trendy-Trades category</div>
                  </div>
                </a> -->
                <Link href="/store/women" class="box">
                  <div class="menu-item-icon">
                    <img
                      class="normal-icon"
                      src="./../assets/images/women-clothes.png"
                      alt=""
                    />
                  </div>
                  <div class="menu-item-titles">
                    <div class="menu-item-fa mb-1">
                      {{ phrases.header.menu.women }}
                    </div>
                    <div class="menu-item-en">
                      {{ phrases.header.menu.onlineShop }}
                    </div>
                  </div>
                </Link>
                <Link href="/store/men" class="box">
                  <div class="menu-item-icon">
                    <img
                      class="normal-icon"
                      src="./../assets/images/man-clothing.png"
                      alt=""
                    />
                  </div>
                  <div class="menu-item-titles">
                    <div class="menu-item-fa mb-1">
                      {{ phrases.header.menu.men }}
                    </div>
                    <div class="menu-item-en">
                      {{ phrases.header.menu.onlineShop }}
                    </div>
                  </div>
                </Link>
                <!-- <a href="/store/kids" class="box">
                  <div class="menu-item-icon">
                    <img class="normal-icon" src="./../assets/images/kids-dress.png" alt="" />
                  </div>
                  <div class="menu-item-titles">
                    <div class="menu-item-fa mb-1">Kids</div>
                    <div class="menu-item-en">Online Shop</div>
                  </div>
                </a> -->
              </div>
            </div>
          </li>

          <li>
            <Link class="main-item" href="/blog">
              {{ phrases.header.menu.blog }}
            </Link>
          </li>
          <li>
            <Link class="main-item" href="/about">{{
              phrases.header.menu.aboutUs
            }}</Link>
          </li>
          <li>
            <Link class="main-item" href="/contact">{{
              phrases.header.menu.contactUs
            }}</Link>
          </li>
        </ul>
      </header>
    </div>
  </div>
  <Search @close-search="isSearchOpen = false" v-if="isSearchOpen" />
  <CartSidebar />
</template>

<style lang="scss" scoped>
#header {
  background-color: var(--secondary-color);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  transition: all 0.3s ease;
}

.curser {
  cursor: pointer;
}
.sticky {
  backdrop-filter: blur(10px);
  box-shadow: 0px 1px 5px 0px rgba(191, 191, 191, 0.75);
  -webkit-box-shadow: 0px 1px 5px 0px rgba(191, 191, 191, 0.75);
  -moz-box-shadow: 0px 1px 5px 0px rgba(191, 191, 191, 0.75);
  .top-menu {
    // transform: translateY(-100%) !important;
    transition: all 0.3s ease;
    opacity: 0;
  }
}

.header-wrapper {
  header {
    height: 60px;

    .top-menu {
      gap: 1.75rem;
      position: relative;
      background-color: #fcfaee;
      border-bottom: 1px solid var(--border-divider-color);

      .main-item {
        font-size: 100%;
        color: var(--text-primary-color);
        font-weight: normal;
        cursor: pointer;
      }
    }

    .dropdown:hover {
      .sub-menu {
        display: block;
        visibility: visible;
      }
    }
    // .sub-menu {
    //   display: none;
    //   visibility: hidden;
    //   width: 100px;
    //   position: absolute;
    //   top: 7px;
    //   left: -30px;
    //   z-index: 4;
    //   padding-top: 20px;
    //   transform: translate(32%, 0);

    //   .sub-menu-body {
    //     position: relative;
    //     display: flex;
    //     flex-wrap: wrap;
    //     width: 100%;
    //     border-radius: var(--border-radius-md);
    //     background: var(--background-primary-color);

    //     .border-r {
    //       position: absolute;
    //       top: 0;
    //       right: 0;
    //       width: 100%;
    //       height: 100%;
    //       border-radius: 20px;
    //       z-index: -1;
    //       overflow: hidden;

    //       .blur-mode {
    //         position: absolute;
    //         top: -50px;
    //         right: -50px;
    //         left: -50px;
    //         bottom: -50px;
    //         backdrop-filter: blur(8px);
    //       }
    //     }

    //     .box {
    //       display: flex;
    //       align-items: center;
    //       width: 100%;
    //       height: 45px;
    //       border-radius: var(--border-radius-lg);
    //       transition: all 0.3s ease-in-out;
    //       .normal-icon {
    //         height: 40px;
    //       }
    //       &:hover {
    //         background-color: rgba(27, 27, 27, 0.07);
    //       }
    //       .menu-item-icon {
    //         height: 50px;
    //         width: 50px;
    //         display: flex;
    //         align-items: center;
    //         img {
    //           width: 100%;
    //         }
    //       }
    //       .menu-item-fa {
    //         font-size: 14px;
    //         font-weight: 600;
    //         color: var(--text-primary-color);
    //       }
    //       .menu-item-en {
    //         font-family: "mona";
    //         font-size: 14px;
    //         font-weight: 400;
    //         letter-spacing: 1.1;
    //         color: #979797;
    //       }
    //     }
    //   }
    // }
    .sub-menu {
      // filter: blur(8px);
      display: none;
      visibility: hidden;
      width: 505px;
      position: absolute;
      top: 10px;
      left: -165px;
      z-index: 4;
      padding-top: 20px;
      transform: translate(32%, 0);

      .sub-menu-body {
        position: relative;
        display: flex;
        gap: 24px;
        flex-wrap: wrap;
        width: 100%;
        border-radius: var(--border-radius-lg);
        padding: 28px 39px;
        background: rgba(255, 255, 255, 0.8);
        backdrop-filter: blur(6px);
        box-shadow: 0px 1px 5px 0px rgba(191, 191, 191, 0.75);
        -webkit-box-shadow: 0px 1px 5px 0px rgba(191, 191, 191, 0.75);
        -moz-box-shadow: 0px 1px 5px 0px rgba(191, 191, 191, 0.75);

        .border-r {
          position: absolute;
          top: 0;
          right: 0;
          width: 100%;
          height: 100%;
          border-radius: 20px;
          z-index: -1;
          overflow: hidden;

          .blur-mode {
            position: absolute;
            top: -50px;
            right: -50px;
            left: -50px;
            bottom: -50px;
            backdrop-filter: blur(8px);
          }
        }

        .box {
          display: flex;
          align-items: center;
          gap: 20px;
          width: 200px;
          height: 80px;
          padding: 17.5px 10px;
          border-radius: var(--border-radius-lg);
          transition: all 0.3s ease-in-out;

          .normal-icon {
            height: 40px;
          }

          &:hover {
            background-color: rgba(27, 27, 27, 0.07);
          }

          .menu-item-icon {
            height: 40px;
            display: flex;
            align-items: center;

            img {
              width: 100%;
            }
          }

          .menu-item-fa {
            font-size: 14px;
            font-weight: 600;
            color: var(--primary-color);
          }

          .menu-item-en {
            font-family: "mona";
            font-size: 14px;
            font-weight: 400;
            letter-spacing: 1.1;
            color: #979797;
          }
        }
      }
    }

    .hm-menu {
      z-index: 999;
    }

    .header-logo-container {
      text-decoration: none;
      color: var(--secondary-color);
    }

    .header-logo {
      height: 24px;
      // @media (min-width: 992px) {
      //   height: 28px;
      // }
    }
    .header-logo-menu {
      height: 45px;
    }

    .cta:link,
    .cta:visited {
      background-color: var(--secondary-color);
      color: var(--third-color);
      font-size: 100%;
      font-weight: bold;
      border-radius: var(--border-radius-md);
      padding: 12px 24px;
    }
  }

  .overlay {
    position: fixed;
    display: block !important;
    width: 100%;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.3);
    top: 0;
    left: 0;
  }

  .mobile-menu {
    // direction: ltr;
    overflow-y: scroll;
    border-radius: var(--border-radius-xl);
    z-index: 1001;
    position: fixed;
    display: block;
    width: 280px;
    height: 100vh;
    padding: 40px 45px 20px 45px;
    text-align: center;
    background-color: white;
    top: 0;
    right: 0;
    transform: translateX(100%);
    transition: all 0.5s ease-in-out;

    .soical-icon-mobile {
      width: 32px;
      height: 32px;
    }

    .btn-back {
      font-size: 100%;
      color: var(--secondary-color);
      border: 1px solid var(--secondary-color);
      border-radius: var(--border-radius-md);
      width: 100%;
      padding: 7px 24px;
      margin-top: 20px;
      margin-bottom: 3rem;
    }

    .modal-logo {
      max-width: 188px;
    }

    .call-us {
      margin-bottom: 64px;
    }

    .email-info {
      margin-bottom: 22px;
    }

    a {
      color: #0e0f0e;
      text-decoration: none;
    }
  }

  .active {
    transform: translateX(0);
    display: block;
  }

  .mobile-menu {
    .header-logo {
      margin-bottom: 24px;
      max-width: 190px;
    }

    .cta {
      margin-bottom: 32px;
    }
  }
  .desktop-search-wrapper {
    position: relative;
    width: 60%;
  }
  .desktop-account-button {
    border: 1px solid var(--background-color);
    color: var(--text-primary-color);
    border-radius: var(--border-radius-xl);
  }
}

.menu-icon {
  width: 20px;
  height: 20px;
}
.language-dropdown {
  // position: absolute;
  // background-color: white;
  // box-shadow: 0px 1px 5px 0px rgba(191, 191, 191, 0.75);
  // border-radius: var(--border-radius-md);
  left: -107%;
  min-width: 100px;
  top: 137%;
}
</style>
