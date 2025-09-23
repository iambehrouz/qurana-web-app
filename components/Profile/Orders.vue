<script setup>
import { onMounted, ref } from "vue";
import { usePageContext } from "../../renderer/usePageContext";
import * as langauges from "../../languages/index";
import { useMainStore } from "../../stores/main";
import Pager from "../PagerComponent.vue";
import * as cookies from "vue-cookies";
import helpers from "../../helpers";
import config from "../../config.json";
import axios from "../../helpers/axios";
import Link from "../../renderer/Link.vue";

const pageContext = usePageContext();
const phrases = langauges.getPhrases(pageContext.data.lng);
const store = useMainStore();
const apiUrl = config.apiUrl;
const user = ref(pageContext.data.user);
const gregorianToJalali = helpers.datetime.gregorianToJalali;
const separateDateAndTime = helpers.datetime.separateDateAndTime;
const jalaliDateToGregorian = helpers.datetime.jalaliDateToGregorian;
const status = ref("orders");
const view = ref("grid");
const shippingTypes = {
  express: "express",
  post: "post",
  undefined: "not selected",
};
const paymentTypes = {
  inplace: "inplace",
  online: "online",
  undefined: "not selected",
};
const orders = ref({
  items: [],
  filters: {
    query: {
      orderId: null,
      ownerId: null,
      minDate: null,
      maxDate: null,
      minDateJalali: null,
      maxDateJalali: null,
    },
    offset: 0,
    limit: 10,
    order: "orderId[z-a]",
  },
  pager: {
    itemsCount: 0,
    pagesCount: 1,
    currentPage: 1,
  },
});
const order = ref({});
const searchSubmit = async (page) => {
  status.value = "orders";
  if (page) {
    orders.value.filters.offset = (page - 1) * orders.value.filters.limit;
    orders.value.pager.currentPage = page;
  }
  const response = await axios.post("/orders/get", orders.value.filters);
  orders.value.items = response.data.data.orders.items;
  orders.value.pager.itemsCount = response.data.data.orders.count;
  orders.value.pager.pagesCount = Math.floor(
    orders.value.pager.itemsCount / orders.value.filters.limit
  );
  if (orders.value.pager.itemsCount % orders.value.filters.limit != 0) {
    orders.value.pager.pagesCount++;
  }
};

const searchOpen = () => {
  orders.value.filters.query.title = null;
  orders.value.filters.query.orderId = null;
  orders.value.filters.query.status = null;
  orders.value.filters.query.minDate = null;
  orders.value.filters.query.maxDate = null;
  orders.value.filters.query.minDateJalali = null;
  orders.value.filters.query.maxDateJalali = null;
  orders.value.filters.limit = 10;
  orders.value.filters.offset = 0;
  orders.value.filters.order = "orderId[z-a]";
  status.value = "search";
};

const handleMinMaxChange = (type) => {
  if (type === "minDate") {
    orders.value.filters.query.minDate = jalaliDateToGregorian(
      orders.value.filters.query.minDateJalali
    );
  }
  if (type === "maxDate") {
    orders.value.filters.query.maxDate = jalaliDateToGregorian(
      orders.value.filters.query.maxDateJalali
    );
  }
};

const close = () => {
  orders.value.filters.query.orderId = null;
  orders.value.filters.order = "orderId[z-a]";
  orders.value.filters.query.minDate = null;
  orders.value.filters.query.maxDate = null;
  orders.value.filters.limit = 10;
  status.value = "orders";
};
const removeFilters = () => {
  orders.value.filters.query.orderId = null;
  orders.value.filters.order = "orderId[z-a]";
  orders.value.filters.query.minDate = null;
  orders.value.filters.query.maxDate = null;
  orders.value.filters.limit = 10;
  searchSubmit(1);
};

const toggleView = (e) => {
  status.value = "orders";
  view.value = e;
};

const pay = async(order) => {
  const xAccessToken = cookies.get("x-access-token");
  const paymentRes = await axios.get(
    `${config.apiUrl}/payment/myFatoorah/execute-payment?x-access-token=${xAccessToken}&orderId=${order.orderId}&amount=${order.totalAmount}`,
    {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    }
  );
  if (paymentRes.data && paymentRes.data.status != false)
    window.location = paymentRes.data;
};

