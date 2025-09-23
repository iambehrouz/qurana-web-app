<script setup>
import { ref, onMounted, watch } from "vue";
import { usePageContext } from "../../../../renderer/usePageContext";
import { useMainStore } from "../../../../stores/main";
import CommentForm from "../../../../components/CommentForm.vue";
import ProductCarousel from "../../../../components/ProductCarousel.vue";
import LoginModal from "../../../../components/LoginModal.vue";
import * as langauges from "../../../../languages/index";
import axios from "axios";

const pageContext = usePageContext();
const store = useMainStore();
const favorite = ref(pageContext.data.pageProps.favorite);
const reviews = ref(pageContext.data.pageProps.reviews);
const showLoginModal = ref(false);
const settings = pageContext.data.settings;
const sellerId = ref(pageContext.data.settings.value.store.sellerId);
const remountKey = ref(0);
const activeTab = ref("overview");
const cartCount = ref(1);
const product = ref(pageContext.data.pageProps.product);
const lng = ref(pageContext.data.lng);
const productItems = ref({
  active: pageContext.data.pageProps.productItems[0],
  items: pageContext.data.pageProps.productItems,
});
const phrases = langauges.getPhrases(pageContext.data.lng);

watch(
  () => product.value,
  () => {
    productItems.value.active = pageContext.data.pageProps.productItems[0];
    productItems.value.items = pageContext.data.pageProps.productItems;
    activateProductItem();
    filterProductOptions();
    optionItemActiveClass();
    remountKey.value++;
  }
);
const filterProductOptions = () => {
  if (product.value && product.value.productOptions) {
    product.value.productOptions.map((option, index) => {
      for (const i in option.productOptionItems) {
        const optionItem = option.productOptionItems[i];
        let exists = false;

        for (const key in productItems.value.items) {
          const productItem = productItems.value.items[key];
          for (const j in productItem.productItemOptions) {
            const productItemOptions = productItem.productItemOptions[j];
            if (
              productItemOptions.productOptionItemId ==
              optionItem.productOptionItemId
            )
              exists = true;
          }
        }
        if (!exists) option.productOptionItems.splice(i, 1);
      }
      if (!option.productOptionItems.length)
        pageContext.data.pageProps.product.productOptions.splice(index, 1);
    });
  }
};

const optionItemActiveClass = () => {
  for (const key in product.value.productOptions) {
    const option = product.value.productOptions[key];
    for (const j in option.productOptionItems) {
      const optionItem = option.productOptionItems[j];
      optionItem.active = false;
      if (!productItems.value.active) {
        return;
      }
      for (const i in productItems.value.active.productItemOptions) {
        const productItemOption =
          productItems.value.active.productItemOptions[i];

        if (
          option.productOptionId === productItemOption.productOptionId &&
          optionItem.productOptionItemId ===
            productItemOption.productOptionItemId
        ) {
          optionItem.active = true;
        }
      }
    }
  }
};
const findProductItem = () => {
  var activeOptionItems = [];
  for (const key in pageContext.data.pageProps.product.productOptions) {
    const productOption =
      pageContext.data.pageProps.product.productOptions[key];
    productOption.productOptionItems.map((item) => {
      if (item.active) {
        activeOptionItems.push(item);
      }
    });
  }
  for (const key in productItems.value.items) {
    const productItem = productItems.value.items[key];

    var results = true;
    for (const i in productItem.productItemOptions) {
      const productItemOption = productItem.productItemOptions[i];
      for (const j in activeOptionItems) {
        const item = activeOptionItems[j];
        if (
          item.productOptionId == productItemOption.productOptionId &&
          item.productOptionItemId !== productItemOption.productOptionItemId
        ) {
          results = false;
        }
      }
    }
    if (results === true) {
      productItems.value.active = productItem;
      remountKey.value++;

      return;
    }
  }

  let name = "";
  activeOptionItems.forEach((item) => (name = name + " " + item.value));
  let emptyProductItem = {
    name,
    productId: pageContext.data.pageProps.product.productId,
    productItemId: null,
    productItemOptions: [],
    productItemSellers: [],
    productItemFiles: [],
    productItemSpecifications: [],
  };
  productItems.value.active = emptyProductItem;
  remountKey.value++;
};
const handleOptionsChange = (item, option, optionIndex, itemIndex) => {
  if (item.active) return;
  pageContext.data.pageProps.product.productOptions[
    optionIndex
  ].productOptionItems.map((optionItem) => {
    optionItem.active = false;
  });
  item.active = true;
  findProductItem();
};

