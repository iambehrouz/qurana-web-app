<script setup>
import { ref, onMounted, computed, reactive } from "vue";
import { useMainStore } from "../../stores/main";
import LoginModal from "../../components/LoginModal.vue";
import { usePageContext } from "../../renderer/usePageContext";
import * as langauges from "../../languages/index";
import * as cookies from "vue-cookies";
import config from "../../config.json";
import axios from "../../helpers/axios";
import Link from "../../renderer/Link.vue";

const store = useMainStore();
const pageContext = usePageContext();
const phrases = langauges.getPhrases(pageContext.data.lng);
const apiUrl = config.apiUrl;
const status = ref("cart");
const discount = ref({
  code: null,
  item: [],
  isValid: false,
});
const showLoginModal = ref(false);
const paymentMethod = ref(6)
const places = ref({
  items: [],
  current: null,
  filters: {
    query: {
      placeId: null,
      name: null,
    },
    offset: null,
    limit: null,
    order: "ordering[a-z]",
  },
});
const orderForm = ref({
  fullname: null,
  address: null,
  area: null,
  phone: null,
  placeId: null,
  ownerDescription: null,
  hasLocation: false,
  latitude: 35.6561401,
  longitude: 51.3827835,
  shippingAmount: null,
  shippingType: null,
  paymentType: null,
  orderItems: [],
});
const showMap = ref(false);
var map = null;

const coordinates = ref({
  lat: 35.6561401,
  lng: 51.3827835,
});
const calcItemsTotal = () => {
  var total = 0;
  for (const key in store.cart.items) {
    const item = store.cart.items[key];
    if (
      item.productItemSellers &&
      item.productItemSellers.length &&
      item.productItemSellers[0].price
    ) {
      total =
        total +
        Number(item.cartCount) *
          (Number(item.productItemSellers[0].price) -
            Number(item.productItemSellers[0].discount));
    }
  }

  return total;
};

const calcDiscount = (total) => {
  var unchangedTotal = total;
  if (
    discount.value.isValid &&
    discount.value.item.discountType === "percentage"
  ) {
    total =
      Number(total) -
      Number(total) * (Number(discount.value.item.discountValue) / 100);

    let dis = Number(total) * (Number(discount.value.item.discountValue) / 100);

    if (discount.value.item.discountLimit) {
      if (dis > discount.value.item.discountLimit)
        total = unchangedTotal - discount.value.item.discountLimit;
    }
  }
  if (discount.value.isValid && discount.value.item.discountType === "amount") {
    if (discount.value.item.discountLimit) {
      const maxDiscount =
        Number(total) * (Number(discount.value.item.discountLimit) / 100);

      if (maxDiscount > discount.value.item.discountValue) {
        total = Number(total) - Number(discount.value.item.discountValue);
      } else {
        total =
          Number(total) -
          Number(total) * (Number(discount.value.item.discountLimit) / 100);
      }
    } else {
      total = Number(total) - Number(discount.value.item.discountValue);
    }
  }

  return total;
};
const itemsTotalPrice = computed(() => {
  var total = 0;
  total = total + calcItemsTotal();
  total = calcDiscount(total);

  return total;
});

const totalDiscount = computed(() => {
  var total = 0;
  var itemsTotal = 0;
  total = total + calcItemsTotal();
  itemsTotal = itemsTotal + calcItemsTotal();
  total = calcDiscount(total);

  total = itemsTotal - total;

  return total;
});

const totalPrice = computed(() => {
  var total = 0;
  total = total + calcItemsTotal();
  total = calcDiscount(total);

  if (orderForm.value.shippingAmount) {
    total = Number(total) + Number(orderForm.value.shippingAmount);
  }
  return total;
});
const getPlaces = async () => {
  const response = await axios.post("/places/get", places.value.filters);
  places.value.items = response.data.data.places.items;
};

const handleVerifiedLogin = (userData) => {
  orderForm.value.fullname = pageContext.data.user.fullname;
  orderForm.value.phone = pageContext.data.user.phone;
  showLoginModal.value = false;
  status.value = "form";
};

const changeCurrentPlace = () => {
  let placeId = orderForm.value.placeId;
  orderForm.value.paymentType = null;
  orderForm.value.shippingType = null;
  orderForm.value.shippingAmount = null;
  let index = places.value.items.findIndex((obj) => obj.placeId == placeId);
  if (index < 0) {
    places.value.current = null;
  } else {
    places.value.current = places.value.items[index];
    if (places.value.current.longitude && places.value.current.latitude) {
      orderForm.value.longitude = places.value.current.longitude;
      orderForm.value.latitude = places.value.current.latitude;
      // map.setView([orderForm.value.latitude, orderForm.value.longitude]);
      initializeMap();
    } else {
      orderForm.value.longitude = coordinates.value.lng;
      orderForm.value.latitude = coordinates.value.lat;
      // map.setView([orderForm.value.latitude, orderForm.value.longitude]);
      initializeMap();
    }
  }
};

const initializeMap = () => {
  if (map) {
    map.remove();
  }
  setTimeout(function () {
    map = L.map("map-canvas").setView(
      [orderForm.value.latitude, orderForm.value.longitude],
      13
    );
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    // L.marker([coordinates.value.lat, coordinates.value.lng]).addTo(map);
    map.on("moveend", function (ev) {
      let center = map.getCenter();
      orderForm.value.latitude = center.lat;
      orderForm.value.longitude = center.lng;
    });
  }, 100);
};
const handleStatusChange = () => {
  window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  if (status.value === "cart") {
    if (!pageContext.data.user) {
      showLoginModal.value = true;
      return;
    }
    orderForm.value.fullname = pageContext.data.user.fullname;
    orderForm.value.phone = pageContext.data.user.phone;
    status.value = "form";

    initializeMap();
    return;
  }
  if (status.value === "form") {
    orderForm.value.shippingType = "post";
    if (!orderForm.value.placeId) {
      store.layout.toasts.push({
        type: "danger",
        title: "  place",
        message: "Please select your city",
        datetime: new Date(),
      });

      return;
    }
    if (!orderForm.value.shippingType) {
      store.layout.toasts.push({
        type: "danger",
        title: "  shipping type",
        message: " please select your shipping type",
        datetime: new Date(),
      });

      return;
    }
    if (!orderForm.value.paymentType) {
      store.layout.toasts.push({
        type: "danger",
        title: "  payment type",
        message: " please select your payment type",
        datetime: new Date(),
      });

      return;
    }

    if (!orderForm.value.area) {
      store.layout.toasts.push({
        type: "danger",
        title: "  area",
        message: "Please enter your area.",
        datetime: new Date(),
      });

      return;
    }

    // if (!orderForm.value.address) {
    //   store.layout.toasts.push({
    //     type: "danger",
    //     title: "  address",
    //     message: "Please enter the address.",
    //     datetime: new Date(),
    //   });

    //   return;
    // }
    // if (orderForm.value.address.trim().length < 10) {
    //   store.layout.toasts.push({
    //     type: "danger",
    //     title: "  address",
    //     message: "Please enter the full address.",
    //     datetime: new Date(),
    //   });

    //   return;
    // }
    status.value = "invoice";
    return;
  }
  if (status.value === "invoice") {
    submitOrder();
    return;
  }
};

