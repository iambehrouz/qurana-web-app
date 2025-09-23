<script setup>
import { onMounted, ref } from "vue";
// import { usePageContext } from "../../renderer/usePageContext";
import { usePageContext } from "../../renderer/usePageContext";
import * as langauges from "../../languages/index";
import { useMainStore } from "../../stores/main";
import Pager from "../PagerComponent.vue";
// import helpers from "../../assets/scripts/helpers";
import helpers from "../../helpers";
import config from "../../config.json";
import axios from "../../helpers/axios";

const pageContext = usePageContext();
const phrases = langauges.getPhrases(pageContext.data.lng);
const store = useMainStore();
const apiUrl = config.apiUrl;
const user = ref(pageContext.data.user);
const gregorianToJalali = helpers.datetime.gregorianToJalali;
const separateDateAndTime = helpers.datetime.separateDateAndTime;
const jalaliDateToGregorian = helpers.datetime.jalaliDateToGregorian;
const status = ref("transactions");
const paymentStatus = ref(null);
const view = ref("grid");
const transactions = ref({
  items: [],
  filters: {
    query: {
      transactionId: null,
      ownerId: null,
      minDate: null,
      maxDate: null,
      minDateJalali: null,
      maxDateJalali: null,
    },
    offset: 0,
    limit: 10,
    order: "transactionId[z-a]",
  },
  pager: {
    itemsCount: 0,
    pagesCount: 1,
    currentPage: 1,
  },
});
const searchSubmit = async (page) => {
  status.value = "transactions";
  if (page) {
    transactions.value.filters.offset =
      (page - 1) * transactions.value.filters.limit;
    transactions.value.pager.currentPage = page;
  }
  const response = await axios.post(
    "/transactions/get",
    transactions.value.filters
  );
  console.log(response.data, 'response.data');
  
  transactions.value.items = response.data.data.transactions.items;
  transactions.value.pager.itemsCount = response.data.data.transactions.count;
  transactions.value.pager.pagesCount = Math.floor(
    transactions.value.pager.itemsCount / transactions.value.filters.limit
  );
  if (
    transactions.value.pager.itemsCount % transactions.value.filters.limit !=
    0
  ) {
    transactions.value.pager.pagesCount++;
  }
};

const searchOpen = () => {
  transactions.value.filters.query.title = null;
  transactions.value.filters.query.transactionId = null;
  transactions.value.filters.query.status = null;
  transactions.value.filters.query.minDate = null;
  transactions.value.filters.query.maxDate = null;
  transactions.value.filters.query.minDateJalali = null;
  transactions.value.filters.query.maxDateJalali = null;
  transactions.value.filters.limit = 10;
  transactions.value.filters.offset = 0;
  transactions.value.filters.order = "transactionId[z-a]";
  status.value = "search";
};

const handleMinMaxChange = (type) => {
  if (type === "minDate") {
    transactions.value.filters.query.minDate = jalaliDateToGregorian(
      transactions.value.filters.query.minDateJalali
    );
  }
  if (type === "maxDate") {
    transactions.value.filters.query.maxDate = jalaliDateToGregorian(
      transactions.value.filters.query.maxDateJalali
    );
  }
};

const close = () => {
  transactions.value.filters.query.transactionId = null;
  transactions.value.filters.order = "transactionId[z-a]";
  transactions.value.filters.query.minDate = null;
  transactions.value.filters.query.maxDate = null;
  transactions.value.filters.limit = 10;
  status.value = "transactions";
};
const removeFilters = () => {
  transactions.value.filters.query.transactionId = null;
  transactions.value.filters.order = "transactionId[z-a]";
  transactions.value.filters.query.minDate = null;
  transactions.value.filters.query.maxDate = null;
  transactions.value.filters.limit = 10;
  searchSubmit(1);
};

const toggleView = (e) => {
  status.value = "transactions";
  view.value = e;
};

