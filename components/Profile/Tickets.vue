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
// import helpers from "../../assets/scripts/helpers";

const pageContext = usePageContext();
const phrases = langauges.getPhrases(pageContext.data.lng);
const store = useMainStore();
const user = ref(pageContext.data.user);
const gregorianToJalali = helpers.datetime.gregorianToJalali;
const separateDateAndTime = helpers.datetime.separateDateAndTime;
const jalaliDateToGregorian = helpers.datetime.jalaliDateToGregorian;
const status = ref("tickets");
const view = ref("grid");
const apiUrl = config.apiUrl;

const tickets = ref({
  items: [],
  filters: {
    query: {
      title: null,
      hasUnread: null,
      status: null,
      ticketId: null,
      ownerId: null,
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
const updateForm = ref({});
const ticketForm = ref({
  messages: [],
  owner: {},
  creator: {},
  createdAt: {
    date: "",
    time: "",
  },
  updatedAt: { date: "", time: "" },
});
const uploadForm = ref({});
const addForm = ref({
  hasUnread: false,
  status: "adminPending",
  isReadonly: false,
});
const data = ref({
  user: {},
  ishide: false,
  preview: false,
  contextMarkdown: null,
  messages: "",
});
const addMessageForm = ref({
  attachments: [],
  contextType: "plain",
});

const searchSubmit = async (page) => {
  status.value = "tickets";
  if (page) {
    tickets.value.filters.offset = (page - 1) * tickets.value.filters.limit;
    tickets.value.pager.currentPage = page;
  }
  const response = await axios.post("/tickets/get", tickets.value.filters);
  tickets.value.items = response.data.data.tickets.items;
  tickets.value.pager.itemsCount = response.data.data.tickets.count;
  tickets.value.pager.pagesCount = Math.floor(
    tickets.value.pager.itemsCount / tickets.value.filters.limit
  );
  if (tickets.value.pager.itemsCount % tickets.value.filters.limit != 0) {
    tickets.value.pager.pagesCount++;
  }
};

const updateSubmit = async () => {
  await axios.post("/tickets/update", updateForm.value);
  if (addMessageForm.value.context.length > 0) {
    ticketMessagesAdd();
  } else {
    searchSubmit(1);
  }
};
const addSubmit = async () => {
  addForm.value.ownerId = user.value.userId;

  const response = await axios.post("/tickets/add", addForm.value);
  addForm.value.ticketId = response.data.data.ticket.ticketId;
  addMessageForm.value.ticketId = response.data.data.ticket.ticketId;
  searchSubmit(1);
  if (addMessageForm.value.context.length > 0) {
    ticketMessagesAdd();
  }
  addForm.value = {
    hasUnread: false,
    status: "adminPending",
    isReadonly: false,
  };
};

const ticketMessagesAdd = async () => {
  await axios.post("/tickets/messages/add", addMessageForm.value);
  addMessageForm.value = {
    attachments: [],
    contextType: "plain",
  };
  searchSubmit(1);
  // helpers.ui.notification.show(
  //   null,
  //   helpers.ui.notification.types.success,
  //   "پیام جدید ثبت شد.",
  //   helpers.configs.notificationTimeout
  // );
  store.layout.toasts.push({
    type: "success",
    title: "new ticket added",
    message: "your ticket added",
    datetime: new Date(),
  });
};

const searchOpen = () => {
  tickets.value.filters.query.title = null;
  tickets.value.filters.query.ticketId = null;
  tickets.value.filters.query.hasUnread = null;
  tickets.value.filters.query.status = null;
  tickets.value.filters.query.minDate = null;
  tickets.value.filters.query.maxDate = null;
  tickets.value.filters.limit = 10;
  tickets.value.filters.offset = 0;
  tickets.value.filters.order = "newest";
  status.value = "search";
};

const addOpen = () => {
  status.value = "add";
};
const close = () => {
  status.value = "tickets";
  addForm.value = {
    department: null,
    hasUnread: false,
    status: "adminPending",
    isReadonly: false,
  };
  addMessageForm.value = {};
  addMessageForm.value.ticketId = null;
  addMessageForm.value.attachments = [];
  searchSubmit();
};
const removeFilters = () => {
  tickets.value.filters.query.title = null;
  tickets.value.filters.query.ticketId = null;
  tickets.value.filters.query.hasUnread = null;
  tickets.value.filters.query.status = null;
  tickets.value.filters.order = "newest";
  tickets.value.filters.query.minDate = null;
  tickets.value.filters.query.maxDate = null;
  tickets.value.filters.query.minDateJalali = null;
  tickets.value.filters.query.maxDateJalali = null;
  tickets.value.filters.limit = 10;
  searchSubmit(1);
};

const uploadSubmit = (id) => {
  const xAccessToken = cookies.get("x-access-token");
  // loader.show();
  var formData = new FormData();
  // for (var i = 0; i < $(`#${id}`).get(0).files.length; i++) {
  //   formData.append("files", $(`#${id}`).get(0).files[i]);
  // }
  var inputElement = document.getElementById(id);
  for (var i = 0; i < inputElement.files.length; i++) {
    formData.append("files", inputElement.files[i]);
  }
  formData.append("usageType", "tickets");
  formData.append("x-access-token", xAccessToken);

  axios
    .post("/files/upload", formData)
    .then(function (response) {
      console.log(response);
      if (response.data.status == "redirect") {
        window.location.href = response.data.url;
      }
      if (response.data.status == true) {
        const files = response.data.data.files;
        addMessageForm.value.attachments.push(...files);
        store.layout.toasts.push({
          type: "success",
          title: "upload",
          message: response.message,
          datetime: new Date(),
        });
      } else if (response.data.status == false) {
        if (response.data.message !== undefined) {
          store.layout.toasts.push({
            type: "danger",
            title: "upload",
            message: response.message,
            datetime: new Date(),
          });
          // helpers.ui.notification.show(
          //   null,
          //   helpers.ui.notification.types.error,
          //   response.data.message
          // );
        }
      }
    })
    .catch(function (error) {
      store.layout.toasts.push({
        type: "danger",
        title: "upload",
        message: error.message,
        datetime: new Date(),
      });
    });
};
const deleteAttachment = (index) => {
  addMessageForm.value.attachments.splice(index, 1);
};

const handleMinMaxChange = (type) => {
  if (type === "minDate") {
    tickets.value.filters.query.minDate = jalaliDateToGregorian(
      tickets.value.filters.query.minDateJalali
    );
  }
  if (type === "maxDate") {
    tickets.value.filters.query.maxDate = jalaliDateToGregorian(
      tickets.value.filters.query.maxDateJalali
    );
  }
};

const returnDepartment = (value) => {
  switch (value) {
    case "finance":
      return "finance";
    case "support":
      return "support";
    case "management":
      return "management";
    case "sale":
      return "sale";
    case "feedback":
      return "feedback";
    default:
      return "not selected";
  }
};

const returnStatus = (value) => {
  switch (value) {
    case "adminPending":
      return "admin pending";
    case "userPending":
      return "user pending";
    case "close":
      return "closed";
    default:
      return "not selected";
  }
};
const toggleView = (e) => {
  status.value = "tickets";
  view.value = e;
};
const ticketOpen = async (ticketId) => {
  addMessageForm.value.ownerId = user.value.userId;
  addMessageForm.value.ticketId = ticketId;
  addMessageForm.value.hasUnread = false;
  addMessageForm.value.isReadOnly = false;
  addMessageForm.value.status = "adminPending";
  const response = await axios.post("/tickets/get", {
    query: { ticketId: ticketId },
  });
  ticketForm.value = response.data.data.tickets.items[0];
  addMessageForm.value.department =
    response.data.data.tickets.items[0].department;

  status.value = "ticket";
  let unreadData = response.data.data.tickets.items[0];
  unreadData.hasUnread = false;
  await axios.post("/tickets/update", unreadData);
};

onMounted(() => {
  if (!user.value) window.location = "/login";

  tickets.value.filters.query.ownerId = user.value.userId;
  searchSubmit(1);
});
</script>
<template>
  <div class="p-1">
    <div class="profile-title">
      <h6>{{ phrases.components.profile.tickets.mainTitle }}</h6>
    </div>
    <div class="profile-box">
      <div class="bg-white border rounded row">
        <div class="container-fluid pt-4">
          <div class="actions mb-4 mt-2" v-show="status === 'tickets'">
            <button
              :class="[
                'ms-1',
                { active: status === 'tickets' && view === 'grid' },
              ]"
              value="grid"
              @click="toggleView('grid')"
            >
              <i class="fas fa-table-cells-large"></i>
            </button>
            <button
              :class="[
                'ms-1',
                { active: status === 'tickets' && view === 'list' },
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
            <div v-show="(status === 'tickets') & (view === 'grid')">
              <div class="mb-4  d-flex flex-column align-items-end">
                <div class="col-12 d-flex justify-content-end add-ticket-btn-wrapper">
                  <button class="btn btn-primary my-2" @click="addOpen">
                    {{ phrases.components.profile.tickets.addNewTicket }}
                  </button>
                </div>
                <div
                  class="col-12 col-lg-4"
                  v-if="
                    tickets.filters.query.title ||
                    tickets.filters.query.ticketId ||
                    tickets.filters.query.hasUnread ||
                    tickets.filters.query.status ||
                    tickets.filters.order !== 'newest' ||
                    tickets.filters.query.minDate ||
                    tickets.filters.query.maxDate ||
                    tickets.filters.limit != 10
                  "
                >
                  <button
                    class="w-100 btn btn-secondary"
                    @click="removeFilters"
                  >
                    <span> {{ phrases.components.profile.tickets.removeFilters }} </span>
                    <i class="fa fa-close"></i>
                  </button>
                </div>
              </div>
              <div v-if="tickets.items.length > 0" class="row">
                <div
                  v-for="(item, index) in tickets.items"
                  :key="index"
                  class="col-12 col-md-6 col-lg-4 mb-3"
                  @click="ticketOpen(item.ticketId)"
                >
                  <div
                    :class="['card', { 'border-dark fw-bold': item.hasUnread }]"
                    class="h-100"
                  >
                    <div class="card-body grid-container">
                      <div class="d-flex justify-content-between flex-wrap">
                        <div>
                          <div
                            v-show="item.hasUnread"
                            class="grid-unread"
                          ></div>
                          <span
                            :class="['d-block', { 'mt-2 ': item.hasUnread }]"
                          >
                            {{ "ticket id: " + item.ticketId }}</span
                          >

                          <span class="d-block mb-3"> {{ item.title }}</span>

                          <span
                            class="grid-badge badge bg-secondary text-light fw-light"
                            >{{ returnStatus(item.status) }}</span
                          >
                          <span class="ms-2 messages-span">
                            <i class="fas fa-envelope"></i>
                            <span>{{ item.ticketMessages.length }}</span>
                          </span>
                        </div>
                        <div>
                          <span class="d-block mt-2">{{
                            separateDateAndTime(
                              gregorianToJalali(item.createdAt)
                            ).date
                          }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div v-else>
                <div class="alert alert-warning">{{ phrases.components.profile.tickets.noItem }}</div>
              </div>
              <Pager
                :collection="tickets"
                @search="(value) => searchSubmit(value)"
              />
            </div>

            <div
              v-show="(status === 'tickets') & (view === 'list')"
              class="row"
            >
              <div class="mb-4 d-flex flex-column align-items-end">
                <div class="col-12 d-flex justify-content-end add-ticket-btn-wrapper">
                  <button class="btn btn-primary my-2" @click="addOpen">
                    {{ phrases.components.profile.tickets.addNewTicket }}
                  </button>
                </div>
                <div class="col-12 col-lg-4">
                  <button
                    v-if="
                      tickets.filters.query.title ||
                      tickets.filters.query.ticketId ||
                      tickets.filters.query.hasUnread ||
                      tickets.filters.query.status ||
                      tickets.filters.order !== 'newest' ||
                      tickets.filters.query.minDate ||
                      tickets.filters.query.maxDate ||
                      tickets.filters.limit != 10
                    "
                    class="w-100 btn btn-secondary"
                    @click="removeFilters"
                  >
                    <span> {{ phrases.components.profile.tickets.removeFilters }} </span>
                    <i class="fa fa-close"></i>
                  </button>
                </div>
              </div>
              <div
                v-if="tickets.items.length > 0"
                class="table-responsive pb-0"
              >
                <table class="table table-sm table-striped bg-white">
                  <colgroup>
                    <col width="120px" />
                    <col width="40px" />
                  </colgroup>
                  <thead>
                    <tr>
                      <th scope="col">
                        <span class="text-nowrap">{{ phrases.components.profile.tickets.ticketCode }}</span>
                      </th>
                      <th scope="col">
                        <span class="text-nowrap"> </span>
                      </th>
                      <th scope="col">
                        <span class="text-nowrap">{{ phrases.components.profile.tickets.title }}</span>
                      </th>

                      <th scope="col"><span class="text-nowrap">{{ phrases.components.profile.tickets.department }}</span></th>
                      <th scope="col">
                        <span class="text-nowrap">{{ phrases.components.profile.tickets.status }}</span>
                      </th>
                      <th scope="col">
                        <span class="text-nowrap">{{ phrases.components.profile.tickets.date }}</span>
                      </th>
                      <th scope="col"><span class="text-nowrap">{{ phrases.components.profile.tickets.time }}</span></th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, index) in tickets.items" :key="index">
                      <td>
                        <span class="text-nowrap">{{ item.ticketId }}</span>
                      </td>
                      <td>
                        <div v-if="item.hasUnread" class="list-unread"></div>
                        <div v-else class="text-nowrap"></div>
                      </td>
                      <td>
                        <span class="text-nowrap">{{ item.title }}</span>
                      </td>

                      <td>
                        <span class="text-nowrap">{{
                          returnDepartment(item.department)
                        }}</span>
                      </td>
                      <td>
                        <span class="text-nowrap">{{
                          returnStatus(item.status)
                        }}</span>
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
                          class="btn btn-sm btn-info btn-secondary text-nowrap"
                          @click="ticketOpen(item.ticketId)"
                        >
                        {{ phrases.components.profile.tickets.viewDetails }}
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div v-else>
                <div class="alert alert-warning"> {{ phrases.components.profile.tickets.noItem }}</div>
              </div>

              <Pager
                :collection="tickets"
                @search="(value) => searchSubmit(value)"
              />
            </div>

            <div v-show="status === 'search'">
              <div class="mb-4">
                <div class="card-header bg-white">
                  <h3 class="mb-0">{{ phrases.components.profile.tickets.searchTickets }}</h3>
                </div>
                <form>
                  <div class="card-body mt-2">
                    <div class="row">
                      <div class="col-12 col-lg-2 my-2">
                        <div class="form-group">
                          <label>{{ phrases.components.profile.tickets.ticketCode }}</label>
                          <input
                            v-model="tickets.filters.query.ticketId"
                            type="text"
                            class="form-control form-input"
                          />
                        </div>
                      </div>
                      <div class="col-12 col-lg-4 my-2">
                        <div class="form-group">
                          <label>{{ phrases.components.profile.tickets.title }}</label>

                          <input
                            v-model="tickets.filters.query.title"
                            type="text"
                            class="form-control form-input"
                          />
                        </div>
                      </div>

                      <!-- <div class="col-12 col-lg-3 my-2">
                        <div class="form-group">
                          <label class="">خوانده نشده</label>

                          <select
                            class="form-control form-input"
                            v-model="tickets.filters.query.hasUnread"
                          >
                            <option :value="true">فقط خوانده نشده</option>
                            <option :value="false">فقط خوانده شده</option>
                          </select>
                        </div>
                      </div>
                      <div class="col-12 col-lg-3 my-2">
                        <div class="form-group">
                          <label>وضعیت</label>

                          <select
                            class="form-control form-input"
                            v-model="tickets.filters.query.status"
                          >
                            <option value="adminPending">
                              در انتظار ادمین
                            </option>
                            <option value="userPending">در انتظار کاربر</option>
                          </select>
                        </div>
                      </div> -->
                    </div>
                    <div class="row">
                      <div class="col-12 col-lg-3 my-2">
                        <div class="form-group">
                          <label>{{ phrases.components.profile.tickets.minDate }}</label>
                          <input
                            v-model="tickets.filters.query.minDateJalali"
                            type="text"
                            maxlength="10"
                            class="form-control form-input"
                            @change="handleMinMaxChange('minDate')"
                          />
                        </div>
                      </div>
                      <div class="col-12 col-lg-3 my-2">
                        <div class="form-group">
                          <label>{{ phrases.components.profile.tickets.maxDate }}</label>
                          <input
                            v-model="tickets.filters.query.maxDateJalali"
                            type="text"
                            maxlength="10"
                            class="form-control form-input"
                            @change="handleMinMaxChange('maxDate')"
                          />
                        </div>
                      </div>
                      <div class="col-12 col-lg-3 my-2">
                        <div class="form-group">
                          <label>{{ phrases.components.profile.tickets.limit }}</label>
                          <select
                            class="form-control form-input"
                            v-model="tickets.filters.limit"
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
                          <label>{{ phrases.components.profile.tickets.order }}</label>

                          <select
                            class="form-control form-input"
                            v-model="tickets.filters.order"
                          >
                            <option value="newest">{{ phrases.components.profile.tickets.newest }}</option>
                            <option value="oldest">{{ phrases.components.profile.tickets.oldest }}</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="d-flex flex-column align-items-end pt-4 search-order-btn-wrapper">
                    <button
                      class="btn btn-primary mb-2"
                      @click.prevent="searchSubmit(1)"
                    >
                    {{ phrases.components.profile.tickets.search }}
                    </button>
                    <button
                      class="btn btn-secondary"
                      @click.prevent="close()"
                    >
                    {{ phrases.components.profile.tickets.cancel }}
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <div v-show="status === 'add'">
              <div>
                <div class="card-header bg-white">
                  <h3>new ticket</h3>
                </div>
                <form @submit.prevent="addSubmit()">
                  <div class="card-body mt-2">
                    <div class="row">
                      <div class="col-12 col-lg-6 my-2">
                        <div class="form-group">
                          <label>{{ phrases.components.profile.tickets.ticketTitle }}</label>

                          <input
                            required
                            v-model="addForm.title"
                            type="text"
                            class="form-control form-input"
                          />
                        </div>
                      </div>
                      <div class="col-12 col-lg-6 my-2">
                        <div class="form-group">
                          <label>{{ phrases.components.profile.tickets.department }}</label>

                          <select
                            class="form-control"
                            v-model="addForm.department"
                            required
                          >
                            <option :value="undefined" disabled>
                              {{ phrases.components.profile.tickets.select }}
                            </option>
                            <option value="finance">{{ phrases.components.profile.tickets.finance }}</option>
                            <option value="support">{{ phrases.components.profile.tickets.support }}</option>
                            <option value="management">{{ phrases.components.profile.tickets.management }}</option>
                            <option value="sale">{{ phrases.components.profile.tickets.sale }}</option>
                            <option value="feedback">{{ phrases.components.profile.tickets.feedback }}</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="form-group mt-4 col-12">
                        <h3>{{ phrases.components.profile.tickets.msgText }}</h3>
                        <textarea
                          class="form-control mb-4"
                          rows="7"
                          v-model="addMessageForm.context"
                        ></textarea>
                        <div
                          v-for="(item, index) in addMessageForm.attachments"
                          :key="index"
                          class="border rounded my-2 p-2 d-flex justify-content-between flex-wrap"
                        >
                          <div>
                            <i class="fas fa-paperclip ms-2"></i>
                            <span> {{ item.name + item.extension }} </span>
                          </div>
                          <div>
                            <a
                              class="btn text-success eye-icon"
                              :href="apiUrl + item.path"
                              target="_blank"
                            >
                              <i class="fa fa-eye"></i>
                            </a>

                            <button
                              class="btn text-danger trash-icon"
                              @click="deleteAttachment(index)"
                            >
                              <i class="fa fa-trash"></i>
                            </button>
                          </div>
                        </div>
                        <label
                          class="btn btn-light w-100 mt-3"
                          for="new-ticket-attachment-file"
                        >
                          <i class="fas fa-upload"></i>
                          {{ phrases.components.profile.tickets.fileAttachment }}
                          <input
                            id="new-ticket-attachment-file"
                            name="new-ticket-attachment-file"
                            type="file"
                            multiple
                            class="d-none"
                            ref="fileupload"
                            @change="uploadSubmit('new-ticket-attachment-file')"
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  <div class="d-flex flex-column">
                    <button class="btn btn-primary w-100 mb-2" type="submit">
                      {{ phrases.components.profile.tickets.submit }}
                    </button>
                    <button
                      class="btn btn-secondary w-100"
                      @click.prevent="close()"
                    >
                    {{ phrases.components.profile.tickets.cancel }}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div v-show="status === 'ticket'" class="ticket-details">
            <div class="card mb-4">
              <div class="card-body">
                <div class="mb-4">
                  <h3 class="fw-bold">{{ ticketForm.title }}</h3>
                  <span>{{ "ticket id: " + ticketForm.ticketId }}</span>
                  <div class="ticket-date">
                    <span class="d-inline-block ms-2">{{ phrases.components.profile.tickets.registerationDate }} </span>
                    <span class="ms-2 d-inline-block"
                      >{{
                        separateDateAndTime(
                          gregorianToJalali(ticketForm.createdAt)
                        ).date
                      }}
                    </span>
                    <span>{{ ticketForm.createdAt.time }} </span>
                  </div>
                  <div class="ticket-date">
                    <span class="d-inline-block ms-2"> {{ phrases.components.profile.tickets.updateDate }} </span>
                    <span class="ms-2 d-inline-block"
                      >{{
                        separateDateAndTime(
                          gregorianToJalali(ticketForm.updatedAt)
                        ).date
                      }}
                    </span>
                    <span
                      >{{
                        separateDateAndTime(
                          gregorianToJalali(ticketForm.updatedAt)
                        ).time
                      }}
                    </span>
                  </div>
                  <div class="mt-2">
                    <span class="inline-block ms-2">{{ phrases.components.profile.tickets.sentDepartment }} </span>
                    <span>{{ returnDepartment(ticketForm.department) }}</span>
                  </div>
                  <div class="mt-2 d-flex">
                    <span class="inline-block ms-2">{{ phrases.components.profile.tickets.status }}</span>
                    <div class="badge bg-secondary grid-badge">
                      {{ returnStatus(ticketForm.status) }}
                    </div>
                  </div>
                </div>
                <div class="pt-4">
                  <h3 class="fw-bold">{{ phrases.components.profile.tickets.messages }}</h3>
                  <div
                    v-for="(item, index) in ticketForm.ticketMessages"
                    :key="index"
                    class="col-12"
                  >
                    <div class="message-container bg-light my-4 p-4">
                      <div class="message-info mb-4 d-flex">
                        <img src="../../assets/images/user.png" class="ms-3" />
                        <div>
                          <span class="fw-bold d-block mt-1">{{
                            item.creator.fullname
                          }}</span>
                          <span class="ticket-date"
                            >{{ phrases.components.profile.tickets.registerationDate }} ‌{{
                              gregorianToJalali(item.createdAt)
                            }}</span
                          >
                        </div>
                      </div>
                      <div class="message-text">
                        <p>
                          {{ item.context }}
                        </p>
                      </div>
                      <div
                        v-show="item.attachments.length > 0"
                        class="message-attachments"
                      >
                        <span class="fw-bold">{{ phrases.components.profile.tickets.attachments }}</span>
                        <div
                          v-for="(item, index) in item.attachments"
                          :key="index"
                          class="my-2"
                        >
                          <a :href="apiUrl + item.path" target="_blank">
                            <i class="fas fa-paperclip"> </i>
                            <span class="d-inline-block ms-2">{{
                              item.name + item.extension
                            }}</span></a
                          >
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="form-group mt-4 col-12">
                    <h3 class="fw-bold">{{ phrases.components.profile.tickets.newMsg }}</h3>
                    <textarea
                      class="form-control mb-4"
                      rows="7"
                      v-model="addMessageForm.context"
                    ></textarea>
                    <div
                      v-for="(item, index) in addMessageForm.attachments"
                      :key="index"
                      class="border rounded my-2 p-2 d-flex justify-content-between flex-wrap"
                    >
                      <div>
                        <i class="fas fa-paperclip ms-2"></i>
                        <span> {{ item.name + item.extension }} </span>
                      </div>
                      <div>
                        <a
                          class="btn text-success eye-icon"
                          :href="apiUrl + item.path"
                          target="_blank"
                        >
                          <i class="fa fa-eye"></i>
                        </a>

                        <button
                          class="btn text-danger trash-icon"
                          @click="deleteAttachment(index)"
                        >
                          <i class="fa fa-trash"></i>
                        </button>
                      </div>
                    </div>
                    <label class="btn btn-light w-100 mt-3">
                      <i class="fas fa-upload"></i>
                      {{ phrases.components.profile.tickets.newFile }}
                      <input
                        id="message-attachment-file"
                        type="file"
                        required
                        multiple
                        class="d-none"
                        ref="fileupload"
                        @change="uploadSubmit('message-attachment-file')"
                      />
                    </label>
                  </div>
                </div>
              </div>
              <div class="d-flex flex-column">
                <button
                  class="btn btn-primary w-100 mb-2"
                  @click="ticketMessagesAdd"
                >
                {{ phrases.components.profile.tickets.submit }}
                </button>
                <button class="btn btn-secondary w-100" @click.prevent="close">
                  {{ phrases.components.profile.tickets.cancel }}
                </button>
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

.list-unread {
  background-color: rgb(233, 45, 45);
  border: 1px solid #e4e4e4;
  width: 15px;
  height: 15px;
  margin-top: 7px;
  border-radius: 50%;
}
.grid-unread {
  background-color: rgb(233, 45, 45);
  border: 1px solid #e4e4e4;
  border-radius: 50%;
  width: 15px;
  height: 15px;
  position: absolute;
  top: 5px;
  left: 5px;
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
.ticket-date {
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
.add-ticket-btn-wrapper {
  button {
    width: 100%;
    @media (min-width: 992px) {
      width: 33%;
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
</style>
