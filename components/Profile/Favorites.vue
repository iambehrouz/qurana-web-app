<script setup>
import { onMounted, ref } from "vue";
import { usePageContext } from "../../renderer/usePageContext";
import * as langauges from "../../languages/index";
import { useMainStore } from "../../stores/main";
import Pager from "../PagerComponent.vue";
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
const status = ref("favorites");
const view = ref("grid");

const favorites = ref({
  items: [],
  filters: {
    query: {
      favoriteId: null,
      userId: null,
      objectType: null,
      objectId: null,
      minDate: null,
      maxDate: null,
      minDateJalali: null,
      maxDateJalali: null,
    },
    offset: 0,
    limit: 10,
    order: "newest",
  },
  pager: {
    itemsCount: 0,
    pagesCount: 1,
    currentPage: 1,
  },
});
const searchSubmit = async (page) => {
  status.value = "favorites";
  if (page) {
    favorites.value.filters.offset = (page - 1) * favorites.value.filters.limit;
    favorites.value.pager.currentPage = page;
  }
  const response = await axios.post("/favorites/get", favorites.value.filters);
  favorites.value.items = response.data.data.favorites.items;
  favorites.value.pager.itemsCount = response.data.data.favorites.count;
  favorites.value.pager.pagesCount = Math.floor(
    favorites.value.pager.itemsCount / favorites.value.filters.limit
  );
  if (favorites.value.pager.itemsCount % favorites.value.filters.limit != 0) {
    favorites.value.pager.pagesCount++;
  }
  for (const key in favorites.value.items) {
    const favorite = favorites.value.items[key];
    if (favorite.objectType === "product") {
      const response = await axios.post("/products/get", {
        query: {
          productId: favorite.objectId,
        },
      });
      favorite.product = response.data.data.products.items[0];
    }
  }
};

const searchOpen = () => {
  favorites.value.filters.query.title = null;
  favorites.value.filters.query.favoriteId = null;
  favorites.value.filters.query.status = null;
  favorites.value.filters.query.minDate = null;
  favorites.value.filters.query.maxDate = null;
  favorites.value.filters.query.minDateJalali = null;
  favorites.value.filters.query.maxDateJalali = null;
  favorites.value.filters.limit = 10;
  favorites.value.filters.offset = 0;
  favorites.value.filters.order = "newest";
  status.value = "search";
};

const handleMinMaxChange = (type) => {
  if (type === "minDate") {
    favorites.value.filters.query.minDate = jalaliDateToGregorian(
      favorites.value.filters.query.minDateJalali
    );
  }
  if (type === "maxDate") {
    favorites.value.filters.query.maxDate = jalaliDateToGregorian(
      favorites.value.filters.query.maxDateJalali
    );
  }
};

const close = () => {
  favorites.value.filters.query.favoriteId = null;
  favorites.value.filters.order = "newest";
  favorites.value.filters.query.minDate = null;
  favorites.value.filters.query.maxDate = null;
  favorites.value.filters.limit = 10;
  status.value = "favorites";
};
const removeFilters = () => {
  favorites.value.filters.query.favoriteId = null;
  favorites.value.filters.order = "newest";
  favorites.value.filters.query.minDate = null;
  favorites.value.filters.query.maxDate = null;
  favorites.value.filters.limit = 10;
  searchSubmit(1);
};

const toggleView = (e) => {
  status.value = "favorites";
  view.value = e;
};

