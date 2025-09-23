<script setup>
import { ref, onMounted } from "vue";
import Loader from "./Loader.vue";
import { usePageContext } from "../renderer/usePageContext";
import * as cookies from "vue-cookies";
import config from "../config.json";
import axios from "../helpers/axios";
import { useMainStore } from "../stores/main";
import * as langauges from "../languages/index";

const store = useMainStore();
const emit = defineEmits(["login-verified", "close"]);
const props = defineProps(["show"]);
const pageContext = usePageContext();
const phrases = langauges.getPhrases(pageContext.data.lng);
const apiUrl = config.apiUrl;
const status = ref("request");
const countries = ref({
  items: [],
  filters: {
    offset: null,
    limit: null,
  },
});
const selectedCountry = ref("+971"); // Default country
const removeLeadingZero = (number) => String(parseInt(number, 10));
const loginForm = ref({
  phone: null,
  token: null,
  hash: null,
  fullname: null,
});
const isNewAccount = ref(false);
const loading = ref(false);

const handleSubmit = async (e) => {
  let formattedPhoneNumber = removeLeadingZero(loginForm.value.phone);
  if (status.value === "request") {
    loading.value = true;

    const response = await axios.post("/account/login/request", {
      regex: selectedCountry.value,
      phone: formattedPhoneNumber,
    });
    loginForm.value.hash = response.data.data.hash;
    store.layout.toasts.push({
      type: "success",
      title: " verification",
      message: response.data.message,
      datetime: new Date(),
    });

    loading.value = false;
    if (response.data.data.isNewAccount === true) {
      isNewAccount.value = true;
    } else {
      isNewAccount.value = false;
    }
    status.value = "verify";
  } else if (status.value === "verify") {
    const response = await axios.post("/account/login/verify", {
      regex: selectedCountry.value,
      phone: formattedPhoneNumber,
      token: loginForm.value.token,
      hash: loginForm.value.hash,
      fullname: loginForm.value.fullname,
    });
    cookies.set(
      "x-access-token",
      response.data.data.xAccessToken,
      "365d",
      null,
      config.cookieDomain
    );
    const res = await axios.post("/account/get", {
      "x-access-token": cookies.get("x-access-token"),
    });
    console.log(res, "res");
    if (res.data.status) {
      pageContext.data.user = response.data.data.user;
      emit("login-verified", response.data.data.user);
      clearLoginForm();
    } else {
      close();
    }
  }
};

const clearLoginForm = () => {
  loginForm.value.phone = null;
  loginForm.value.hash = null;
  loginForm.value.token = null;
  status.value = "request";
};

const backToRequest = () => {
  clearLoginForm();
  status.value = "request";
};
const close = () => {
  clearLoginForm();
  emit("close");
};
onMounted(async () => {
  try {
    const res = await axios.post(config.apiUrl + "/countries/get");
    if (res.status) {
      console.log(res.data.data);

      countries.value.items = res.data.data.countries.items;
    }
  } catch (err) {
    throw err;
  }
});
</script>

<template>
  <Transition name="modal">
    <div v-if="show" class="modal-mask" id="loginModal">
      <div class="modal-wrapper col-12 col-md-8 col-lg-5">
        <div class="modal-container p-3">
          <div class="modal-header d-flex justify-content-between mb-3">
            <div>
              <i class="fa fa-user"></i>
              <span>{{ phrases.components.LoginModal.header }}</span>
            </div>
            <button @click="close" class="close-btn">
              <i class="fa fa-close"></i>
            </button>
          </div>

          <div class="modal-body">
            <div class="logo-container mb-3">
              <img class="img-fluid" src="../assets/images/tt-logo.png" />
            </div>

            <form
              v-if="status === 'request'"
              class="p-lg-3"
              @submit.prevent="handleSubmit"
            >
              <p>
                {{ phrases.components.LoginModal.request }}
              </p>
              <div class="form-group">
                <div class="row mb-4 d-flex align-items-center">
                  <div class="col-12 col-lg-3 mb-2">
                    <select
                      v-model="selectedCountry"
                      class="form-control country-select"
                    >
                      <option
                        v-for="(country, index) in countries.items"
                        :key="index"
                        :value="country.code"
                      >
                        {{ country.name }}
                      </option>
                    </select>
                  </div>
                  <div class="col-3 col-lg-2 mb-2">
                    <input
                      class="form-control"
                      placeholder="phone number"
                      type="text"
                      readonly
                      v-model="selectedCountry"
                    />
                  </div>
                  <div class="col-9 col-lg-7 p-lg-0 mb-2">
                    <input
                      class="form-control"
                      placeholder="phone number"
                      type="text"
                      v-model="loginForm.phone"
                    />
                  </div>
                </div>
                
                <button class="form-control submit-btn mb-3">
                  {{ phrases.components.LoginModal.continue }}
                </button>
              </div>
            </form>
            <form
              v-if="status === 'verify'"
              class="position-relative p-3"
              @submit.prevent="handleSubmit"
            >
              <Loader v-if="loading" />
              <p>
                {{ phrases.components.LoginModal.verify }}
                {{ loginForm.phone }}.
                <a class="text-primary back-link" @click="backToRequest">{{
                  phrases.components.LoginModal.redirect
                }}</a>
              </p>
              <div class="form-group" v-if="isNewAccount">
                <div class="form-text mb-2">
                  {{ phrases.components.LoginModal.fullname }}
                </div>
                <input
                  class="form-control mb-3"
                  type="text"
                  v-model="loginForm.fullname"
                />
              </div>
              <div class="form-group">
                <div class="form-text mb-2">
                  {{ phrases.components.LoginModal.enterCode }}
                </div>
                <input
                  class="form-control mb-3"
                  type="text"
                  v-model="loginForm.token"
                />
                <button class="form-control submit-btn mb-3">
                  {{ phrases.components.LoginModal.login }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>
<style lang="scss">
.modal-enter-active,
.modal-leave-active {
  transition: all 0.5s ease;
  transform: translateY(0%);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  .modal-container {
    transform: translateY(-20%);
  }
}
#loginModal {
  position: fixed;
  z-index: 9999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);

  .modal-wrapper {
    display: flex;
    justify-content: center;
    margin: 30px auto 0 auto;
  }

  .modal-container {
    width: 100%;
    background-color: #fff;
    border-radius: 2px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
    padding: 10px;
  }

  .logo-container {
    text-align: center;
    img {
      max-height: 30px;
      width: auto;
    }
  }
  .submit-btn {
    background-color: var(--primary-color);
    color: #fff;
  }
  .close-btn {
    padding: 3px 7px;
    background-color: transparent;
    background-color: var(--divider-color);
    border-radius: var(--border-radius-sm);
    border: none;
    i {
      font-size: 18px;
    }
  }
  .loader-container {
    height: 100px;
    width: 100%;
    margin-top: 10px;
  }
  .back-link {
    cursor: pointer;
  }
}
</style>