const submitOrder = async () => {
  orderForm.value.ownerId = pageContext.data.user.userId;
  if (!showMap.value) {
    orderForm.value.latitude = null;
    orderForm.value.longitude = null;
    orderForm.value.hasLocation = false;
  } else {
    orderForm.value.hasLocation = true;
  }
  orderForm.value.orderItems = [];
  for (const key in store.cart.items) {
    const item = store.cart.items[key];
    orderForm.value.orderItems.push({
      productId: item.productId,
      productItemId: item.productItemId,
      sellerId: item.productItemSellers[0].sellerId,
      count: item.cartCount,
    });
  }

  const response = await axios.post("/orders/add", orderForm.value);
  if (response.data.status === true) {
    if (orderForm.value.paymentType === "online") {
      const xAccessToken = cookies.get("x-access-token");
      const paymentRes = await axios.get(
        `${config.apiUrl}/payment/myFatoorah/execute-payment?x-access-token=${xAccessToken}&orderId=${response.data.data.order.orderId}&amount=${response.data.data.order.totalAmount}&method=${paymentMethod.value}`,
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
      if (paymentRes.data && paymentRes.data.status != false)
        window.location = paymentRes.data;
    } else {
      if (response.data && response.data.data.order) {
        store.layout.toasts.push({
          type: "success",
          title: "  order",
          message: "Your order has been submited.",
          datetime: new Date(),
        });
        // should change
        window.location.href = `/account/orders/${response.data.data.order.orderId}?status=submitted`;
      }
    }
  }
};

const toggleShowMap = () => {
  showMap.value = !showMap.value;
  if (showMap.value === true) {
    setTimeout(() => {
      map.invalidateSize();
    }, 0);
  }
  if (showMap.value == false) {
    orderForm.value.latitude = null;
    orderForm.value.longitude = null;
  }
};
const changeShippingType = (type) => {
  orderForm.value.shippingType = type;
  if (places.value.current && type === "express")
    orderForm.value.shippingAmount = places.value.current.shippingExpressAmount;

  if (places.value.current && type === "post")
    orderForm.value.shippingAmount = places.value.current.shippingPostAmount;
};

const submitDiscount = async () => {
  discount.value.isValid = false;
  discount.value.item = [];
  var dis = null;
  if (
    !discount.value.code ||
    !discount.value.code.length ||
    discount.value.code == " "
  ) {
    return;
  }

  const response = await axios.post("/discounts/get", {
    query: {
      code: discount.value.code,
    },
  });
  if (response.data.data.discounts.items.length) {
    discount.value.item = response.data.data.discounts.items[0];
    dis = discount.value.item;

    if (dis.userId && dis.userId != pageContext.data.user.userId) {
      store.layout.toasts.push({
        type: "danger",
        title: "  discount",
        message: "The discount code is wrong.",
        datetime: new Date(),
      });

      return;
    }
    if (dis.expireAt) {
      const now = new Date();
      if (new Date(dis.expireAt) < now) {
        store.layout.toasts.push({
          type: "danger",
          title: "  discount",
          message: "The discount code has expired.",
          datetime: new Date(),
        });

        return;
      }
    }
    if (dis.usageCount !== null && dis.usageCount < 1) {
      store.layout.toasts.push({
        type: "danger",
        title: "  discount",
        message: "The discount code has expired.",
        datetime: new Date(),
      });

      return;
    }

    discount.value.isValid = true;
    store.layout.toasts.push({
      type: "success",
      title: "  discount",
      message: "Discount code applied.",
      datetime: new Date(),
    });
  } else {
    store.layout.toasts.push({
      type: "danger",
      title: "  discount",
      message: "discount code is not available.",
      datetime: new Date(),
    });
  }
};
onMounted(() => {
  getPlaces();
});
</script>
<template>
  <div class="cart-page">
    <LoginModal
      :show="showLoginModal"
      @close="showLoginModal = false"
      @login-verified="handleVerifiedLogin"
    />
    <div v-show="store.cart.items.length">
      <div class="title-bar py-2 py-lg-4">
        <div class="p-2 d-flex align-items-center justify-content-center gap-3">
          <div :class="status === 'cart' ? 'active-status' : 'diactive-status'">
            <span class="d-flex flex-column align-items-center gap-1">
              <span class="status-icon"
                ><i class="fa-duotone fa-cart-shopping"></i
              ></span>
              {{ phrases.pages.cart.cart }}
            </span>
            <i class="fa-duotone fa-arrow-right"></i>
          </div>
          <div :class="status === 'form' ? 'active-status' : 'diactive-status'">
            <span class="d-flex flex-column align-items-center gap-1">
              <span class="status-icon"
                ><i class="fa-duotone fa-map-location"></i
              ></span>
              {{ phrases.pages.cart.shippingInfo }}
            </span>
            <i class="fa-duotone fa-arrow-right"></i>
          </div>
          <div
            :class="status === 'invoice' ? 'active-status' : 'diactive-status'"
          >
            <span class="d-flex flex-column align-items-center gap-1">
              <span class="status-icon"
                ><i class="fa-duotone fa-credit-card"></i
              ></span>
              {{ phrases.pages.cart.completeOrder }}
            </span>
          </div>
        </div>
      </div>
      <div class="container-lg">
        <div class="row">
          <div class="col-12 py-2">
            <!-- <pre>{{ store.cart }}</pre> -->
            <div v-show="status === 'cart'">
              <ul class="d-md-none cart-list-mobile">
                <li
                  class="cart-item-mobile gap-3 d-flex w-100 mb-3"
                  v-for="(item, index) in store.cart.items"
                  :key="index"
                >
                  <Link :href="'/store/product/' + item.productId">
                    <img
                      v-if="item.product && item.product.coverFile"
                      :src="apiUrl + item.product.coverFile.path" />
                    <img v-else
                  /></Link>

                  <div class="d-flex flex-column w-100 pe-2">
                    <div
                      class="d-flex justify-content-between flex-wrap align-items-center mb-3"
                    >
                      <Link
                        class="product-title"
                        :href="'/store/product/' + item.productId"
                        >{{ item.product.namePersian + item.name }}
                      </Link>
                      <button
                        class="remove-btn"
                        @click="store.removeItemFromCart(item)"
                      >
                        <i class="fa fa-close"></i>
                      </button>
                    </div>
                    <div
                      class="d-flex justify-content-between flex-wrap align-items-center px-1 py-2 border-bottom-dashed"
                    >
                      <span class="title">{{ phrases.pages.cart.price }}</span>
                      <span class="price text-muted">
                        {{
                          (
                            Number(item.productItemSellers[0].price) -
                            Number(item.productItemSellers[0].discount)
                          ).toLocaleString("en")
                        }}
                        AED</span
                      >
                    </div>
                    <div
                      class="d-flex justify-content-between flex-wrap align-items-center px-1 py-2 border-bottom-dashed"
                    >
                      <span class="title">{{
                        phrases.pages.cart.discount
                      }}</span>
                      <span class="price text-muted">
                        {{
                          item.productItemSellers[0].discount.toLocaleString(
                            "en"
                          )
                        }}
                        AED</span
                      >
                    </div>
                    <div
                      class="d-flex justify-content-between flex-wrap align-items-center px-1 py-2 border-bottom-dashed"
                    >
                      <span class="title">{{ phrases.pages.cart.count }}</span>
                      <div class="count-btn-group">
                        <button @click="store.decreaseCartItemCount(item)">
                          -
                        </button>
                        <input type="text" :value="item.cartCount" disabled />
                        <button @click="store.increaseCartItemCount(item)">
                          +
                        </button>
                      </div>
                    </div>
                    <div
                      class="d-flex justify-content-between flex-wrap align-items-center px-1 py-2"
                    >
                      <span class="title">{{
                        phrases.pages.cart.subtotal
                      }}</span>
                      <span class="title"
                        >{{
                          (
                            Number(item.cartCount) *
                              Number(item.productItemSellers[0].price) -
                            Number(item.productItemSellers[0].discount)
                          ).toLocaleString("en")
                        }}
                        AED</span
                      >
                    </div>
                  </div>
                </li>
              </ul>
              <table class="d-none d-md-table cart-table-desktop mb-4">
                <colgroup width="40px" />
                <colgroup width="90px" />
                <colgroup />
                <colgroup />

                <colgroup />
                <colgroup width="90px" />

                <thead>
                  <tr>
                    <th></th>
                    <th></th>
                    <th>{{ phrases.pages.cart.product }}</th>
                    <th>{{ phrases.pages.cart.price }}</th>
                    <th>{{ phrases.pages.cart.discount }}</th>
                    <th>{{ phrases.pages.cart.count }}</th>
                    <th>{{ phrases.pages.cart.subtotal }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in store.cart.items" :key="index">
                    <td>
                      <button
                        class="remove-btn"
                        @click="store.removeItemFromCart(item)"
                      >
                        <i class="fa fa-close"></i>
                      </button>
                    </td>
                    <td>
                      <Link :href="'/store/product/' + item.productId">
                        <img
                          v-if="item.product && item.product.coverFile"
                          :src="apiUrl + item.product.coverFile.path" />
                        <img v-else
                      /></Link>
                    </td>
                    <td class="fw-bold">
                      {{ item.product.namePersian + item.name }}
                    </td>
                    <td>
                      {{
                        (
                          Number(item.productItemSellers[0].price) -
                          Number(item.productItemSellers[0].discount)
                        ).toLocaleString("en")
                      }}
                      AED
                    </td>
                    <td>
                      {{
                        item.productItemSellers[0].discount.toLocaleString("en")
                      }}
                      AED
                    </td>
                    <td>
                      <div class="count-btn-group">
                        <button @click="store.decreaseCartItemCount(item)">
                          -
                        </button>
                        <input type="text" :value="item.cartCount" disabled />
                        <button @click="store.increaseCartItemCount(item)">
                          +
                        </button>
                      </div>
                    </td>
                    <td>
                      {{
                        (
                          Number(item.cartCount) *
                          (Number(item.productItemSellers[0].price) -
                            Number(item.productItemSellers[0].discount))
                        ).toLocaleString("en")
                      }}
                      AED
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-show="status === 'form'">
              <div class="row">
                <strong class="mb-4">{{
                  phrases.pages.cart.personalInfo
                }}</strong>
                <div class="form-group col-12 col-sm-6 mb-3">
                  <label>{{ phrases.pages.cart.fullname }}</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="orderForm.fullname"
                  />
                </div>
                <div class="form-group col-12 col-sm-6 mb-3">
                  <label>{{ phrases.pages.cart.phone }}</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="orderForm.phone"
                  />
                </div>
                <div class="form-group col-12 col-sm-6 mb-3">
                  <label>{{ phrases.pages.cart.city }}</label>
                  <select
                    class="form-control"
                    v-model="orderForm.placeId"
                    @change="changeCurrentPlace"
                    placeholder="asd"
                  >
                    <option :value="null" disabled>
                      {{ phrases.pages.cart.choose }}
                    </option>

                    <option
                      v-for="(item, index) in places.items"
                      :value="item.placeId"
                      :key="index"
                    >
                      {{ item.name }}
                    </option>
                  </select>
                </div>

                <!-- <div class="form-group col-12 mb-3">
                  <label> {{ phrases.pages.cart.postalAddress }} </label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="orderForm.address"
                  />
                </div> -->
                <div class="form-group col-12 mb-3">
                  <label> {{ phrases.pages.cart.area }} </label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="orderForm.area"
                  />
                </div>
                <!-- <div class="form-group col-12 mb-3">
                  <label> {{ phrases.pages.cart.desc }} </label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="orderForm.descripton"
                  />
                </div> -->
                <!-- <div class="col-12">
                  <div class="form-group mt-2 mb-3">
                    <div
                      class="form-check mb-2 d-flex align-items-center gap-3 p-0"
                    >
                      <input
                        class="d-block m-0 form-check-input"
                        type="checkbox"
                        id="showMapCheck"
                        :checked="showMap"
                        @change="toggleShowMap"
                      />
                      <label class="d-block" for="showMapCheck">{{
                        phrases.pages.cart.selectLocation
                      }}</label>
                    </div>
                  </div>
                  <div class="form-group" v-show="showMap">
                    <div class="map-container">
                      <div class="map-marker">
                        <img
                          src="../../assets/images/icons-map-marker.png"
                          alt=""
                        />
                      </div>
                      <div id="map-canvas"></div>
                    </div>
                  </div>
                </div> -->
              </div>
              <!-- <div class="row">
                <strong class="my-4">{{ phrases.pages.cart.chooseShipping }}</strong>
                <div class="shipping-items">
                  <div
                    v-if="places.current && places.current.hasShippingExpress"
                    class="shipping-item shipping-express"
                    @click.stop="changeShippingType('express')"
                    :class="
                      orderForm.shippingType === 'express' ? 'active' : ''
                    "
                  >
                    <svg
                      fill="#000000"
                      width="800px"
                      height="800px"
                      viewBox="0 0 50 50"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlns:xlink="http://www.w3.org/1999/xlink"
                    >
                      <path
                        d="M4 2 A 1.0001 1.0001 0 0 0 3 3L3 13L2 13 A 1.0001 1.0001 0 0 0 1 14L1 24 A 1.0001 1.0001 0 1 0 1 26L9.6640625 26C5.5053486 28.756038 4.0507813 32.683594 4.0507812 32.683594 A 1.0001 1.0001 0 0 0 4.7246094 33.960938L6.9023438 34.583984C6.3345384 35.595724 6 36.761065 6 38C6 41.854334 9.1456661 45 13 45C16.854334 45 20 41.854334 20 38L24.267578 38L32.060547 38C32.179715 38.986751 32.484448 39.717662 32.982422 40.226562C33.636252 40.89474 34.488004 41 35 41C35.218658 41 35.425951 40.949517 35.623047 40.876953C36.723498 43.307626 39.169773 45 42 45C45.853698 45 49 41.853698 49 38C49 37.195185 48.849318 36.425861 48.597656 35.703125C48.954075 35.603867 49.335495 35.406193 49.599609 35.060547C49.900433 34.666813 50 34.186166 50 33.720703C50 33.240869 49.875943 32.847389 49.623047 32.275391C49.370151 31.703392 48.970149 31.038348 48.363281 30.400391C47.229681 29.208715 45.34262 28.162063 42.585938 28.027344C42.525187 22.544809 39.819751 18.179454 38.097656 15.943359C38.396238 15.902164 38.671967 15.836607 38.927734 15.740234C39.428973 15.551366 39.862484 15.206717 40.117188 14.791016C40.626593 13.959613 40.509766 13.158415 40.509766 12.498047C40.509766 11.839768 40.626373 11.04221 40.117188 10.210938C39.862595 9.7953008 39.429108 9.4488016 38.927734 9.2597656C38.426361 9.0707297 37.857706 8.9997194 37.164062 9C35.776026 9 34.510655 9.3013275 33.511719 9.859375C32.988328 10.151763 32.515961 10.541523 32.181641 11.013672 A 1.0001 1.0001 0 0 0 32 11L27 11 A 1.0001 1.0001 0 1 0 27 13L31.744141 13C31.8002 13.266576 31.898056 13.517555 32.03125 13.75 A 1.0001 1.0001 0 0 0 32.015625 14.179688C32.988434 19.530138 32.72952 25.149528 31.335938 29.306641C30.639146 31.385197 29.661456 33.087325 28.478516 34.234375C27.295576 35.381425 25.942196 36 24.267578 36C23.14423 36 22.237532 35.240694 21.890625 33.435547C21.543718 31.6304 21.955647 28.844708 23.869141 25.496094 A 1.0001 1.0001 0 0 0 23.931641 25.361328C24.316967 25.240604 24.678959 25.104473 24.994141 24.916016C25.478772 24.626238 26.005859 24.113335 26.005859 23.367188C26.005859 22.669659 25.835925 21.975755 25.525391 21.353516C25.370124 21.042396 25.180417 20.748361 24.902344 20.490234C24.62427 20.232108 24.213494 19.994141 23.716797 19.994141L14.28125 19.994141C14.182933 19.994141 14.091091 20.010399 14 20.027344L14 15L15 15 A 1.0001 1.0001 0 0 0 16 14L16 3 A 1.0001 1.0001 0 0 0 15 2L4 2 z M 5 4L14 4L14 13L13 13L5 13L5 4 z M 37.164062 11 A 1.0001 1.0001 0 0 0 37.166016 11C37.708372 10.999781 38.050639 11.068691 38.220703 11.132812C38.390767 11.196933 38.389452 11.216922 38.412109 11.253906C38.457419 11.327886 38.509766 11.778326 38.509766 12.498047C38.509766 13.219679 38.457209 13.672497 38.412109 13.746094C38.389559 13.782894 38.390899 13.803054 38.220703 13.867188C38.050459 13.931319 37.706618 14 37.164062 14C36.621082 14 36.10646 13.936107 35.650391 13.828125C35.642762 13.826319 35.636502 13.824096 35.628906 13.822266L34.865234 13.566406C34.732587 13.510803 34.597787 13.456831 34.486328 13.394531C33.865379 13.047451 33.6875 12.70423 33.6875 12.498047C33.6875 12.293566 33.865264 11.952421 34.486328 11.605469C35.107392 11.258516 36.0781 11 37.164062 11 z M 3 15L4 15L12 15L12 23.269531C11.999257 23.302165 11.994141 23.334532 11.994141 23.367188C11.994141 23.383055 11.999522 23.398228 12 23.414062L12 24L3 24L3 15 z M 34.095703 15.419922L34.164062 15.443359C34.419392 15.547893 34.687824 15.635542 34.966797 15.710938L35.400391 15.855469C35.603266 16.064068 40.416852 21.211285 40.486328 28.125C36.33626 28.755066 32.596901 31.894476 32.066406 36L29.382812 36C29.534032 35.871631 29.727656 35.810961 29.871094 35.671875C31.36306 34.225175 32.462588 32.239803 33.232422 29.943359C34.626475 25.784844 34.808484 20.562233 34.095703 15.419922 z M 14.439453 22.005859L23.560547 22.005859C23.598267 22.047929 23.658837 22.120163 23.724609 22.251953C23.854125 22.511473 23.92226 22.886315 23.951172 23.193359C23.762075 23.304956 23.361888 23.460906 22.830078 23.585938C21.757049 23.83821 20.167583 23.994141 18.435547 23.994141C16.704636 23.994141 15.413577 23.831872 14.671875 23.603516C14.308545 23.491653 14.096642 23.361921 14.021484 23.298828C14.034504 22.980653 14.131328 22.540778 14.275391 22.251953C14.341151 22.120114 14.401762 22.047935 14.439453 22.005859 z M 14.193359 26L18.15625 26C18.252521 26.000837 18.336896 26.005859 18.435547 26.005859C18.534824 26.005859 18.628203 26.000868 18.726562 26L21.527344 26C20.112855 29.001093 19.524751 31.727674 19.925781 33.814453C20.087601 34.656491 20.441432 35.36725 20.867188 36L19.140625 36L6.484375 32.384766C7.0140076 31.131905 8.7498356 27.597205 14.193359 26 z M 42 30C44.618246 30 46.053799 30.874962 46.914062 31.779297C47.344195 32.231464 47.624615 32.703202 47.792969 33.083984C47.961323 33.464767 48 33.840037 48 33.720703C48 33.812653 48.007306 33.76497 48.003906 33.78125C47.812448 33.81052 47.200239 33.77275 46.392578 33.65625C44.730245 33.416369 42.244663 33.027822 39.628906 34.070312 A 1.0001 1.0001 0 0 0 39.628906 34.072266C37.384303 34.968985 36.320563 36.506059 35.734375 37.640625C35.441281 38.207908 35.232494 38.674093 35.091797 38.880859C34.951106 39.087577 35.072978 39 35 39C34.701996 39 34.553826 38.974948 34.410156 38.828125C34.267292 38.682125 34.00296 38.227374 34 37.017578C34.042301 35.545163 34.61662 34.207109 35.513672 33.095703C37.040517 31.251351 39.519935 30 42 30 z M 8.8339844 35.134766L11.113281 35.787109C10.461821 36.339358 10 37.088037 10 38C10 39.64497 11.35503 41 13 41C14.64497 41 16 39.64497 16 38C16 37.639611 15.73216 37.393621 15.613281 37.072266L17.980469 37.748047C17.984719 37.832637 18 37.914271 18 38C18 40.773666 15.773666 43 13 43C10.226334 43 8 40.773666 8 38C8 37.054661 8.2605192 36.177234 8.7128906 35.425781 A 1.0001 1.0001 0 0 0 8.8339844 35.134766 z M 43.441406 35.390625C44.388158 35.394776 45.289306 35.518661 46.107422 35.636719C46.216447 35.652451 46.312533 35.661776 46.417969 35.677734C46.78446 36.372266 47 37.156089 47 38C47 40.772302 44.772302 43 42 43C39.661758 43 37.727993 41.399855 37.173828 39.246094C37.28571 39.017046 37.391354 38.787779 37.509766 38.558594C37.914189 37.775833 38.400152 36.996821 39.5 36.355469C39.185732 36.829379 39 37.394292 39 38C39 39.64497 40.35503 41 42 41C43.64497 41 45 39.64497 45 38C45 36.878997 44.362894 35.905249 43.441406 35.390625 z M 13 37C13.56503 37 14 37.43497 14 38C14 38.56503 13.56503 39 13 39C12.43497 39 12 38.56503 12 38C12 37.43497 12.43497 37 13 37 z M 42 37C42.56503 37 43 37.43497 43 38C43 38.56503 42.56503 39 42 39C41.43497 39 41 38.56503 41 38C41 37.43497 41.43497 37 42 37 z"
                      />
                    </svg>

                    <div>
                      <p class="mb-0">{{ phrases.pages.cart.express }}</p>

                      <p
                        class="amount mb-0"
                        v-if="places.current.shippingExpressAmount === null"
                      >
                      {{ phrases.pages.cart.shippingAmount }}
                      </p>
                      <p
                        class="amount mb-0"
                        v-else-if="
                          places.current.shippingExpressAmount !== null &&
                          Number(places.current.shippingExpressAmount) === 0
                        "
                      >
                      {{ phrases.pages.cart.freeShipping }}
                      </p>
                      <p class="amount mb-0" v-else>
                        {{ phrases.pages.cart.shippingcost }}
                        {{
                          places.current.shippingExpressAmount.toLocaleString(
                            "en"
                          )
                        }}
                      </p>
                    </div>
                  </div>
                  <div
                    v-if="places.current && places.current.hasShippingPost"
                    class="shipping-item shipping-post"
                    @click.stop="changeShippingType('post')"
                    :class="orderForm.shippingType === 'post' ? 'active' : ''"
                  >
                    <svg
                      fill="#000000"
                      width="800px"
                      height="800px"
                      viewBox="0 0 32 32"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M 0 6 L 0 8 L 19 8 L 19 23 L 12.84375 23 C 12.398438 21.28125 10.851563 20 9 20 C 7.148438 20 5.601563 21.28125 5.15625 23 L 4 23 L 4 18 L 2 18 L 2 25 L 5.15625 25 C 5.601563 26.71875 7.148438 28 9 28 C 10.851563 28 12.398438 26.71875 12.84375 25 L 21.15625 25 C 21.601563 26.71875 23.148438 28 25 28 C 26.851563 28 28.398438 26.71875 28.84375 25 L 32 25 L 32 16.84375 L 31.9375 16.6875 L 29.9375 10.6875 L 29.71875 10 L 21 10 L 21 6 Z M 1 10 L 1 12 L 10 12 L 10 10 Z M 21 12 L 28.28125 12 L 30 17.125 L 30 23 L 28.84375 23 C 28.398438 21.28125 26.851563 20 25 20 C 23.148438 20 21.601563 21.28125 21.15625 23 L 21 23 Z M 2 14 L 2 16 L 8 16 L 8 14 Z M 9 22 C 10.117188 22 11 22.882813 11 24 C 11 25.117188 10.117188 26 9 26 C 7.882813 26 7 25.117188 7 24 C 7 22.882813 7.882813 22 9 22 Z M 25 22 C 26.117188 22 27 22.882813 27 24 C 27 25.117188 26.117188 26 25 26 C 23.882813 26 23 25.117188 23 24 C 23 22.882813 23.882813 22 25 22 Z"
                      />
                    </svg>
                    <div>
                      <p class="mb-0">{{ phrases.pages.cart.posting }}</p>

                      <p
                        class="amount mb-0"
                        v-if="places.current.shippingPostAmount === null"
                      >
                      {{ phrases.pages.cart.shippingAmount }}
                      </p>
                      <p
                        class="amount mb-0"
                        v-else-if="
                          places.current.shippingPostAmount !== null &&
                          Number(places.current.shippingPostAmount) === 0
                        "
                      >
                      {{ phrases.pages.cart.freeShipping }}
                      </p>
                      <p class="amount mb-0" v-else>
                        {{ phrases.pages.cart.shippingcost }}
                        {{
                          places.current.shippingPostAmount.toLocaleString("en")
                        }}
                      </p>
                    </div>
                  </div>
                  <div
                    v-if="!places.current"
                    class="shipping-item shipping-post"
                    @click.stop="changeShippingType('post')"
                    :class="orderForm.shippingType === 'post' ? 'active' : ''"
                  >
                    <svg
                      fill="#000000"
                      width="800px"
                      height="800px"
                      viewBox="0 0 32 32"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M 0 6 L 0 8 L 19 8 L 19 23 L 12.84375 23 C 12.398438 21.28125 10.851563 20 9 20 C 7.148438 20 5.601563 21.28125 5.15625 23 L 4 23 L 4 18 L 2 18 L 2 25 L 5.15625 25 C 5.601563 26.71875 7.148438 28 9 28 C 10.851563 28 12.398438 26.71875 12.84375 25 L 21.15625 25 C 21.601563 26.71875 23.148438 28 25 28 C 26.851563 28 28.398438 26.71875 28.84375 25 L 32 25 L 32 16.84375 L 31.9375 16.6875 L 29.9375 10.6875 L 29.71875 10 L 21 10 L 21 6 Z M 1 10 L 1 12 L 10 12 L 10 10 Z M 21 12 L 28.28125 12 L 30 17.125 L 30 23 L 28.84375 23 C 28.398438 21.28125 26.851563 20 25 20 C 23.148438 20 21.601563 21.28125 21.15625 23 L 21 23 Z M 2 14 L 2 16 L 8 16 L 8 14 Z M 9 22 C 10.117188 22 11 22.882813 11 24 C 11 25.117188 10.117188 26 9 26 C 7.882813 26 7 25.117188 7 24 C 7 22.882813 7.882813 22 9 22 Z M 25 22 C 26.117188 22 27 22.882813 27 24 C 27 25.117188 26.117188 26 25 26 C 23.882813 26 23 25.117188 23 24 C 23 22.882813 23.882813 22 25 22 Z"
                      />
                    </svg>
                    <div>
                      <p class="mb-0">{{ phrases.pages.cart.posting }}</p>
                      <p class="amount mb-0">
                        {{ phrases.pages.cart.shippingAmount }}
                      </p>
                      
                    </div>
                  </div>
                </div>
              </div> -->
              <div class="row">
                <strong class="my-4">{{
                  phrases.pages.cart.choosePayment
                }}</strong>
                <div class="shipping-items">
                  <div
                    v-if="places.current && places.current.hasPaymentInPlace"
                    class="shipping-item shipping-express"
                    @click.stop="orderForm.paymentType = 'inplace'"
                    :class="orderForm.paymentType === 'inplace' ? 'active' : ''"
                  >
                    <svg
                      version="1.1"
                      id="Layer_1"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlns:xlink="http://www.w3.org/1999/xlink"
                      x="0px"
                      y="0px"
                      viewBox="0 0 88.47 122.88"
                      style="enable-background: new 0 0 88.47 122.88"
                      xml:space="preserve"
                    >
                      <g>
                        <path
                          d="M11.86,68.08L7.62,92.09c-0.07,0.33-0.2,0.63-0.4,0.86c-1.51,1.95-2.46,3.62-2.74,4.97c-0.2,1,0,1.8,0.67,2.43l16.56,16.56 c1.05,1.01,2.28,1.65,3.74,1.91c1.6,0.3,3.46,0.13,5.6-0.45c0.03,0,0.08-0.02,0.12-0.02c0.81-0.22,1.88-0.48,2.89-0.73 c4.44-1.08,8.31-2.03,11.91-5.29l4.62-4.82c0.05-0.08,0.12-0.15,0.18-0.22c0.07-0.07,0.52-0.52,1.13-1.1 c3.16-3.09,7.07-6.9,4.69-10.24l-1.85-1.85c-0.9,0.86-1.85,1.71-2.76,2.53c-0.83,0.73-1.61,1.41-2.33,2.13 c-0.76,0.76-2,0.76-2.76,0c-0.76-0.77-0.76-2,0-2.76c0.71-0.72,1.6-1.5,2.51-2.31c3.13-2.76,6.72-5.92,4.79-8.68l-1.83-1.83 c-0.1-0.1-0.18-0.22-0.27-0.33c-1.05,1.08-2.21,2.11-3.34,3.11c-0.83,0.73-1.61,1.41-2.33,2.13c-0.77,0.77-2,0.77-2.76,0 c-0.77-0.76-0.77-2,0-2.76c0.71-0.71,1.6-1.5,2.51-2.31c3.13-2.76,6.72-5.92,4.79-8.68l-1.83-1.83c-0.13-0.13-0.23-0.27-0.32-0.42 l-5.37,5.37c-0.77,0.76-2,0.76-2.76,0c-0.76-0.77-0.76-2,0-2.76l10.07-10.07c2.41-2.41,2.96-4.92,2.33-6.82 c-0.23-0.7-0.62-1.31-1.1-1.8c-0.25-0.25-0.53-0.47-0.84-0.66l-0.01,0c-0.15,0.07-0.26-0.08-0.4-0.22 c-0.17-0.08-0.36-0.16-0.54-0.22c-1.67-0.55-3.84-0.16-6.04,1.69c-0.03,0.03-0.06,0.06-0.09,0.08c-0.24,0.2-0.48,0.42-0.72,0.66 L22.44,78.27c-0.76,0.76-2,0.76-2.76,0c-0.7-0.7-0.76-1.78-0.18-2.55L11.86,68.08L11.86,68.08z M25.08,70.11l0.67-0.67l13.79-13.79 c-1.43-0.66-2.76-1.59-3.94-2.77c-5.25-5.25-5.25-13.73,0-18.98c5.25-5.25,13.73-5.25,18.98,0c5.25,5.25,5.25,13.73,0,18.98 c-0.04,0.04-0.09,0.09-0.13,0.13c0.1,0.09,0.21,0.19,0.31,0.29c0.43,0.43,0.8,0.9,1.13,1.4l17.1-17.1c-2.62-2.62-2.62-6.9,0-9.53 L60.25,15.33c-2.62,2.62-6.9,2.62-9.53,0L15.28,50.77c2.62,2.62,2.62,6.9,0,9.53L25.08,70.11L25.08,70.11z M55.14,65.57 c-0.46,0.64-0.99,1.28-1.62,1.9l-2,2l-0.02-0.05c0.15,0.08,0.28,0.18,0.42,0.32l1.91,1.91c0.1,0.1,0.2,0.23,0.28,0.35 c2.15,2.94,1.81,5.57,0.35,7.97c0.27,0.1,0.52,0.25,0.71,0.45l1.91,1.91c0.1,0.1,0.2,0.23,0.28,0.35c2.31,3.18,1.73,5.95,0,8.48 c0.08,0.05,0.15,0.12,0.23,0.2l1.91,1.91c0.1,0.1,0.2,0.23,0.28,0.35c4.44,6.07-0.85,11.22-5.1,15.38l-1.1,1.1l-4.74,4.97 l-0.15,0.15c-4.34,3.94-8.65,4.99-13.62,6.2c-0.83,0.2-1.68,0.42-2.84,0.71c-0.03,0-0.05,0.02-0.08,0.02 c-2.69,0.73-5.14,0.91-7.33,0.52c-2.23-0.4-4.16-1.4-5.77-2.98L2.52,103.15c-1.68-1.61-2.24-3.61-1.78-5.97 c0.37-1.9,1.46-3.99,3.19-6.25l4.42-25.04v-0.1c0.04-0.31,0.1-0.66,0.17-1.04L0,56.23L56.23,0l32.24,32.24L55.14,65.57L55.14,65.57 z"
                        />
                      </g>
                    </svg>
                    <div>
                      <p class="mb-0">
                        {{ phrases.pages.cart.paymentOnTheSpot }}
                      </p>
                    </div>
                  </div>
                  <div
                    class="shipping-item shipping-post"
                    @click.stop="orderForm.paymentType = 'online'"
                    :class="orderForm.paymentType === 'online' ? 'active' : ''"
                  >
                    <svg
                      id="Layer_1"
                      data-name="Layer 1"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 122.88 106.93"
                    >
                      <title>{{ phrases.pages.cart.online }}</title>
                      <path
                        d="M65.5,6.11A42.76,42.76,0,0,0,55.54,9a48,48,0,0,0-7.63,4.13,43.79,43.79,0,0,0-6.54,5.39h0a44.71,44.71,0,0,0-3.55,4H50.73A100,100,0,0,1,65.5,6.11ZM5.13,53.25H71a5.14,5.14,0,0,1,5.13,5.13V101.8A5.16,5.16,0,0,1,71,106.93H5.13A5.14,5.14,0,0,1,0,101.8V58.38a5.16,5.16,0,0,1,5.13-5.13Zm8,42a1.52,1.52,0,1,1,0-3H28.65a1.52,1.52,0,0,1,0,3Zm0-7.2a1.52,1.52,0,0,1,0-3H36.16a1.52,1.52,0,1,1,0,3Zm37.23-4.81a6.88,6.88,0,0,1,5.53,2.78,6.89,6.89,0,1,1,0,8.22,6.89,6.89,0,1,1-5.53-11ZM3.54,63.85h69V58.38a1.59,1.59,0,0,0-.47-1.12A1.61,1.61,0,0,0,71,56.79H5.13a1.57,1.57,0,0,0-1.59,1.59v5.47Zm69,13.61h-69V101.8A1.6,1.6,0,0,0,4,102.93a1.57,1.57,0,0,0,1.12.47H71a1.6,1.6,0,0,0,1.12-.48,1.52,1.52,0,0,0,.48-1.12V77.46ZM111.49,72h.11a49.14,49.14,0,0,0,2.29-4.66l.06-.13A42,42,0,0,0,116.48,59a43.46,43.46,0,0,0,.79-6.19H104.89A44.35,44.35,0,0,1,99.19,72Zm-3.57,5.53H95.75A82.09,82.09,0,0,1,85.6,89.31V81.39q1.75-1.94,3.29-3.88H85.6V72h7.21a40.34,40.34,0,0,0,6.56-19.2H85.6V50A6.74,6.74,0,0,0,85,47.25H99.25q-1-9.47-7.17-19.21H75.63v15.1H70.1V28H53.65a46.92,46.92,0,0,0-6.5,15.1H41.52A49.81,49.81,0,0,1,47.23,28H34.14a47.86,47.86,0,0,0-2.3,4.65l-.06.13a42.27,42.27,0,0,0-2.53,8.24c-.14.68-.26,1.38-.36,2.08H23.3c.15-1.07.32-2.12.53-3.16a48.73,48.73,0,0,1,2.87-9.32l.07-.15A52.16,52.16,0,0,1,31.39,22a48.9,48.9,0,0,1,6.08-7.38,48.34,48.34,0,0,1,7.38-6.07,52.2,52.2,0,0,1,8.52-4.63A49.11,49.11,0,0,1,72.87,0a50.92,50.92,0,0,1,10,1,47.56,47.56,0,0,1,9.32,2.87l.15.06a52.62,52.62,0,0,1,8.52,4.63A49.29,49.29,0,0,1,114.34,22,53,53,0,0,1,119,30.51,47.78,47.78,0,0,1,121.9,40a51.87,51.87,0,0,1,0,20.07A47.26,47.26,0,0,1,119,69.36l-.06.15A53,53,0,0,1,114.34,78a48.34,48.34,0,0,1-6.07,7.38,48.9,48.9,0,0,1-7.38,6.08,52.16,52.16,0,0,1-8.52,4.62,47.88,47.88,0,0,1-6.77,2.32V92.7A44.09,44.09,0,0,0,90.19,91a47.13,47.13,0,0,0,7.63-4.13,42.69,42.69,0,0,0,6.54-5.39h0a43.36,43.36,0,0,0,3.55-4Zm-3.14-30.26h12.49a43.27,43.27,0,0,0-.79-6.19,42.73,42.73,0,0,0-2.58-8.37A50.26,50.26,0,0,0,111.6,28H98.5a47.34,47.34,0,0,1,6.28,19.21ZM57.58,22.51H70.1V9.38A102.12,102.12,0,0,0,57.58,22.51Zm18,0H88.15A102.12,102.12,0,0,0,75.63,9.38V22.51Zm19.37,0h12.92a44.71,44.71,0,0,0-3.55-4h0a43.29,43.29,0,0,0-6.54-5.39A47.09,47.09,0,0,0,90.19,9l-.14-.06A42,42,0,0,0,81.82,6.4c-.52-.11-1-.2-1.59-.29A100,100,0,0,1,95,22.51Z"
                      />
                    </svg>
                    <div>
                      <p class="mb-0">{{ phrases.pages.cart.online }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-show="status === 'invoice'" class="invoice">
              <table class="items-table mb-5">
                <colgroup width="10px" />
                <colgroup />
                <colgroup />
                <colgroup />

                <thead>
                  <tr>
                    <th></th>
                    <th>{{ phrases.pages.cart.product }}</th>
                    <th>{{ phrases.pages.cart.price }}</th>
                    <th>{{ phrases.pages.cart.discount }}</th>

                    <th>{{ phrases.pages.cart.count }}</th>
                    <th>{{ phrases.pages.cart.subtotal }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in store.cart.items" :key="index">
                    <td>
                      {{ index + 1 }}
                    </td>
                    <td>
                      {{ item.product.namePersian + item.name }}
                    </td>
                    <td>
                      {{
                        Number(item.productItemSellers[0].price).toLocaleString(
                          "en"
                        )
                      }}
                      AED
                    </td>
                    <td>
                      {{
                        Number(
                          item.productItemSellers[0].discount
                        ).toLocaleString("en")
                      }}
                      AED
                    </td>
                    <td>
                      <div class="count-btn-group">
                        {{ item.cartCount }}
                      </div>
                    </td>
                    <td>
                      {{
                        (
                          Number(item.cartCount) *
                          (Number(item.productItemSellers[0].price) -
                            Number(item.productItemSellers[0].discount))
                        ).toLocaleString("en")
                      }}
                      AED
                    </td>
                  </tr>
                  <tr>
                    <td>
                      {{ store.cart.items.length + 1 }}
                    </td>
                    <td>{{ phrases.pages.cart.shippingcost }}</td>
                    <td></td>
                    <td></td>
                    <td
                      class="text-muted"
                      v-if="
                        orderForm.shippingType &&
                        orderForm.shippingAmount === null
                      "
                    >
                      {{ phrases.pages.cart.onCustomer }}
                    </td>
                    <td v-else-if="orderForm.shippingAmount">
                      {{ orderForm.shippingAmount.toLocaleString("en") }} AED
                    </td>
                    <td v-else>--</td>
                  </tr>
                </tbody>
              </table>
              <div class="back-btn my-4 col-12">
                <button
                  class="me-2 d-flex align-items-center justify-content-center gap-2"
                  @click="status = 'form'"
                >
                  <i class="fa-duotone fa-arrow-right"></i>
                  {{ phrases.pages.cart.backToInfo }}
                </button>
              </div>
            </div>
          </div>

          <div class="col-12">
            <div
              class="total-container d-flex flex-column justify-content-between mt-2 mt-lg-3"
            >
              <!-- <h2 class="total-title fw-bold">جمع کل سبد خرید</h2> -->
              <div>
                <div class="d-flex justify-content-between mb-3 py-4 flex-wrap">
                  <span>{{ phrases.pages.cart.totalPrice }}</span>

                  <span class="text-muted"
                    >{{ itemsTotalPrice.toLocaleString("en") }} AED</span
                  >
                </div>
                <div
                  class="d-flex justify-content-between px-4 mb-3 py-4 flex-wrap"
                  v-if="discount.isValid"
                >
                  <span>{{ phrases.pages.cart.discount }}</span>

                  <span class="text-muted"
                    >{{ totalDiscount.toLocaleString("en") }} AED</span
                  >
                </div>
                <!-- <div
                  class="d-flex justify-content-between border-bottom py-4 mb-3 flex-wrap"
                >
                  <span>{{ phrases.pages.cart.shippingcost }}</span>
                  <span
                    class="text-muted"
                    v-if="
                      orderForm.shippingType &&
                      orderForm.shippingAmount === null
                    "
                  >
                  {{ phrases.pages.cart.onCustomer }}</span
                  >
                  <span class="text-muted" v-else
                    >{{
                      orderForm.shippingAmount
                        ? orderForm.shippingAmount.toLocaleString("en")
                        : "0"
                    }}
                    AED
                  </span>
                </div> -->
                <div class="d-flex justify-content-between pb-2 mb-5 flex-wrap">
                  <span class="total-text">{{
                    phrases.pages.cart.totalPrice
                  }}</span>
                  <span class="total-price" v-if="orderForm.shippingAmount"
                    >{{ totalPrice.toLocaleString("en") }} AED</span
                  >
                  <span class="total-price" v-else
                    >{{ totalPrice.toLocaleString("en") }} AED</span
                  >
                </div>
              </div>
              <div v-if="status === 'invoice' && orderForm.paymentType === 'online'" class="payment-method-container mb-5">
                <h2 class="text-center">Choose payment method</h2>
                <div class="row d-flex justify-content-center">
                  <div class="col-6 col-lg-3 p-4">
                    <div
                    :class="paymentMethod == 6 ? 'active' : ''"
                      class="d-flex method-card flex-column align-items-center px-lg-4 rounded-2xl cursor-pointer hover:bg-gray-100"
                      @click="paymentMethod=6"
                    >
                      <img
                        src="../../assets/images/debit-pay-2.png"
                        alt="Debit Card"
                        class="w-75 opacity-50"
                      />
                      <!-- <span class="mt-2">Debit Cards</span> -->
                    </div>
                  </div>

                  <!-- Apple Pay -->
                  <div class="col-6 col-lg-3 p-4">
                    <div
                    :class="paymentMethod == 9 ? 'active' : ''"
                      class="d-flex flex-column method-card align-items-center px-lg-4 rounded-2xl cursor-pointer hover:bg-gray-100"
                      @click="paymentMethod=9"
                    >
                      <img
                        src="../../assets/images/apple-pay.webp"
                        alt="Apple Pay"
                        class="w-75 opacity-50"
                      />
                      <!-- <span class="mt-2">Apple Pay</span> -->
                    </div>
                  </div>

                  <!-- Google Pay -->
                  <div class="col-6 col-lg-3 p-4">
                    <div
                      class="d-flex flex-column method-card align-items-center px-lg-4 rounded-2xl cursor-pointer hover:bg-gray-100"
                      @click="paymentMethod=16"
                      :class="paymentMethod == 16 ? 'active' : ''"
                    >
                      <img
                        src="../../assets/images/google-pay.png"
                        alt="Google Pay"
                        class="w-75 opacity-50"
                      />
                      <!-- <span class="mt-2">Google Pay</span> -->
                    </div>
                  </div>
                </div>
              </div>
              <a class="btn" @click="handleStatusChange">
                <span v-if="status === 'cart'">
                  {{ phrases.pages.cart.continue }}</span
                >
                <span v-if="status === 'form'">
                  {{ phrases.pages.cart.continue }}</span
                >
                <span
                  v-if="
                    status === 'invoice' && orderForm.paymentType === 'online'
                  "
                >
                  {{ phrases.pages.cart.paymentAndComplete }}</span
                >
                <span
                  v-if="
                    status === 'invoice' && orderForm.paymentType === 'inplace'
                  "
                >
                  {{ phrases.pages.cart.orderRegistration }}
                </span>
              </a>
            </div>
            <div class="back-btn mb-4 col-12" v-if="status === 'form'">
              <button
                class="w-100 d-flex align-items-center justify-content-center gap-2"
                @click="status = 'cart'"
              >
                <i class="fa-duotone fa-arrow-right"></i>
                {{ phrases.pages.cart.checkCart }}
              </button>
            </div>
          </div>
          <div class="w-100 d-flex justify-content-end">
            <div class="d-none d-md-block discount-form my-4">
              <div
                v-show="status === 'invoice'"
                class="d-flex flex-column align-items-end gap-3"
              >
                <input
                  type="text"
                  placeholder="discount code"
                  v-model="discount.code"
                />
                <button class="ms-2" @click="submitDiscount">
                  {{ phrases.pages.cart.apply }}
                </button>
              </div>
            </div>
          </div>
          <div class="container d-md-none mt-4" v-show="status === 'invoice'">
            <div class="col-12 mb-4 discount-form discount-form-mobile">
              <div class="row">
                <input
                  class="w-100 mb-2"
                  type="text"
                  placeholder="discount code"
                  v-model="discount.code"
                />
                <button class="w-100" @click="submitDiscount">
                  {{ phrases.pages.cart.apply }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-show="store.cart.items.length < 1" class="container-lg">
      <p class="empty-cart">{{ phrases.pages.cart.emptyCartAlert }}</p>
    </div>

    <!-- <div class="container-lg" v-show="status === 'form'">fOOOOOOOOOrm</div>
    <div class="container-lg" v-show="status === 'invoice'">
      {{ totalPrice }}
    </div> -->
  </div>
</template>
<!-- https://www.w3schools.com/charsets/ref_utf_arrows.asp -->

<style scoped lang="scss">
.cart-page {
  .empty-cart {
    text-align: center;
    margin-top: 30px;
    font-size: 18px;
    color: var(--primary-color);
    border: 1px solid var(--primary-color);
    padding: 30px;
    display: block;
  }
  .title-bar {
    width: 100%;
    text-align: center;
    color: var(--primary-color);
    font-size: 1.2rem;
    border-bottom: 1px solid var(--divider-color);
    margin-bottom: 20px;
  }
  .back-btn {
    display: flex;
    justify-content: flex-end;
    button {
      height: 42px;
      border-radius: var(--border-radius-sm);
      border: 2px solid var(--secondary-color);
      padding: 0 15px;
      color: var(--secondary-color);
      font-weight: bold;
      @media (min-width: 992px) {
        width: 30% !important;
      }
    }
  }

  .cart-list-mobile {
    list-style: none;
    padding: 0;

    .cart-item-mobile {
      position: relative;
      border-bottom: 1px solid rgba(0, 0, 0, 0.2);
      padding-bottom: 15px;
      img {
        width: 100px;
        height: 100px;
        object-fit: contain;
      }
      .product-title {
        text-decoration: none;
        color: #000;
        // font-weight: bold;
      }
      .border-bottom-dashed {
        border-bottom: 1px rgba(0, 0, 0, 0.105) dashed;
      }
      .remove-btn {
        position: absolute;
        left: 0;
        top: 0;
        background-color: transparent;
        border: none;
        border-radius: 50%;
      }
      .title {
        font-weight: bold;
        font-size: 0.9rem;
        margin: 0;
      }
      .price {
        font-size: 0.95rem;
      }
      .total-price {
        color: var(--primary-color);
        font-size: 0.95rem;
        font-weight: bold;
      }
    }
  }

  .active-status,
  .diactive-status {
    display: flex;
    align-items: center;
    font-size: 12px;
    justify-content: space-between;
    gap: 1rem;
    @media (min-width: 992px) {
      font-size: 16px;
      gap: 1.5rem;
    }
  }
  .status-icon {
    border: 1px solid;
    padding: 10px 15px;
    text-align: center;
    border-radius: 50%;
    font-size: 18px;
    @media (min-width: 992px) {
      font-size: 30px;
      padding: 15px 20px 10px;
    }
  }
  .diactive-status {
    color: var(--background-disabled-color);
  }
  .cart-table-desktop {
    width: 100%;
    text-align: center;

    tr {
      border-bottom: 1px solid rgba(0, 0, 0, 0.2);
    }
    th {
      padding-bottom: 15px;
    }
    td {
      padding: 10px 0;
    }
    .remove-btn {
      background-color: transparent;
      border: 1px solid transparent;
      color: var(--primary-color);
      border-radius: 50%;
      transition: var(--transition);
      &:hover {
        background-color: #fff;
        border: 1px solid var(--divider-color);
      }
    }
    img {
      width: 90px;
      height: 90px;
      object-fit: contain;
    }
    .count-btn-group {
      height: 40px;
    }
  }
  .invoice {
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
      @media (min-width: 992px) {
        font-size: 16px;
      }
    }
  }

  .discount-form {
    width: 100%;
    input {
      height: 42px;
      width: 70%;

      border-radius: var(--border-radius-sm);
      border: 1px solid var(--secondary-color);
      padding-right: 10px;
      transition: var(--transition);
      &:focus {
        border: 1px solid var(--primary-color);
        outline: none;
      }
    }
    button {
      height: 42px;
      border-radius: var(--border-radius-sm);
      background-color: var(--secondary-color);
      border: none;
      padding: 0 15px;
      color: #fff;
      font-weight: bold;
      width: 28%;
    }
    &-mobile {
      padding: 20px;
      border: 3px dashed rgba(0, 0, 0, 0.2);
    }
    @media (min-width: 992px) {
      width: 50%;
    }
  }
  .btn-container {
    .btn {
      height: 42px;
      line-height: 42px;
      width: 100%;
      border-radius: var(--border-radius-sm);
      background-color: var(--primary-color);
      border: none;
      padding: 0 15px;
      color: #fff;
      font-weight: bold;
      // @media (min-width: 992px) {
      //   width: 20% !important;
      // }
    }
  }
  .total-container {
    // border: 3px solid rgba(0, 0, 0, 0.075);
    padding-bottom: 25px;
    color: #000;

    .total-title {
      color: #000;
      font-size: 16px;
    }
    .btn {
      height: 42px;
      line-height: 42px;
      width: 100%;
      border-radius: var(--border-radius-sm);
      background-color: var(--primary-color);
      border: none;
      padding: 0 15px;
      color: #fff;
      font-weight: bold;
      @media (min-width: 992px) {
        width: 30%;
        align-self: end;
      }
    }
    .total-text {
      font-weight: bold;
      font-size: 1.2rem;
    }
    .total-price {
      font-weight: bold;
      color: var(--secondary-color);
      font-size: 1.2rem;
    }
  }

  .map-container {
    position: relative;
    .map-marker {
      position: absolute;
      top: calc(50% - 48px);
      right: calc(50% - 24px);
      z-index: 401;
      pointer-events: none;
      img {
        height: 48px;
        width: 48px;
      }
    }
  }
  #map-canvas {
    height: 350px;
    z-index: 1 !important;
  }
  .shipping-items {
    display: flex;
    column-gap: 20px;
    flex-wrap: wrap;
    row-gap: 15px;
    .shipping-item {
      border: 1px solid #707070;
      padding: 10px;
      border-radius: 5px;
      display: flex;
      align-items: center;
      column-gap: 10px;
      font-weight: normal;
      color: #707070;
      cursor: pointer;
      svg {
        height: 40px;
        width: 40px;
        fill: #707070;
      }
      .amount {
        font-size: 12px;
        font-weight: normal;
        color: var(--text-primary-color);
      }
    }
    .shipping-item.active {
      background-color: #fff;
      font-weight: bold;
      border: 1px solidvar(--primary-color);
      color: var(--primary-color);
      svg {
        fill: var(--primary-color);
      }
    }
  }
}

.form-check-input {
  width: 20px;
  height: 20px;
}
.leaflet-top,
.leaflet-bottom {
  z-index: 0 !important;
}
.payment-method-container {
  h2 {
    font-size: 100%;
    @media (min-width: 992px) {
      font-size: 140%;
    }
  }
  span {
    font-size: 100%;
    @media (min-width: 992px) {
      font-size: 130%;
    }
  }
  .method-card {
    border: 1px solid var(--divider-color);
  }
  .active {
    border-color: var(--primary-color);
  }

}
</style>
