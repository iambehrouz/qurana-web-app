<script setup>
import { ref, onMounted } from "vue";

import Transactions from "../../../components/Profile/Transactions.vue";

import { usePageContext } from "../../../renderer/usePageContext";
import * as langauges from "../../../languages/index";
import Link from "../../../renderer/Link.vue";

const pageContext = usePageContext();
const user = ref(pageContext.data.user);
const showMobileMenu = ref(false);
const mobileMenu = ref(null);
const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value;
};
const phrases = langauges.getPhrases(pageContext.data.lng);

onMounted(() => {
  mobileMenu.value = document.getElementById("profileMobileMenu");
  if (!user.value) window.location = "/login";
});
</script>
<template>
  <div class="profile-page">
    <div class="container-lg">
      <div class="row" v-if="user">
        <div class="col-12 col-lg-3">
          <div class="p-1">
            <div class="d-lg-none profile-menu-mobile" id="profileMobileMenu">
              <div class="user-info-box border rounded bg-white">
                <div class="user-img border p-1 rounded bg-white">
                  <img src="../../../assets/images/user.png" />
                </div>
                <div class="info-text mb-2">
                  <strong>{{ user.fullname }}</strong>
                </div>
                <div class="info-text">
                  <span>{{ user.phone }}</span>
                </div>

                <!-- <hr class="m-4" />
                  <div class="info-text">
                    <span>khanedaroo@med.com</span>
                  </div> -->
              </div>
              <button
                @click="toggleMobileMenu"
                class="btn w-100 my-3 menu-toggle"
              >
                {{ showMobileMenu ? "close menu" : "show menu" }}
              </button>
              <div
                class="menu-box border rounded bg-white p-3"
                v-show="showMobileMenu"
              >
                <Link
                  href="/account"
                  class="menu-item d-flex align-items-center mb-2"
                >
                  <img src="../../../assets/images/clipboard.png" />
                  <span class="ms-3"> {{ phrases.pages.account.menu.Profile }}</span>
                </Link>
                <hr />
                <Link
                  href="/account/orders"
                  class="menu-item d-flex align-items-center mb-2"
                >
                  <img src="../../../assets/images/orders.png" />
                  <span class="ms-3"> {{ phrases.pages.account.menu.Orders }}</span>
                </Link>
                <hr />
                <Link
                  href="/account/transactions"
                  class="menu-item d-flex align-items-center mb-2"
                >
                  <img src="../../../assets/images/transaction.svg" />
                  <span class="ms-3"> {{ phrases.pages.account.menu.Transactions }}</span>
                </Link>
                <hr />
                <Link
                  href="/account/tickets"
                  class="menu-item d-flex align-items-center mb-2"
                >
                  <img src="../../../assets/images/comment.png" />
                  <span class="ms-3">{{ phrases.pages.account.menu.Tickets }}</span>
                </Link>
                <hr />
                <Link
                  href="/account/favorites"
                  class="menu-item d-flex align-items-center mb-2"
                >
                  <img src="../../../assets/images/clipboard.png" />
                  <span class="ms-3"> {{ phrases.pages.account.menu.Favorites }}</span>
                </Link>
                <hr />
                <a
                  href="/logout"
                  class="menu-item d-flex align-items-center mb-2"
                >
                  <img src="../../../assets/images/logout.png" />
                  <span class="ms-3"> {{ phrases.pages.account.menu.Logout }}</span>
                </a>
              </div>
            </div>
            <div class="d-none d-lg-block profile-menu-desktop">
              <div class="user-info-box border rounded bg-white">
                <div class="user-img border p-1 rounded bg-white">
                  <img src="../../../assets/images/user.png" />
                </div>
                <div class="info-text mb-2">
                  <!-- <strong>نام و نام خانوادگی</strong> -->
                  <strong>{{ user.fullname }}</strong>
                </div>
                <div class="info-text">
                  <!-- <span>09121212122</span> -->
                  <span>{{ user.phone }}</span>
                </div>
                <!-- <hr class="m-4" />
                  <div class="info-text">
                    <span>khanedaroo@med.com</span>
                  </div> -->
              </div>
              <div class="menu-box border rounded bg-white mt-2 p-3">
                <Link
                  href="/account"
                  class="menu-item d-flex align-items-center mb-2"
                >
                  <img src="../../../assets/images/clipboard.png" />
                  <span class="ms-3"> {{ phrases.pages.account.menu.Profile }}</span>
                </Link>
                <hr />
                <Link
                  href="/account/orders"
                  class="menu-item d-flex align-items-center mb-2"
                >
                  <img src="../../../assets/images/orders.png" />
                  <span class="ms-3"> {{ phrases.pages.account.menu.Orders }}</span>
                </Link>
                <hr />
                <Link
                  href="/account/transactions"
                  class="menu-item d-flex align-items-center mb-2"
                >
                  <img src="../../../assets/images/transaction.svg" />
                  <span class="ms-3"> {{ phrases.pages.account.menu.Transactions }}</span>
                </Link>
                <hr />
                <Link
                  href="/account/tickets"
                  class="menu-item d-flex align-items-center mb-2"
                >
                  <img src="../../../assets/images/comment.png" />
                  <span class="ms-3">{{ phrases.pages.account.menu.Tickets }}</span>
                </Link>
                <hr />
                <Link
                  href="/account/favorites"
                  class="menu-item d-flex align-items-center mb-2"
                >
                  <img src="../../../assets/images/clipboard.png" />
                  <span class="ms-3"> {{ phrases.pages.account.menu.Favorites }}</span>
                </Link>
                <hr />
                <a
                  href="/logout"
                  class="menu-item d-flex align-items-center mb-2"
                >
                  <img src="../../../assets/images/logout.png" />
                  <span class="ms-3"> {{ phrases.pages.account.menu.Logout }}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div class="col-12 col-lg-9">
          <Transactions />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