const activateProductItem = () => {
  //delete any seller other than settings seller
  for (const key in productItems.value.items) {
    const productItem = productItems.value.items[key];
    for (const i in productItem.productItemSellers) {
      const seller = productItem.productItemSellers[i];
      if (seller.sellerId !== sellerId.value) {
        productItem.productItemSellers.splice(i, 1);
      }
    }
  }

  //delete any seller with no count or price
  for (const k in productItems.value.items) {
    const productItem = productItems.value.items[k];
    for (const i in productItem.productItemSellers) {
      const seller = productItem.productItemSellers[i];
      if (seller.price < 1 || seller.count < 1) {
        productItem.productItemSellers.splice(i, 1);
      }
    }
  }

  //delete any item without seller
  for (const key in productItems.value.items) {
    const productItem = productItems.value.items[key];
    if (productItem.productItemSellers.length < 1) {
      productItems.value.items.splice(key, 1);
    }
  }
  //choose first productItem that has price and is in stock

  for (const key in productItems.value.items) {
    const productItem = productItems.value.items[key];
    for (const i in productItem.productItemSellers) {
      const seller = productItem.productItemSellers[i];
      if (seller.price && seller.count) {
        productItems.value.active = productItem;
        break;
      }
    }
  }
};

const openCartSidebar = () => {
  let cartSidebar = document.getElementById("cart-menu-container");
  let cartSidebarOverlay = document.getElementById("cart-menu-overlay");
  cartSidebar.style.transform = "translateX(0)";
  cartSidebarOverlay.style.display = "block";
};

const addToCart = () => {
  // if there is no cart saved in local storage
  if (!localStorage.cart) {
    const cartObj = { items: [] };
    localStorage.setItem("cart", JSON.stringify(cartObj));
  }
  let cart = JSON.parse(localStorage.cart);
  let newItem = JSON.parse(JSON.stringify(productItems.value.active));
  newItem.cartCount = cartCount.value;
  newItem.product = pageContext.data.pageProps.product;

  //check if  the item already exists in the localStorage
  let index = cart.items.findIndex(
    (obj) => obj.productItemId === productItems.value.active.productItemId
  );

  if (index < 0) {
    cart.items.push(newItem);
  } else {
    const totalCount =
      Number(cart.items[index].cartCount) + Number(cartCount.value);
    if (
      totalCount <=
      Number(productItems.value.active.productItemSellers[0].count)
    ) {
      newItem.cartCount = totalCount;
      cart.items[index] = newItem;
    } else {
      store.layout.toasts.push({
        type: "danger",
        title: " cart",
        message: "The requested number is more than the inventory.",
        datetime: new Date(),
      });

      return;
    }
  }

  //save to localStorage and store
  localStorage.setItem("cart", JSON.stringify(cart));
  store.cart = cart;
  store.layout.toasts.push({
    type: "success",
    title: " cart",
    message: "The product added to the shopping cart.",
    datetime: new Date(),
  });

  openCartSidebar();
};

const getReviews = async () => {
  const response = await axios("/reviews/get", {
    query: {
      objectId: pageContext.routeParams.productId,
      objectType: "product",
      isActive: true,
    },
    offset: null,
    limit: null,
    order: "newest",
  });
  reviews.value = response.data.reviews.items;
};

