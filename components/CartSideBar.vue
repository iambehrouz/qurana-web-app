<script setup>
import { ref, onMounted, computed } from "vue";
import { useMainStore } from "../stores/main";
import { usePageContext } from "../renderer/usePageContext";
import config from "../config.json";
import Link from "../renderer/Link.vue";
import * as langauges from "../languages/index";

const pageContext = usePageContext();
const store = useMainStore();
const apiUrl = config.apiUrl;
const phrases = langauges.getPhrases(pageContext.data.lng);
const close = () => {
  document.getElementById("cart-menu-container").style.transform =
    "translateX(-100%)";
  document.getElementById("cart-menu-overlay").style.display = "none";
};

const totalPrice = computed(() => {
  var total = 0;
  for (const key in store.cart.items) {
    const item = store.cart.items[key];
    if (
      item.productItemSellers &&
      item.productItemSellers.length &&
      item.productItemSellers[0].price
    ) {
      total = total + item.cartCount * item.productItemSellers[0].price;
    }
  }

  return total;
});

onMounted(() => {
  console.log(store.cart);
});
</script>
<template>
  <div class="cart-menu">
    <div
      class="cart-menu-container d-flex flex-column justify-content-between shadow"
      id="cart-menu-container"
    >
      <div
        class="d-flex justify-content-between align-items-center cart-sidebar-header"
      >
        <span class="title m-0">{{ phrases.pages.cart.cart }}</span>
        <button @click="close" class="d-flex align-items-center justify-content-center btn btn-dark px-3">
          <i class="fa fa-close"></i>
        </button>
      </div>
      <div class="cart-sidebar-body">
        <ul class="cart-list" v-if="store.cart.items.length > 0">
          <li v-for="(item, index) in store.cart.items" :key="index">
            <div class="cart-sidebar-item d-flex justify-content-between">
              <div class="d-flex">
                <Link :href="'/store/product/' + item.productId" target="_blank">
                  <img
                    v-if="item.product && item.product.coverFile"
                    class="img-fluid"
                    :src="apiUrl + item.product.coverFile.path"
                  />
                  <img class="img-fluid" v-else />
                </Link>
                <div class="d-flex flex-column px-2">
                  <div class="product-name">
                    <span
                      >{{
                        item.product ? item.product.namePersian : "" + item.name
                      }}
                    </span>
                  </div>
                  <div class="count-btn-group mt-2">
                    <button @click="store.increaseCartItemCount(item)">
                      +
                    </button>
                    <input type="text" :value="item.cartCount" disabled />
                    <button @click="store.decreaseCartItemCount(item)">
                      -
                    </button>
                  </div>
                  <div class="product-price">
                    <span
                      >{{
                        item.productItemSellers &&
                        item.productItemSellers.length
                          ? (
                              Number(item.productItemSellers[0].price) -
                              Number(item.productItemSellers[0].discount)
                            ).toLocaleString("en")
                          : "0"
                      }} AED</span
                    >
                    <span
                      class="text-muted text-decoration-line-through d-block"
                      v-if="
                        item.productItemSellers &&
                        item.productItemSellers.length &&
                        item.productItemSellers[0].discount
                      "
                      >{{ (Number(item.productItemSellers[0].price)).toLocaleString("en") }}</span
                    >
                  </div>
                </div>
              </div>
              <button class="close-btn" @click="store.removeItemFromCart(item)">
                <i class="fa fa-close"></i>
              </button>
            </div>
          </li>
        </ul>
      </div>
      <div class="cart-sidebar-footer p-3">
        <div class="d-flex justify-content-between">
          <span>{{ phrases.pages.cart.totalPrice }}:</span>
          <span>{{ totalPrice.toLocaleString("en") }} AED</span>
        </div>
        <Link href="/cart" class="btn d-block w-100 my-3" @click="close()">{{ phrases.pages.cart.orderRegistration }}</Link>
      </div>
    </div>
    <div>
      <div
        class="cart-menu-overlay"
        id="cart-menu-overlay"
        @click="close()"
      ></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.cart-menu {
  &-container {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    z-index: 10000;
    width: 280px;
    transition: all 0.3s ease-out;
    background-color: #fff;
    transform: translateX(-100%);

    .cart-sidebar-header {
      padding: 10px 15px;
      border-bottom: 1px solid var(--divider-color);
      .title {
        font-size: 1.3rem;
        font-weight: bold;
      }
      button {
        height: 30px;
        width: 30px;
      }
    }
    .cart-sidebar-body {
      overflow-y: scroll;
      flex-grow: 1;
    }
    .cart-sidebar-footer {
      border-top: 1px solid var(--divider-color);

      .btn {
        background-color: var(--primary-color);
        color: #fff;
        border: none;
        height: 42px;
        font-weight: bold;
        line-height: 32px;
      }
    }
    .cart-sidebar-item {
      text-decoration: none;
      color: var(--text-primary-color);

      padding: 10px;
      .product-name {
        font-size: 0.9rem;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        max-width: 165px;
      }
      .product-price {
        font-size: 0.9rem;
        color: var(--secondary-color);
        font-weight: bold;
        margin-top: 10px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        max-width: 165px;
      }
      img {
        min-width: 60px;
        max-width: 60px;

        height: 60px;
        object-fit: cover;
        overflow: hidden;
      }
      .close-btn {
        width: 20px;
        height: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: var(--text-secondary-color);
        background-color: transparent;
        border-radius: 50%;
        transition: var(--transition);
        border: none;

        &:hover {
          background-color: #fff;
        }
      }
      &:hover {
        background-color: var(--divider-color);
      }
    }
    .cart-list {
      list-style: none;
      padding: 0;
    }
  }
  &-overlay {
    position: fixed;
    top: 0;
    z-index: 4;
    height: 100%;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    display: none;
  }
  &-banner {
    background-color: var(--primary-color);
    img {
      height: 160px;
      width: 100%;
    }
  }
  &-body {
    overflow-y: auto;
    max-height: calc(100vh - 160px);
    padding: 20px;
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  &-info {
    margin-top: auto;
  }
}
</style>
