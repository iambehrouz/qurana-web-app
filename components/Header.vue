<script setup>
import { ref, watch } from "vue";
import { usePageContext } from "../renderer/usePageContext";
import axios from "axios";
import config from "../config.json";
import * as langauges from "../languages/index";
import Link from "../renderer/Link.vue";

const isActive = ref(false);
const isShowCategories = ref(false);
const isShowProducts = ref(false);
const isShowLanguages = ref(false);
const pageContext = usePageContext();
const user = ref(pageContext.data.user);
const phrases = langauges.getPhrases(pageContext.data.lng);

watch(
  () => pageContext.data.user,
  () => {
    user.value = pageContext.data.user;
  }
);

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
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<template>
  <div class="header-container" id="header" :class="{ sticky: isSticky }">
    <div class="header-wrapper w-100 p-0">
      <header
        class="d-flex flex-lg-column justify-content-between align-items-center"
      >
        <div
          class="header-content h-100 d-flex w-100 align-items-center justify-content-between"
        >
          <!-- Mobile hamburger menu -->
          <div class="d-flex d-lg-none align-items-center header-left">
            <button class="hm-menu" @click="toggleMobileMenu">
              <img
                src="../assets/images/humbergar-menu.svg"
                alt="hamberger-menu"
              />
            </button>
          </div>

          <!-- Desktop menu links -->
          <div class="d-none d-lg-flex align-items-center desktop-menu-links">
            <Link class="desktop-menu-link" href="/">
              {{ phrases.header.menu.home }}
            </Link>
            <!-- <Link class="desktop-menu-link" href="/blog">
              {{ phrases.header.menu.blog }}
            </Link> -->
            <Link class="desktop-menu-link" href="/about">
              {{ phrases.header.menu.aboutUs }}
            </Link>
            <Link class="desktop-menu-link" href="/contact">
              {{ phrases.header.menu.contactUs }}
            </Link>
          </div>

          <Link
            class="header-logo-container d-flex justify-content-center"
            href="/"
          >
            <img
              class="header-logo m-0"
              src="./../assets/images/qurana-logo.svg"
              alt="Qurana"
            />
          </Link>

          <div
            class="d-flex gap-2 justify-content-end align-items-center header-right"
          >
            <div class="d-none d-lg-flex align-items-center">
              <div class="dropdown language-selector">
                <button
                  class="language-button p-1 dropdown-toggle"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  @click="isShowLanguages = !isShowLanguages"
                >
                  <img
                    class="menu-icon"
                    src="../assets/images/language.svg"
                    style="width: 20px; height: 20px"
                  />
                </button>
                <ul
                  class="language-dropdown dropdown-menu d-block text-center"
                  v-if="isShowLanguages"
                >
                  <li>
                    <div class="dropdown-item curser" @click="changeLng('/')">
                      {{ phrases.header.french }}
                    </div>
                  </li>
                  <li>
                    <div class="dropdown-item curser" @click="changeLng('/en')">
                      {{ phrases.header.english }}
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <!-- <Link href="/cart">
              <img
                class="mx-lg-1"
                src="../assets/images/shopping-bag.svg"
                style="height: 28px"
                alt="shopping_basket"
              />
            </Link> -->
            <div class="d-flex align-items-center d-lg-none">
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
                    style="width: 16px; height: 16px"
                  />
                </button>
                <ul
                  class="language-dropdown dropdown-menu d-block text-center"
                  v-if="isShowLanguages"
                >
                  <li>
                    <div class="dropdown-item curser" @click="changeLng('/')">
                      {{ phrases.header.french }}
                    </div>
                  </li>
                  <li>
                    <div class="dropdown-item curser" @click="changeLng('/en')">
                      {{ phrases.header.english }}
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <Link class="d-lg-none language-button" href="/account">
              <img
                src="../assets/images/header-user.svg"
                style="height: 16px"
                alt=""
              />
            </Link>
            <Link class="d-none d-lg-flex language-button" href="/account">
              <img
                src="../assets/images/header-user.svg"
                style="height: 20px"
                alt=""
              />
            </Link>
          </div>

          <div class="back d-none" @click="toggleMobileMenu"></div>

          <div :class="{ active: isActive }" class="mobile-menu pt-5">
            <!-- modal img  -->
            <Link href="/" v-if="!user" class="header-logo-menu-container d-flex align-items-center justify-content-center mb-4 pb-4 mt-5">
              <img
                class="header-logo-menu"
                src="./../assets/images/qurana-logo-primary.svg"
                alt="Qurana"
              />
            </Link>

            <!-- accocunt  -->
            <!-- <Link
              href="/account"
              class="cta d-flex gap-2 align-items-center justify-content-center py-3 px-4"
              @click="toggleMobileMenu"
            >
              <i class="fa-solid fa-user-vneck"></i>
              <span>{{ phrases.header.menu.account }}</span>
            </Link> -->
            <div v-if="user"
              class="profile-user d-flex align-items-center justify-content-center mb-3 mt-5"
            >
              <i class="fa-solid fa-user-vneck"></i>
            </div>
            <div v-if="user && user.fullname" class="profile-name pb-4 mb-4">
              <h1>{{ user.fullname }}</h1>
            </div>

            <div dir="rtl">
              <!-- links -->
              <Link
                class="d-flex align-items-center pb-3 gap-3 mb-2 flex-row-reverse"
                href="/account"
                @click="toggleMobileMenu"
              >
                <i class="fa-solid fa-user-vneck"></i>
                <span>{{ user ? phrases.header.menu.profile : phrases.header.menu.signInUp }}</span>
              </Link>
              <Link
                class="d-flex align-items-center pb-3 gap-3 mb-2 flex-row-reverse"
                href="/"
                @click="toggleMobileMenu"
              >
                <img src="../assets/images/home-b.svg" alt="" />
                <span>{{ phrases.header.menu.home }}</span>
              </Link>

              <!-- <Link
                class="d-flex align-items-center pb-3 gap-3 mb-2 flex-row-reverse"
                href="/blog"
                @click="toggleMobileMenu"
              >
                <img src="../assets/images/pencil-fill.svg" alt="" />
                <span> {{ phrases.header.menu.blog }}</span>
              </Link> -->
              <Link
                class="d-flex align-items-center pb-3 gap-3 mb-2 flex-row-reverse"
                href="/about"
                @click="toggleMobileMenu"
              >
                <img src="../assets/images/info-circle-b.svg" alt="" />
                <span>{{ phrases.header.menu.aboutUs }}</span>
              </Link>
              <Link
                class="call-us d-flex align-items-center pb-3 gap-3 flex-row-reverse"
                href="/contact"
                @click="toggleMobileMenu"
              >
                <img src="../assets/images/telephone-b.svg" alt="" />
                <span> {{ phrases.header.menu.contactUs }}</span>
              </Link>

              <!-- email  -->

              <!-- <a
                target="_blank"
                href="info@trendytrades.io"
                class="email-info d-block"
                @click="toggleMobileMenu"
              >
                <img class="me-2" src="./../assets/images/mail-b.svg" alt="" />
                <span>info@trendytrades.io</span>
              </a> -->

              <!-- social media  -->

              <!-- <a href="#" target="_blank" @click="toggleMobileMenu">
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
              </a> -->
            </div>
          </div>
        </div>
      </header>
    </div>
  </div>
