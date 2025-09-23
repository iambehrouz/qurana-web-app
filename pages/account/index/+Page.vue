<script setup>
import { ref, onMounted, watch } from "vue";
import Home from "../../../components/Profile/Home.vue";
import { usePageContext } from "../../../renderer/usePageContext";
import * as langauges from "../../../languages/index";
import Link from "../../../renderer/Link.vue";

const pageContext = usePageContext();
// const view = ref(pageContext.routeParams.view);
const user = ref(pageContext.data.user);
const showMobileMenu = ref(false);
const mobileMenu = ref(null);
const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value;
};
const phrases = langauges.getPhrases(pageContext.data.lng);

// watch(
//   () => pageContext.routeParams,
//   () => {
//     view.value = pageContext.routeParams.view;
//   }
// );

onMounted(() => {
  mobileMenu.value = document.getElementById("profileMobileMenu");
  if (!user.value) window.location = pageContext.data.lng !== 'en' ? '/' + pageContext.data.lng + '/login' : '/login';
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
          <Home />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.profile-page {
  padding: 50px 0;
  .user-info-box {
    position: relative;
    padding-top: 80px;
    text-align: center;
    padding-bottom: 10px;
    .user-img {
      height: 80px;
      width: 80ox;
      position: absolute;
      top: -10%;
      left: 50%;
      transform: translateX(-50%);
      img {
        height: 100%;
        width: 100%;
      }
    }
    .info-text {
      font-size: 0.9rem;
    }
    .back-btn,
    .edit-btn {
      height: 42px;
      width: 42px;
      display: block;
      position: absolute;
      top: 10px;
    }
    .back-btn {
      right: 10px;
    }
    .edit-btn {
      left: 10px;
    }
  }
  .menu-toggle {
    background-color: var(--secondary-color);
    color: #fff;
  }
  .menu-box {
    .menu-item {
      text-decoration: none;
      color: var(--text-primary-color);
      font-size: 0.9rem;
      img {
        width: 30px;
        height: 30px;
      }
    }
  }
  .profile-title {
    h6 {
      color: #000;
      font-size: 1rem;
      position: relative;
      &::after {
        content: "";
        display: block;
        background-color: #3333;
        height: 1px;
        width: calc(100% - 170px);
        left: 0;
        top: 10px;
        position: absolute;
      }
    }
  }
  .profile-col {
    border: 1px solid #bfbfbf33;

    color: var(--text-secondary-color);

    .profile-col-content {
      min-height: 80px;
      display: flex;
      justify-content: center;
      flex-direction: column;
      padding: 10px;
    }

    span {
      display: block;
      font-size: 0.9rem;
    }
    .value {
      padding-right: 10px;
      font-weight: bold;
      margin-top: 5px;
    }
  }
  .profile-box-btns {
    button {
      background-color: transparent;
      text-align: center;
      width: 100%;
      height: 40px;
      border: none;
    }
  }
  .orders {
    .order-info {
      font-size: 13px;
    }
    .items-table {
      width: 100%;
      text-align: center;
      font-size: 12px;

      tr {
        border-bottom: 1px solid rgba(0, 0, 0, 0.2);
      }
      th {
        padding-bottom: 15px;
      }
      td {
        padding: 10px 0;
      }
      img {
        width: 50px;
        height: 50px;
        object-fit: contain;
      }
      .count-btn-group {
        height: 40px;
      }
    }
  }
}
a.grid-container {
  color: var(--text-primary-color);
  text-decoration: none;
}
</style>