const addToFavorites = async () => {
  if (!pageContext.data.user) {
    showLoginModal.value = true;
    return;
  }
  const response = await axios.post("/favorites/add", {
    userId: pageContext.data.user.userId,
    objectType: "product",
    objectId: pageContext.data.pageProps.product.productId,
  });
  favorite.value = response.data.data.favorite;
  store.layout.toasts.push({
    type: "success",
    title: "Add to favorites",
    message: response.data.message,
    datetime: new Date(),
  });
};
const deleteFavorite = async () => {
  const response = await axios.post("/favorites/delete", {
    favoriteId: favorite.value.favoriteId,
  });
  favorite.value = null;
  store.layout.toasts.push({
    type: "success",
    title: "  Delete from favorites",
    message: response.data.message,
    datetime: new Date(),
  });
};

const handleVerifiedLogin = () => {
  showLoginModal.value = false;
  addToFavorites();
};

onMounted(() => {
  activateProductItem();
  filterProductOptions();
  optionItemActiveClass();
  // console.log(productItems.value.active);
  // console.log(productItems.value.active);
});
</script>
<template>
  <div class="product-page mt-4">
    <LoginModal
      :show="showLoginModal"
      :settings="settings"
      @close="showLoginModal = false"
      @login-verified="handleVerifiedLogin"
    />
    <div class="container-lg">
      <div class="row">
        <div class="col-12 col-md-7 mt-3">
          <div v-if="product">
            <ProductCarousel
              :key="remountKey"
              :productItemFiles="
                productItems.active.hasGallery
                  ? productItems.active.productItemFiles
                  : product.productFiles
              "
            />
          </div>
        </div>
        <div class="col-12 col-md-5 mt-3">
          <div class="mt-3">
            <div class="product-detail">
              <!-- <h1 v-if="product && productItems.active" class="fw-bold">
              {{ product.namePersian + " " + productItems.active.name }}
            </h1> -->
              <h1 v-if="lng == 'ar'">
                {{ product ? product.nameArabic : "" }}
              </h1>
              <h1 v-else>
                {{ product ? product.nameEnglish : "" }}
              </h1>
              <h2
                class="text-muted fw-normal mb-0"
                style="font-family: Arial, Helvetica, sans-serif"
              >
                {{ product ? product.nameEnglish : "" }}
              </h2>
              <div class="product-rate mt-3" v-if="product">
                <i
                  v-for="key in 5"
                  :key="key"
                  class="ms-1"
                  :class="
                    key <= Math.ceil(product.reviewRate)
                      ? 'fa-solid fa-star'
                      : 'fa-regular fa-star'
                  "
                ></i>
              </div>
              <ul
                v-if="
                  product &&
                  product.productOptions &&
                  product.productOptions.length
                "
                class="options-list mt-2 px-0"
              >
                <li
                  v-for="(option, optionIndex) in product.productOptions"
                  :key="optionIndex"
                >
                  <span class="title"
                    >{{ phrases.pages.store.product.choose }}
                    {{ option.name }}</span
                  >
                  <div class="options-btns">
                    <div
                      v-for="(item, itemIndex) in option.productOptionItems"
                      :key="itemIndex"
                    >
                      <button
                        :class="item.active ? 'active' : ''"
                        @click="
                          handleOptionsChange(
                            item,
                            option,
                            optionIndex,
                            itemIndex
                          )
                        "
                      >
                        {{ item.value }}
                      </button>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div class="d-none d-md-block mt-3">
            <div
              class="info-card"
              v-if="
                productItems.active &&
                productItems.active.productItemSellers.length &&
                productItems.active.productItemSellers[0].price &&
                productItems.active.productItemSellers[0].count
              "
            >
              <div class="d-flex align-items-start justify-content-between">
                <div class="info-row mb-2">
                  <span class="d-inline-block me-2 text-secondary">{{
                    phrases.pages.store.product.status
                  }}</span>
                  <span>{{ phrases.pages.store.product.instock }}</span>
                </div>
                <div class="info-row d-flex gap-2 mb-2">
                  <span class="d-inline-block ms-3 text-secondary">{{
                    phrases.pages.store.product.price
                  }}</span>

                  <span class="price-wrapper d-flex flex-column-reverse">
                    <span
                      class="text-muted discount-price text-decoration-line-through"
                      v-if="productItems.active.productItemSellers[0].discount"
                    >
                      {{
                        Number(
                          productItems.active.productItemSellers[0].price
                        ).toLocaleString("en")
                      }}
                    </span>
                    <span>
                      {{
                        (
                          Number(
                            productItems.active.productItemSellers[0].price
                          ) -
                          Number(
                            productItems.active.productItemSellers[0].discount
                          )
                        ).toLocaleString("en")
                      }}
                      AED
                    </span>
                  </span>
                </div>
              </div>
              <div class="d-none">
                <select class="form-control" v-model="cartCount">
                  <option selected value="1">1</option>
                  <option
                    v-for="(item, index) in productItems.active
                      .productItemSellers[0].count - 1"
                    :value="index + 2"
                    :key="index"
                  >
                    {{ index + 2 }}
                  </option>
                </select>
              </div>
              <div class="d-flex gap-2 align-items-center">
                <button class="cart-btn col-10" @click="addToCart">
                  <i class="me-2 fa fa-shopping-cart"></i
                  >{{ phrases.pages.store.product.addToCart }}
                </button>
                <button
                  v-if="!favorite"
                  class="fav-btn col-2"
                  @click="addToFavorites"
                >
                  <i class="fa-regular fa-heart"></i>
                </button>
                <button v-else class="fav-btn col-2" @click="deleteFavorite">
                  <i class="fa-solid fa-heart"></i>
                </button>
              </div>
            </div>
            <div class="info-card" v-else>
              <div class="info-row mb-2">
                <span class="d-inline-block ms-3 text-secondary">{{
                  phrases.pages.store.product.status
                }}</span>
                <span class="text-danger">{{
                  phrases.pages.store.product.outOfStock
                }}</span>
              </div>
              <div class="d-flex gap-2 align-items-center">
                <button disabled class="cart-btn col-10" @click="addToCart">
                  <i class="ms-3 fa fa-shopping-cart"></i
                  >{{ phrases.pages.store.product.addToCart }}
                </button>
                <button
                  v-if="!favorite"
                  class="fav-btn col-2"
                  @click="addToFavorites"
                >
                  <i class="fa-regular fa-heart"></i>
                </button>
                <button v-else class="fav-btn col-2" @click="deleteFavorite">
                  <i class="fa-solid fa-heart"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="bottom-tabs mt-4">
        <div class="tab-content border-top">
          <div class="tab specs-tab mb-3">
            <div v-if="productItems && productItems.active" class="row">
              <div
                class="col-12 col-lg-6 d-flex flex-lg-column align-items-center align-items-lg-start gap-4 mb-4 mb-lg-0 product-properties-wrapper"
              >
                <h2>{{ phrases.pages.store.product.properties }}</h2>
                <p>
                  {{ product.namePersian + " " + productItems.active.name }}
                </p>
              </div>
              <div
                class="col-12 col-lg-6 d-flex flex-lg-column gap-4 mb-5 mb-lg-0 product-specification-wrapper"
                v-if="productItems.active.productItemSpecifications"
              >
                <h2>{{ phrases.pages.store.product.specifications }}</h2>
                <ul class="p-0">
                  <li
                    v-for="(item, index) in productItems.active
                      .productItemSpecifications"
                    :key="index"
                    class="d-flex align-items-center gap-2 mb-3"
                  >
                    <h4>
                      {{
                        item.categorySpecification
                          ? item.categorySpecification.name
                          : ""
                      }}:
                    </h4>
                    <p>{{ item.value }}</p>
                  </li>
                </ul>
              </div>
              <!-- <table class="table table-striped">
                <colgroup>
                  <col width="160px" />
                </colgroup>
                <tbody>
                  <tr
                    v-for="(item, index) in productItems.active
                      .productItemSpecifications"
                    :key="index"
                  >
                    <td>
                      {{
                        item.categorySpecification
                          ? item.categorySpecification.name
                          : ""
                      }}
                    </td>
                    <td>{{ item.value }}</td>
                  </tr>
                </tbody>
              </table> -->
            </div>
          </div>
          <div class="tab overview-tab mb-4 border-top">
            <h2 class="title">{{ phrases.pages.store.product.overview }}</h2>
            <div
              class="overview-content"
              v-if="product && product.overview"
              v-html="product.overview"
            ></div>
            <p v-else>...</p>
          </div>
          <div class="tab mb-4 reviews-tab border-top" v-if="product">
            <CommentForm
              :objectType="'product'"
              :objectId="product.productId"
              :reviews="reviews"
              @reviewAdded="getReviews"
            />
          </div>
        </div>
      </div>
    </div>
    <div
      class="d-flex justify-content-between align-items-center d-md-none mobile-buy-btn"
      v-if="
        productItems.active &&
        productItems.active.productItemSellers.length &&
        productItems.active.productItemSellers[0].price &&
        productItems.active.productItemSellers[0].count
      "
    >
      <button @click="addToCart">
        {{ phrases.pages.store.product.addToCart }}
      </button>
      <button v-if="!favorite" class="fav-btn" @click="addToFavorites">
        <i class="fa-regular fa-heart"></i>
      </button>
      <button v-else class="fav-btn" @click="deleteFavorite">
        <i class="fa-solid fa-heart"></i>
      </button>
      <div>
        <span class="price-wrapper d-flex flex-column-reverse">
          <span
            class="text-muted discount-price text-decoration-line-through"
            v-if="productItems.active.productItemSellers[0].discount"
          >
            {{
              Number(
                productItems.active.productItemSellers[0].price
              ).toLocaleString("en")
            }}
          </span>
          <span>
            {{
              (
                Number(productItems.active.productItemSellers[0].price) -
                Number(productItems.active.productItemSellers[0].discount)
              ).toLocaleString("en")
            }}
            AED
          </span>
        </span>
      </div>
    </div>
    <div
      class="d-flex justify-content-center align-items-center d-md-none mobile-buy-btn"
      v-else
    >
      <button disabled class="btn-secondary bg-secondary">
        {{ phrases.pages.store.product.outOfStock }}
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.product-page {
  font: normal 1rem orator !important;
  #productCarousel {
    width: 100%;
    img {
      width: 100%;
      height: auto;
    }
    .f-carousel__slide {
      min-height: 300px;
      max-height: 420px;
      img {
        height: 100%;
        width: 100%;
        object-fit: contain;
      }
    }
  }
  .f-thumbs {
    .f-thumbs__track {
      display: flex;
      flex-direction: row-reverse;
      transform: matrix(1, 0, 0, 1, -155, 0) !important;
    }
    .f-thumbs__slide__img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
  .product-detail {
    h1 {
      color: #000;
      font-weight: normal;
      font-size: 1.2rem;
    }

    ul {
      font-size: 1.1rem;
      color: var(--text-primary-color);
      margin-top: 30px;
      padding-right: 15px;
      line-height: 2;
    }
  }
  // .price-wrapper {
  //   display: flex;
  // }
  .discount-price {
    font-size: 13px;
  }
  .info-card {
    border-radius: var(--border-radius-sm);
    padding: 15px 0;
    .info-row {
      font-size: 16px;
    }

    .cart-btn {
      border: none;
      background-color: var(--secondary-color);
      color: #fff;
      // width: 100%;
      margin: 15px 0;
      padding: 10px;
      border-radius: 5px;
      font-size: 15px;
    }
  }
  .fav-btn {
    border: 1px solid var(--secondary-color);
    color: var(--secondary-color);
    padding: 10px;
    border-radius: 5px;
    font-size: 15px;
  }
  .bottom-tabs {
    margin-top: 50px;
  }
  .nav-tabs {
    list-style: none;
    display: flex;
    padding: 0;
    padding-bottom: 0;
    border-bottom: 1px solid var(--gray-light);
    flex-wrap: wrap;

    li {
      display: block;

      a {
        font-size: 1rem;
        text-decoration: none;
        color: var(--text-primary-color);
        border-radius: var(--border-radius-sm);
        cursor: pointer;
        display: block;
        height: 100%;
        padding: 1rem;
      }
    }
    li.active {
      border: 1px solid var(--gray-light);
      position: relative;
      &::after {
        content: "";
        display: block;
        background-color: #fafafa;
        width: 100%;
        position: absolute;
        height: 3px;
        right: 0;
        bottom: -3px;
      }
    }
  }

  .tab {
    padding-top: 24px;
  }
  h2 {
    position: relative;
    margin-bottom: 30px;
    font-size: 1.1rem;
  }
  .product-rate {
    color: var(--primary-color);
  }
  .mobile-buy-btn {
    position: fixed;
    bottom: 0;
    z-index: 3;
    width: 100%;
    background-color: white;
    border-top: 1px solid rgb(216, 216, 216);
    box-shadow: 2px 2px 7px rgb(175, 175, 175);
    height: auto;
    padding: 10px 15px;
    gap: 20px;

    button {
      background-color: var(--secondary-color);
      border: none;
      height: 100%;
      border-radius: var(--border-radius-sm);
      padding: 15px 5px;
      color: #fff;
      font-size: 12px;
    }
    .fav-btn {
      background: none;
      color: var(--secondary-color);
      padding: 15px;
      border: 1px solid var(--secondary-color);
    }
    .price {
      font-weight: bold;
      font-size: 1.2rem;
    }
    .currency {
      font-weight: 0.5rem;
    }
  }
  .options-list {
    list-style: none;
    padding: 0;
    margin: 0;
    li {
      margin-top: 10px;
    }
    .title {
      color: var(--text-primary-color);
    }

    .options-btns {
      display: flex;
      flex-direction: row;
      column-gap: 10px;
      row-gap: 10px;
      flex-wrap: wrap;

      button {
        border-radius: 5px;
        border: 1px solid gray;
        padding: 2px 10px;
        font-size: 14px;
      }
      button.active {
        background-color: var(--secondary-color);
        color: #fff;
      }
    }
  }
  button:disabled {
    background-color: var(--background-disabled-color) !important;
    cursor: not-allowed;
  }
}
.product-properties-wrapper {
  h2 {
    font-size: 16px;
    font-weight: 700;
    margin: 0;
    @media (min-width: 992px) {
      font-size: 18px;
    }
  }
  p {
    margin: 0;
    font-size: 14px;
    @media (min-width: 992px) {
      font-size: 16px;
    }
  }
}
.product-specification-wrapper {
  h2 {
    font-size: 16px;
    font-weight: 700;
    margin: 0;
    @media (min-width: 992px) {
      font-size: 18px;
    }
  }
  h4 {
    font-size: 14px;
    font-weight: 600;
    margin: 0;
    @media (min-width: 992px) {
      font-size: 16px;
    }
  }
  p {
    margin: 0;
    font-size: 12px;
    @media (min-width: 992px) {
      font-size: 14px;
    }
  }
}
.overview-tab {
  .title {
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 20px;
    @media (min-width: 992px) {
      font-size: 18px;
    }
  }
}
</style>
