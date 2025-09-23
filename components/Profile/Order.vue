<script setup>
import { onMounted, ref } from "vue";
import { usePageContext } from "../../renderer/usePageContext";
import * as langauges from "../../languages/index";
import { useMainStore } from "../../stores/main";
import Pager from "../PagerComponent.vue";
import * as cookies from "vue-cookies";
import Loader from "../Loader.vue";
import config from "../../config.json";
import helpers from "../../helpers";
import axios from "../../helpers/axios";
import Link from "../../renderer/Link.vue";

const store = useMainStore();
const pageContext = usePageContext();
const phrases = langauges.getPhrases(pageContext.data.lng);
const apiUrl = config.apiUrl;
const status = ref(null);
const user = ref(pageContext.data.user);
const gregorianToJalali = helpers.datetime.gregorianToJalali;
const separateDateAndTime = helpers.datetime.separateDateAndTime;
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
const order = ref(null);

const orderOpen = async (orderId) => {
  const response = await axios.post("/orders/get", {
    query: {
      orderId: orderId,
    },
  });
  order.value = response.data.data.orders.items[0];
};

const pay = async (order) => {
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

  orderOpen(pageContext.routeParams.orderId);
  status.value = pageContext.urlParsed.search.status;
  if (status.value === "paid" || status.value === "submitted") {
    const cartObj = { items: [] };
    localStorage.setItem("cart", JSON.stringify(cartObj));
    store.cart = cartObj;
  }
});
</script>
<template>
  <div class="p-1 orders">
    <div class="profile-title">
      <h6>{{ phrases.components.profile.order.title }}</h6>
    </div>
    <div class="profile-box">
      <div class="bg-white border rounded row">
        <div class="container-fluid" style="position: relative">
          <div class="mb-4">
            <div class="order-wrapper">
              <div
                class="alert alert-success mt-3 d-flex align-items-center"
                v-if="status === 'paid'"
              >
                <i class="fa fa-close ms-3" @click="status = null"></i>
                <span> {{ phrases.components.profile.order.madeSuccessfuly }}</span>
              </div>
              <div
                class="alert alert-success mt-3 d-flex align-items-center"
                v-if="status === 'submitted'"
              >
                <i class="fa fa-close ms-3" @click="status = null"></i>
                <span>
                  {{ phrases.components.profile.order.orderRegistered }}</span
                >
              </div>
              <div class="mb-3 order-wrapper" v-if="order">
                <div class="order-info mb-4 pt-3">
                  <div class="mb-3">
                    <span class="fw-bold"> {{ phrases.components.profile.order.orderCode }} </span>
                    <span>{{ order.orderId }}</span>
                  </div>
                  <div class="d-flex flex-wrap">
                    <div class="ms-3 mb-3">
                      <span class="fw-bold"> {{ phrases.components.profile.order.orderFullname }} </span>
                      <span>{{ order.fullname }}</span>
                    </div>
                    <div class="ms-3 mb-3">
                      <span class="fw-bold"> {{ phrases.components.profile.order.orderPhone }} </span>
                      <span>{{ order.phone }}</span>
                    </div>
                    <!-- <div class="ms-3 mb-3">
                      <span class="fw-bold"> {{ phrases.components.profile.order.shippingType }} </span>
                      <span>{{
                        shippingTypes[order.shippingType]
                          ? shippingTypes[order.shippingType]
                          : order.shippingType
                      }}</span>
                    </div> -->
                    <div class="ms-3">
                      <span class="fw-bold"> {{ phrases.components.profile.order.paymantType }} </span>
                      <span>{{
                        paymentTypes[order.paymentType]
                          ? paymentTypes[order.paymentType]
                          : order.paymentType
                      }}</span>
                    </div>
                  </div>
                  <div class="mb-3">
                    <span class="fw-bold"> {{ phrases.components.profile.order.address }} </span>
                    <span>{{
                      order.place ? order.place.name + ", " : ""
                    }}</span>
                    <span class="break-word">{{ order.area }}</span>
                  </div>

                  <div class="mb-3" v-if="order.ownerDescription">
                    <span class="fw-bold"> {{ phrases.components.profile.order.ownerDesc }} </span>
                    <span>{{ order.ownerDescription }}</span>
                  </div>
                  <div class="mb-3" v-if="order.adminDescription">
                    <span class="fw-bold"> {{ phrases.components.profile.order.adminDesc }} </span>
                    <span>{{ order.adminDescription }}</span>
                  </div>
                  <div class="d-flex flex-wrap">
                    <div class="ms-3 mb-3">
                      <span class="fw-bold"> {{ phrases.components.profile.order.paymantStatus }} </span>
                      <span v-if="order.paymentType === 'inplace'"
                        >{{ phrases.components.profile.order.paymentOnSpot }}
                      </span>
                      <span v-else>{{
                        order.transactionId ? "paid" : "Awaiting payment"
                      }}</span>
                    </div>
                    <div class="ms-3 mb-3" v-if="order.transaction">
                      <span class="fw-bold"> {{ phrases.components.profile.order.paymentCode }} </span>
                      <span>{{ order.transaction.transactionId }}</span>
                    </div>
                    <div class="ms-3 mb-3" v-if="order.transaction">
                      <span class="fw-bold"> {{ phrases.components.profile.order.paymentDate }} </span>
                      <span dir="ltr">{{
                        gregorianToJalali(order.transaction.createdAt)
                      }}</span>
                    </div>
                    <div
                      class="ms-3 mb-3"
                      v-if="order.transaction && order.transaction.refId"
                    >
                      <span class="fw-bold"> {{ phrases.components.profile.order.transactionCode }} </span>
                      <span>{{ order.transaction.refId }}</span>
                    </div>
                  </div>
                </div>

                <div class="table-responsive">
                  <table class="items-table mb-4">
                    <colgroup width="10px" />
                    <colgroup />
                    <colgroup />
                    <colgroup />

                    <thead>
                      <tr>
                        <th></th>
                        <th>{{ phrases.components.profile.order.product }}</th>
                        <th>{{ phrases.components.profile.order.seller }}</th>

                        <th>{{ phrases.components.profile.order.price }}</th>
                        <th>{{ phrases.components.profile.order.discount }}</th>

                        <th>{{ phrases.components.profile.order.count }}</th>
                        <th>{{ phrases.components.profile.order.subtotal }}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(item, index) in order.orderItems"
                        :key="index"
                      >
                        <td>
                          {{ index + 1 }}
                        </td>
                        <td>
                          <span v-if="item.product && item.productItem">
                            {{
                              item.product.namePersian + item.productItem.name
                            }}
                          </span>
                        </td>
                        <td>
                          <span>
                            {{ item.seller ? item.seller.name : "--" }}
                          </span>
                        </td>
                        <td>
                          <span>
                            {{
                              Number(item.unitPrice).toLocaleString("en")
                            }}
                            AED
                          </span>
                        </td>
                        <td>
                          <span>
                            {{ item.discountAmount.toLocaleString("en") }} AED
                          </span>
                        </td>
                        <td>
                          <div>
                            {{ item.count }}
                          </div>
                        </td>
                        <td>
                          {{
                            (
                              Number(item.count) *
                              (Number(item.unitPrice) -
                                Number(item.discountAmount))
                            ).toLocaleString("en")
                          }}
                          AED
                        </td>
                      </tr>
                      <tr>
                        <td>
                          {{ order.orderItems.length + 1 }}
                        </td>
                        <td>{{ phrases.components.profile.order.shippingCost }}</td>
                        <td></td>
                        <td></td>
                        <td></td>

                        <td></td>
                        <td>
                          <span
                            class="text-nowrap"
                            v-if="order.shippingAmount === null"
                            >{{ phrases.components.profile.order.onCustomer }}</span
                          >
                          <span
                            class="text-nowrap"
                            v-else-if="order.shippingAmount === 0"
                            >0 AED</span
                          >
                          <span class="text-nowrap" v-else>{{
                            order.shippingAmount
                              ? `${order.shippingAmount.toLocaleString(
                                  "en"
                                )} AED`
                              : "--"
                          }}</span>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          {{ order.orderItems.length + 2 }}
                        </td>
                        <td>{{ phrases.components.profile.order.discount }}</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>

                        <td v-if="order.discountAmount">
                          {{ order.discountAmount.toLocaleString("en") }} AED
                        </td>
                        <td v-else>--</td>
                      </tr>
                      <tr>
                        <td>
                          {{ order.orderItems.length + 3 }}
                        </td>
                        <td>{{ phrases.components.profile.order.totalAmount }}</td>
                        <td></td>
                        <td></td>
                        <td></td>

                        <td></td>
                        <td v-if="order.totalAmount">
                          {{ order.totalAmount.toLocaleString("en") }} AED
                        </td>
                        <td v-else>--</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div v-else>
                <Loader />
              </div>
            </div>

            <div
              class="d-flex flex-column align-items-end order-checkout-btn-wrapper"
            >
              <button
                class="btn btn-primary mb-2"
                @click="pay(order)"
                v-if="
                  order &&
                  !order.transactionId &&
                  order.paymentType !== 'inplace'
                "
              >
              {{ phrases.components.profile.order.payment }}
              </button>
              <Link class="btn btn-secondary" href="/account/orders">
                {{ phrases.components.profile.order.back }}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.break-word {
  word-wrap: break-word;
}
.fa-close {
  cursor: pointer;
}
.order-wrapper {
  min-height: 450px;
}
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
td {
  padding: 9px 2px !important;
}
.order-checkout-btn-wrapper {
  button,
  a {
    width: 100%;
    @media (min-width: 992px) {
      width: 30%;
    }
  }
}
</style>