onMounted(() => {
  if (!user.value) window.location = "/login";
  transactions.value.filters.query.ownerId = user.value.userId;
  searchSubmit(1);
  paymentStatus.value = pageContext.urlParsed.search.status;
});
</script>
<template>
  <div class="p-1">
    <div class="profile-title">
      <h6>{{ phrases.components.profile.transactions.title }}</h6>
    </div>
    <div class="profile-box">
      <div class="bg-white border rounded row">
        <div class="container-fluid">
          <div class="actions mb-4 mt-2" v-show="status === 'transactions'">
            <button
              :class="[
                'ms-1',
                { active: status === 'transactions' && view === 'grid' },
              ]"
              value="grid"
              @click="toggleView('grid')"
            >
              <i class="fas fa-table-cells-large"></i>
            </button>
            <button
              :class="[
                'ms-1',
                { active: status === 'transactions' && view === 'list' },
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
          <div
            class="alert alert-success mt-3 d-flex align-items-center"
            v-if="paymentStatus === 'paid'"
          >
            <i class="fa fa-close ms-3" @click="paymentStatus = null"></i>
            <span> {{ phrases.components.profile.transactions.successAlert }}</span>
          </div>
          <div class="tabs mb-3">
            <div v-show="status === 'transactions' && view === 'grid'">
              <div class="col-12 col-lg-4 mb-4">
                <button
                  class="w-100 btn btn-secondary"
                  @click="removeFilters"
                  v-if="
                    transactions.filters.query.transactionId ||
                    transactions.filters.order !== 'transactionId[z-a]' ||
                    transactions.filters.query.minDate ||
                    transactions.filters.query.maxDate ||
                    transactions.filters.limit != 10
                  "
                >
                  <span> {{ phrases.components.profile.transactions.removeFilters }} </span>
                  <i class="fa fa-close"></i>
                </button>
              </div>
              <div v-if="transactions.items.length > 0" class="row">
                <div
                  v-for="(item, index) in transactions.items"
                  :key="index"
                  class="col-12 col-md-6 col-lg-4 mb-3"
                >
                  <div class="card h-100">
                    <div class="card-body grid-container">
                      <div
                        class="d-flex justify-content-between flex-wrap mb-3"
                      >
                        <div>
                          <span class="text-muted">{{ phrases.components.profile.transactions.code }} </span>
                          <span>{{ item.transactionId }}</span>
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
                          <span class="text-muted">{{ phrases.components.profile.transactions.amount }} </span>
                          <span
                            :class="
                              item.amount < 0 ? 'text-danger' : 'text-success'
                            "
                            >{{ item.amount.toLocaleString("en") + " " }} AED</span
                          >
                        </div>
                      </div>
                      <div
                        class="d-flex justify-content-between flex-wrap mb-3"
                      >
                        <div>
                          <span class="text-muted">{{ phrases.components.profile.transactions.date }} </span>
                          <span>{{
                            separateDateAndTime(
                              gregorianToJalali(item.createdAt)
                            ).date
                          }}</span>
                        </div>
                        <div>
                          <span class="text-muted">{{ phrases.components.profile.transactions.time }} </span>
                          <span>{{
                            separateDateAndTime(
                              gregorianToJalali(item.createdAt)
                            ).time
                          }}</span>
                        </div>
                      </div>
                      <p class="bg-light p-2 rounded">
                        <span class="text-muted">{{ phrases.components.profile.transactions.description }} </span>
                        {{ item.description }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div v-else>
                <div class="alert alert-warning"> {{ phrases.components.profile.transactions.noItem }}</div>
              </div>
              <Pager
                :collection="transactions"
                @search="(value) => searchSubmit(value)"
              />
            </div>

            <div
              v-show="status === 'transactions' && view === 'list'"
              class="row"
            >
              <div class="col-12 col-lg-4 mb-4">
                <button
                  class="w-100 btn btn-secondary"
                  @click="removeFilters"
                  v-if="
                    transactions.filters.query.transactionId ||
                    transactions.filters.order !== 'transactionId[z-a]' ||
                    transactions.filters.query.minDate ||
                    transactions.filters.query.maxDate ||
                    transactions.filters.limit != 10
                  "
                >
                  <span> {{ phrases.components.profile.transactions.removeFilters }}</span>
                  <i class="fa fa-close"></i>
                </button>
              </div>
              <div
                v-if="transactions.items.length > 0"
                class="table-responsive pb-0"
              >
                <table class="table table-sm table-striped bg-white">
                  <colgroup>
                    <col width="120px" />
                  </colgroup>
                  <thead>
                    <tr>
                      <th scope="col">
                        <span class="text-nowrap">{{ phrases.components.profile.transactions.transactionCode }}</span>
                      </th>
                      <!-- <th scope="col">
                        <span class="text-nowrap">نوع تراکنش</span>
                      </th> -->
                      <th scope="col"><span class="text-nowrap">{{ phrases.components.profile.transactions.amount }}</span></th>
                      <th scope="col">
                        <span class="text-nowrap">{{ phrases.components.profile.transactions.date }}</span>
                      </th>
                      <th scope="col">
                        <span class="text-nowrap">{{ phrases.components.profile.transactions.time }}</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(item, index) in transactions.items"
                      :key="index"
                    >
                      <td>
                        <span class="text-nowrap">{{
                          item.transactionId
                        }}</span>
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
                          item.amount.toLocaleString("en")
                        }} AED</span>
                      </td>
                      <td>
                        <span class="text-nowrap">{{
                          separateDateAndTime(gregorianToJalali(item.createdAt))
                            .date
                        }}</span>
                      </td>
                      <td>
                        <span class="text-nowrap">{{
                          separateDateAndTime(gregorianToJalali(item.createdAt))
                            .time
                        }}</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div v-else>
                <div class="alert alert-warning">{{ phrases.components.profile.transactions.noItem }}</div>
              </div>
              <Pager
                :collection="transactions"
                @search="(value) => searchSubmit(value)"
              />
            </div>

            <div v-show="status === 'search'">
              <div class="mb-4">
                <div class="card-header bg-white">
                  <h3 class="mb-0">{{ phrases.components.profile.transactions.searchTransactions }}</h3>
                </div>
                <form>
                  <div class="card-body mt-2">
                    <div class="row">
                      <div class="col-12 col-lg-3 my-2">
                        <div class="form-group">
                          <label>{{ phrases.components.profile.transactions.transactionCode }}</label>

                          <input
                            v-model="transactions.filters.query.transactionId"
                            type="text"
                            class="form-control form-input"
                          />
                        </div>
                      </div>
                      <!-- <div class="col-12 col-lg-3 my-2">
                        <div class="form-group">
                          <label>نوع تراکنش</label>

                          <select
                            class="form-control form-input"
                            v-model="transactions.filters.query.source"
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
                          <label>{{ phrases.components.profile.transactions.minDate }}</label>

                          <input
                            v-model="transactions.filters.query.minDateJalali"
                            type="text"
                            class="form-control form-input"
                            maxlength="10"
                            @change="handleMinMaxChange('minDate')"
                          />
                        </div>
                      </div>
                      <div class="col-12 col-lg-3 my-2">
                        <div class="form-group">
                          <label>{{ phrases.components.profile.transactions.maxDate }}</label>

                          <input
                            v-model="transactions.filters.query.maxDateJalali"
                            type="text"
                            class="form-control form-input"
                            maxlength="10"
                            @change="handleMinMaxChange('minDate')"
                          />
                        </div>
                      </div>
                      <div class="col-12 col-lg-3 my-2">
                        <div class="form-group">
                          <label>{{ phrases.components.profile.transactions.limit }}</label>

                          <select
                            class="form-control form-input"
                            v-model="transactions.filters.limit"
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
                          <label>{{ phrases.components.profile.transactions.order }}</label>

                          <select
                            class="form-control form-input"
                            v-model="transactions.filters.order"
                          >
                            <option value="transactionId[z-a]">
                              {{ phrases.components.profile.transactions.newest }}
                            </option>
                            <option value="transactionId[a-z]">
                              {{ phrases.components.profile.transactions.oldest }}
                            </option>
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
                    {{ phrases.components.profile.transactions.search }}
                    </button>
                    <button
                      class="btn btn-secondary"
                      @click.prevent="close()"
                    >
                    {{ phrases.components.profile.transactions.cancel }}
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
.fa-close {
  cursor: pointer;
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
.search-order-btn-wrapper {
  button {
    width: 100%;
    @media (min-width: 992px) {
      width: 30%;
    }
  }
}
</style>