onMounted(() => {
  if (!user.value) window.location = "/login";
  orders.value.filters.query.ownerId = user.value.userId;
  searchSubmit(1);
});
</script>
<template>
  <div class="p-1 orders">
    <div class="profile-title">
      <h6>{{ phrases.components.profile.orders.title }}</h6>
    </div>
    <div class="profile-box">
      <div class="bg-white border rounded row">
        <div class="container-fluid pt-3">
          <div class="actions mb-4 mt-2" v-show="status === 'orders'">
            <button
              :class="[
                'ms-1',
                { active: status === 'orders' && view === 'grid' },
              ]"
              value="grid"
              @click="toggleView('grid')"
            >
              <i class="fas fa-table-cells-large"></i>
            </button>
            <button
              :class="[
                'ms-1',
                { active: status === 'orders' && view === 'list' },
              ]"
              value="list"
              @click="toggleView('list')"
            >
              <i class="fas fa-list"></i>
            </button>
            <button
              :class="['ms-1', { active: status === 'search' }]"
              @click="searchOpen"
            >
              <i class="fas fa-filter"></i>
            </button>
          </div>
          <div class="tabs mb-3">
            <div v-show="status === 'orders' && view === 'grid'">
              <div class="col-12 col-lg-4 mb-4">
                <button
                  class="w-100 btn btn-secondary"
                  @click="removeFilters"
                  v-if="
                    orders.filters.query.orderId ||
                    orders.filters.order !== 'orderId[z-a]' ||
                    orders.filters.query.minDate ||
                    orders.filters.query.maxDate ||
                    orders.filters.limit != 10
                  "
                >
                  <span> {{ phrases.components.profile.orders.removeFilters }} </span>
                  <i class="fa fa-close"></i>
                </button>
              </div>
              <div v-if="orders.items.length > 0" class="row">
                <div
                  v-for="(item, index) in orders.items"
                  :key="index"
                  class="col-12 col-md-6 col-lg-4 mb-3"
                >
                  <div class="card h-100">
                    <Link
                      class="card-body grid-container"
                      :href="'/account/orders/' + item.orderId"
                    >
                      <div
                        class="d-flex justify-content-between flex-wrap mb-3"
                      >
                        <div>
                          <span class="text-muted">{{ phrases.components.profile.orders.code }} </span>
                          <span>{{ item.orderId }}</span>
                        </div>
                        <!-- <div>
                        <span class="text-muted">نوع: </span>
                        <span>{{
                          item.source === "cash" ? "نقدی" : "اعتباری"
                        }}</span>
                      </div> -->
                      </div>
                      <div
                        class="d-flex justify-content-between flex-wrap mb-3"
                      >
                        <div>
                          <span class="text-muted"> {{ phrases.components.profile.orders.totalAmount }} </span>
                          <span>{{
                            item.totalAmount.toLocaleString("en") + " "
                          }} AED</span>

                        </div>
                      </div>
                      <div
                        class="d-flex justify-content-between flex-wrap mb-3"
                      >
                        <div>
                          <span class="text-muted">{{ phrases.components.profile.orders.date }} </span>
                          <span>{{
                            separateDateAndTime(
                              gregorianToJalali(item.createdAt)
                            ).date
                          }}</span>
                        </div>
                        <div>
                          <span class="text-muted">{{ phrases.components.profile.orders.time }} </span>
                          <span>{{
                            separateDateAndTime(
                              gregorianToJalali(item.createdAt)
                            ).time
                          }}</span>
                        </div>
                      </div>
                      <div
                        class="d-flex justify-content-between flex-wrap mb-3"
                      >
                        <div>
                          <span class="text-muted">{{ phrases.components.profile.orders.status }} </span>
                          <span v-if="item.paymentType === 'inplace'">
                            {{ phrases.components.profile.orders.inPlace }}</span
                          >
                          <span v-else>{{
                            item.transactionId
                              ? "paid"
                              : "Awaiting payment"
                          }}</span>
                        </div>
                      </div>
                      <p class="bg-light p-2 rounded">
                        <span class="text-muted">{{ phrases.components.profile.orders.address }} </span>
                        {{ item.place ? item.place.name + " ," : null }}
                        {{ item.area }}
                      </p>
                    </Link>
                  </div>
                </div>
              </div>

              <div v-else>
                <div class="alert alert-warning">{{ phrases.components.profile.orders.noItem }}</div>
              </div>
              <Pager
                :collection="orders"
                @search="(value) => searchSubmit(value)"
              />
            </div>

            <div v-show="status === 'orders' && view === 'list'" class="row">
              <div class="col-12 col-lg-4 mb-4">
                <button
                  class="w-100 btn btn-secondary"
                  @click="removeFilters"
                  v-if="
                    orders.filters.query.orderId ||
                    orders.filters.order !== 'orderId[z-a]' ||
                    orders.filters.query.minDate ||
                    orders.filters.query.maxDate ||
                    orders.filters.limit != 10
                  "
                >
                  <span> {{ phrases.components.profile.orders.removeFilters }}</span>
                  <i class="fa fa-close"></i>
                </button>
              </div>
              <div v-if="orders.items.length > 0" class="table-responsive pb-0">
                <table class="table table-sm table-striped bg-white">
                  <colgroup>
                    <col width="120px" />
                  </colgroup>
                  <thead>
                    <tr>
                      <th scope="col">
                        <span class="text-nowrap">{{ phrases.components.profile.orders.orderCode }}</span>
                      </th>
                      <!-- <th scope="col">
                        <span class="text-nowrap">نوع سفارش</span>
                      </th> -->
                      <th scope="col">
                        <span class="text-nowrap">{{ phrases.components.profile.orders.totalAmountSec }}</span>
                      </th>
                      <th scope="col">
                        <span class="text-nowrap">{{ phrases.components.profile.orders.paymentStatus }}</span>
                      </th>
                      <th scope="col">
                        <span class="text-nowrap">{{ phrases.components.profile.orders.orderDate }}</span>
                      </th>

                      <th></th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, index) in orders.items" :key="index">
                      <td>
                        <span class="text-nowrap">{{ item.orderId }}</span>
                      </td>

                      <!-- <td>
                        <span class="text-nowrap">{{
                          item.source === "cash" ? "نقدی" : "اعتباری"
                        }}</span>
                      </td> -->

                      <!-- <td>
                  <span class="text-nowrap">{{ item.service.name }}</span>
                </td> -->
                      <td>
                        <span class="text-nowrap">{{
                          item.totalAmount.toLocaleString("en")
                        }} AED</span>
                      </td>
                      <td>
                        <span v-if="item.paymentType === 'inplace'">
                          {{ phrases.components.profile.orders.paymentOnSpot }}</span
                        >
                        <span class="text-nowrap" v-else>{{
                          item.transactionId ? "  paid" : "Awaiting payment"
                        }}</span>
                      </td>
                      <td>
                        <span class="text-nowrap" dir="ltr">{{
                          gregorianToJalali(item.createdAt)
                        }}</span>
                      </td>

                      <td>
                        <button
                          v-if="
                            !item.transactionId &&
                            item.paymentType !== 'inplace'
                          "
                          class="btn btn-sm btn-primary text-nowrap"
                          @click="pay(item)"
                        >
                        {{ phrases.components.profile.orders.orderPayment }}
                        </button>
                      </td>
                      <td>
                        <Link
                          class="btn btn-sm btn-secondary text-nowrap"
                          :href="'/account/orders/' + item.orderId"
                        >
                        {{ phrases.components.profile.orders.viewDetails }}
                        </Link>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div v-else>
                <div class="alert alert-warning"> {{ phrases.components.profile.orders.noItem }}</div>
              </div>
              <Pager
                :collection="orders"
                @search="(value) => searchSubmit(value)"
              />
            </div>

            <div v-show="status === 'search'">
              <div class="mb-4">
                <div class="card-header bg-white">
                  <h3 class="mb-0">{{ phrases.components.profile.orders.searchOrders }}</h3>
                </div>
                <form>
                  <div class="card-body mt-2">
                    <div class="row">
                      <div class="col-12 col-lg-3 my-2">
                        <div class="form-group">
                          <label>{{ phrases.components.profile.orders.orderCode }}</label>

                          <input
                            v-model="orders.filters.query.orderId"
                            type="text"
                            class="form-control form-input"
                          />
                        </div>
                      </div>
                      <!-- <div class="col-12 col-lg-3 my-2">
                        <div class="form-group">
                          <label>نوع سفارش</label>

                          <select
                            class="form-control form-input"
                            v-model="orders.filters.query.source"
                          >
                            <option selected :value="null">هیچ کدام</option>
                            <option value="cash">نقدی</option>
                            <option value="credit">اعتباری</option>
                          </select>
                        </div>
                      </div> -->
                    </div>
                    <div class="row">
                      <div class="col-12 col-lg-3 my-2">
                        <div class="form-group">
                          <label>{{ phrases.components.profile.orders.minDate }}</label>

                          <input
                            v-model="orders.filters.query.minDateJalali"
                            type="text"
                            class="form-control form-input"
                            maxlength="10"
                            @change="handleMinMaxChange('minDate')"
                          />
                        </div>
                      </div>
                      <div class="col-12 col-lg-3 my-2">
                        <div class="form-group">
                          <label>{{ phrases.components.profile.orders.maxDate }}</label>

                          <input
                            v-model="orders.filters.query.maxDateJalali"
                            type="text"
                            class="form-control form-input"
                            maxlength="10"
                            @change="handleMinMaxChange('minDate')"
                          />
                        </div>
                      </div>
                      <div class="col-12 col-lg-3 my-2">
                        <div class="form-group">
                          <label>{{ phrases.components.profile.orders.limit }}</label>

                          <select
                            class="form-control form-input"
                            v-model="orders.filters.limit"
                          >
                            <option :value="5">5</option>
                            <option :value="10">10</option>
                            <option :value="20">20</option>
                            <option :value="30">30</option>
                          </select>
                        </div>
                      </div>
                      <div class="col-12 col-lg-3 my-2">
                        <div class="form-group">
                          <label>{{ phrases.components.profile.orders.order }}</label>

                          <select
                            class="form-control form-input"
                            v-model="orders.filters.order"
                          >
                            <option value="orderId[z-a]">{{ phrases.components.profile.orders.newest }}</option>
                            <option value="orderId[a-z]">{{ phrases.components.profile.orders.oldest }}</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <hr />
                  <div class="d-flex flex-column align-items-end search-order-btn-wrapper">
                    <button
                      class="btn btn-primary mb-2"
                      @click.prevent="searchSubmit(1)"
                    >
                    {{ phrases.components.profile.orders.search }}
                    </button>
                    <button
                      class="btn btn-secondary"
                      @click.prevent="close()"
                    >
                    {{ phrases.components.profile.orders.cancel }}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.actions {
  button {
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
    line-height: 1.5;
    border-radius: 0.2rem;
    background-color: #fff;
    border: 1px solid #ddd;
    transition: all 0.2s ease;
    i {
      pointer-events: none;
    }

    &.active {
      background-color: var(--secondary-color);
      color: #fff;
    }
  }
}
.search-order-btn-wrapper {
  button {
    width: 100%;
    @media (min-width: 992px) {
      width: 30%;
    }
  }
}

.grid-badge {
  font-size: 0.8rem;
}
.messages-span {
  position: relative;

  i {
    position: absolute;
    top: 5px;
  }
  span {
    margin-right: 20px;
  }
}

.grid-container {
  cursor: pointer;
}
.card-date {
  font-size: 0.8rem;
  color: #6e6e6e;
}

.message-container {
  position: relative;
  &::after {
    width: 0;
    height: 0;
    border-top: 7px solid transparent;
    border-left: 12px solid #f8f9fa;
    border-bottom: 7px solid transparent;
    content: "";
    top: 10px;
    right: -12px;
    position: absolute;
  }
  .message-info {
    img {
      border-radius: 50%;
      width: 50px;
      height: 50px;
    }
  }
}
.eye-icon:hover {
  background-color: rgb(97, 134, 97);
  i {
    color: white;
  }
}
.trash-icon:hover {
  background-color: rgb(161, 46, 71);
  i {
    color: white;
  }
}
</style>