const deleteFavorite = async (id) => {
  const response = axios.post("/favorites/delete", {
    favoriteId: id,
  });

  store.layout.toasts.push({
    type: "success",
    title: " favorite delete",
    message: response.message,
    datetime: new Date(),
  });

  searchSubmit(1);
};
onMounted(() => {
  if (!user.value) window.location = "/login";
  favorites.value.filters.query.userId = user.value.userId;
  searchSubmit(1);
});
</script>
<template>
  <div class="p-1">
    <div class="profile-title">
      <h6>{{ phrases.components.profile.favorites.title }}</h6>
    </div>
    <div class="profile-box">
      <div class="bg-white border rounded row">
        <div class="container-fluid pt-4">
          <div class="actions mb-4 mt-2" v-show="status === 'favorites'">
            <button
              :class="[
                'ms-1',
                { active: status === 'favorites' && view === 'grid' },
              ]"
              value="grid"
              @click="toggleView('grid')"
            >
              <i class="fas fa-table-cells-large"></i>
            </button>
            <button
              :class="[
                'ms-1',
                { active: status === 'favorites' && view === 'list' },
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
            <div v-show="status === 'favorites' && view === 'grid'">
              <div class="col-12 col-lg-4 mb-4">
                <button
                  class="w-100 btn btn-secondary"
                  @click="removeFilters"
                  v-if="
                    favorites.filters.query.favoriteId ||
                    favorites.filters.order !== 'newest' ||
                    favorites.filters.query.minDate ||
                    favorites.filters.query.maxDate ||
                    favorites.filters.limit != 10
                  "
                >
                  <span> {{ phrases.components.profile.favorites.removeFilters }} </span>
                  <i class="fa fa-close"></i>
                </button>
              </div>
              <div v-if="favorites.items.length > 0" class="row">
                <div
                  v-for="(item, index) in favorites.items"
                  :key="index"
                  class="col-12 col-md-6 col-lg-4 mb-3"
                >
                  <div class="card h-100" v-if="item.product">
                    <div
                      class="card-body grid-container d-flex flex-column justify-content-between"
                    >
                      <Link :href="'/store/product/' + item.product.productId">
                        <div
                          class="d-flex justify-content-between flex-wrap mb-3"
                        >
                          <div>
                            <span class="text-muted">{{ phrases.components.profile.favorites.code }} </span>
                            <span>{{ item.favoriteId }}</span>
                          </div>
                          <div>
                            <span class="text-muted">{{ phrases.components.profile.favorites.type }} </span>
                            <span>{{ phrases.components.profile.favorites.product }}</span>
                          </div>
                        </div>
                        <div v-if="item.product.coverFile" class="text-center">
                          <img
                            :src="apiUrl + item.product.coverFile.path"
                            class="img-fluid grid-img"
                          />
                        </div>
                        <div
                          class="d-flex justify-content-between flex-wrap mb-3"
                        >
                          <div>
                            <span class="text-muted">{{ phrases.components.profile.favorites.productName }} </span>
                            <span>{{ item.product.namePersian }}</span>
                          </div>
                        </div>
                        <!-- <div
                        class="d-flex justify-content-between flex-wrap mb-3"
                      >
                        <div>
                          <span class="text-muted">تاریخ : </span>
                          <span>{{
                            separateDateAndTime(
                              gregorianToJalali(item.createdAt)
                            ).date
                          }}</span>
                        </div>
                        <div>
                          <span class="text-muted">ساعت: </span>
                          <span>{{
                            separateDateAndTime(
                              gregorianToJalali(item.createdAt)
                            ).time
                          }}</span>
                        </div>
                      </div> -->
                      </Link>
                      <p
                        class="bg-light px-2 py-3 rounded d-flex justify-content-between grid-delete"
                        @click.prevent="deleteFavorite(item.favoriteId)"
                      >
                        <span class="text-muted">{{ phrases.components.profile.favorites.removeFav }}</span>
                        <i class="fa fa-trash text-danger"></i>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div v-else>
                <div class="alert alert-warning">{{ phrases.components.profile.favorites.noItem }}</div>
              </div>
              <Pager
                :collection="favorites"
                @search="(value) => searchSubmit(value)"
              />
            </div>

            <div v-show="status === 'favorites' && view === 'list'" class="row">
              <div class="col-12 col-lg-4 mb-4">
                <button
                  class="w-100 btn btn-secondary"
                  @click="removeFilters"
                  v-if="
                    favorites.filters.query.favoriteId ||
                    favorites.filters.order !== 'newest' ||
                    favorites.filters.query.minDate ||
                    favorites.filters.query.maxDate ||
                    favorites.filters.limit != 10
                  "
                >
                  <span> {{ phrases.components.profile.favorites.removeFilters }} </span>
                  <i class="fa fa-close"></i>
                </button>
              </div>
              <div
                v-if="favorites.items.length > 0"
                class="table-responsive pb-0"
              >
                <table class="table table-sm table-striped bg-white">
                  <colgroup>
                    <col width="120px" />
                  </colgroup>
                  <thead>
                    <tr>
                      <th scope="col">
                        <span class="text-nowrap">{{ phrases.components.profile.favorites.favItemCode }}</span>
                      </th>
                      <th scope="col">
                        <span class="text-nowrap">{{ phrases.components.profile.favorites.favItemType }}</span>
                      </th>
                      <!-- <th scope="col">
                        <span class="text-nowrap">نوع علاقه‌مندی</span>
                      </th> -->
                      <th scope="col">
                        <span class="text-nowrap">{{ phrases.components.profile.favorites.name }} </span>
                      </th>
                      <th scope="col">
                        <span class="text-nowrap">{{ phrases.components.profile.favorites.date }}</span>
                      </th>
                      <th scope="col">
                        <span class="text-nowrap">{{ phrases.components.profile.favorites.time }}</span>
                      </th>
                      <th scope="col"></th>
                      <th scope="col"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(item, index) in favorites.items"
                      :key="index"
                      v-show="item.product"
                    >
                      <td>
                        <span class="text-nowrap" v-if="item.product">{{
                          item.favoriteId
                        }}</span>
                      </td>
                      <td>
                        <span v-if="item.product" class="text-nowrap"
                          >{{ phrases.components.profile.favorites.product }}</span
                        >
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
                        <span
                          class="text-nowrap"
                          >{{ item.product.namePersian }}</span
                        >
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
                      <td>
                        <button
                          class="btn btn-sm btn-primary w-100 my-0"
                          @click="deleteFavorite(item.favoriteId)"
                        >
                        {{ phrases.components.profile.favorites.remove }}
                        </button>
                      </td>
                      <td>
                        <Link
                          class="btn btn-sm btn-info btn-secondary text-nowrap"
                          v-if="item.product"
                          :href="'/store/product/' + item.product.productId"
                        >
                        {{ phrases.components.profile.favorites.viewDetails }}
                      </Link>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div v-else>
                <div class="alert alert-warning">{{ phrases.components.profile.favorites.noItem }}</div>
              </div>
              <Pager
                :collection="favorites"
                @search="(value) => searchSubmit(value)"
              />
            </div>

            <div v-show="status === 'search'">
              <div class="mb-4">
                <div class="card-header bg-white">
                  <h3 class="mb-0">{{ phrases.components.profile.favorites.searchInFav }}</h3>
                </div>
                <form>
                  <div class="card-body mt-2">
                    <div class="row">
                      <div class="col-12 col-lg-3 my-2">
                        <div class="form-group">
                          <label>{{ phrases.components.profile.favorites.favItemCode }}</label>

                          <input
                            v-model="favorites.filters.query.favoriteId"
                            type="text"
                            class="form-control form-input"
                          />
                        </div>
                      </div>
                      <!-- <div class="col-12 col-lg-3 my-2">
                        <div class="form-group">
                          <label>نوع علاقه‌مندی</label>

                          <select
                            class="form-control form-input"
                            v-model="favorites.filters.query.source"
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
                          <label>{{ phrases.components.profile.favorites.minDate }}</label>

                          <input
                            v-model="favorites.filters.query.minDateJalali"
                            type="text"
                            class="form-control form-input"
                            maxlength="10"
                            @change="handleMinMaxChange('minDate')"
                          />
                        </div>
                      </div>
                      <div class="col-12 col-lg-3 my-2">
                        <div class="form-group">
                          <label>{{ phrases.components.profile.favorites.maxDate }}</label>

                          <input
                            v-model="favorites.filters.query.maxDateJalali"
                            type="text"
                            class="form-control form-input"
                            maxlength="10"
                            @change="handleMinMaxChange('minDate')"
                          />
                        </div>
                      </div>
                      <div class="col-12 col-lg-3 my-2">
                        <div class="form-group">
                          <label>{{ phrases.components.profile.favorites.limit }}</label>

                          <select
                            class="form-control form-input"
                            v-model="favorites.filters.limit"
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
                          <label>{{ phrases.components.profile.favorites.order }}</label>

                          <select
                            class="form-control form-input"
                            v-model="favorites.filters.order"
                          >
                            <option value="newest">{{ phrases.components.profile.favorites.newest }}</option>
                            <option value="oldest">{{ phrases.components.profile.favorites.oldest }}</option>
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
                    {{ phrases.components.profile.favorites.search }}
                    </button>
                    <button
                      class="btn btn-secondary"
                      @click.prevent="close()"
                    >
                    {{ phrases.components.profile.favorites.cancel }}
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
.grid-delete {
  font-size: 13px;
  cursor: pointer;
}
.grid-img {
  height: 90px;
  width: 90px;
  object-fit: cover;
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
  a {
    color: #303030;
    text-decoration: none;
    font-size: 13px;
  }
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