</template>

<style lang="scss" scoped>
#header {
  background-color: var(--secondary-color);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100% !important;
  margin: 0;
  padding: 0;
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
  position: relative;
  width: 100% !important;
  margin: 0;
  padding: 0;
  header {
    height: 44px;
    width: 100% !important;
    // @media (min-width: 992px) {
    //   height: 50px;
    // }

    .header-content {
      width: 100% !important;
      padding: 0 15px;
      position: relative;
      margin: 0;

      @media (min-width: 992px) {
        padding: 0 2rem;
        justify-content: space-between;
      }
    }

    .header-left {
      width: 60px;
      flex-shrink: 0;
      @media (min-width: 992px) {
        display: none;
      }
    }

    .desktop-menu-links {
      gap: 2rem;
      flex: 1;
      justify-content: flex-start;
    }

    .desktop-menu-link {
      color: var(--third-color);
      text-decoration: none;
      font-weight: 500;
      font-size: 100%;
      transition: color 0.3s ease;

      &:hover {
        color: var(--primary-color);
        text-decoration: none;
      }
    }

    .header-right {
      width: 60px;
      flex-shrink: 0;
      @media (min-width: 992px) {
        width: unset;
        flex-shrink: 0;
      }
    }

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
            font-family: "amiri";
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
      display: flex;
      justify-content: center;
      align-items: center;

      @media (max-width: 991px) {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
      }

      @media (min-width: 992px) {
        flex: 0 0 auto;
        margin: 0 2rem;
      }
    }

    .header-logo {
      height: 20px;
      // @media (min-width: 992px) {
      //   height: 28px;
      // }
    }
    .header-logo-menu {
      height: 30px;
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
    left: 0;
    transform: translateX(-100%);
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
    .profile-user {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(180deg, #72227d 0%, #ffa958 100%);
      font-size: 140%;
      color: #fff;
      text-align: center;
    }
    .profile-name {
      text-align: left;
      h1 {
        font-size: 100%;
        color: #000;
        font-weight: 800;
      }
      border-bottom: 1px solid var(--secondary-color);
    }
    .header-logo-menu-container {
      border-bottom: 1px solid var(--secondary-color);
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
  .desktop-account-button {
    border: 1px solid var(--background-color);
    color: var(--text-primary-color);
    border-radius: var(--border-radius-xl);
    background-color: transparent;
    transition: all 0.3s ease;

    &:hover {
      background-color: var(--primary-color);
      color: var(--third-color);
      border-color: var(--primary-color);
    }
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
.language-button {
  background-color: #fff;
  border-radius: 5px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  @media (min-width: 992px) {
    width: 28px;
    height: 28px;
  }
}

/* Ensure header takes full width and overrides Bootstrap grid constraints */
#header {
  width: 100% !important;
  max-width: 100% !important;
}

#header .header-wrapper {
  width: 100% !important;
  max-width: 100% !important;
}

#header header {
  width: 100% !important;
  max-width: 100% !important;
}

#header .header-content {
  width: 100% !important;
  max-width: 100% !important;
}
</style>
