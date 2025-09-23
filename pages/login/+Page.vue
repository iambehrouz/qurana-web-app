<script setup>
import { ref, onMounted } from "vue";
import * as cookies from "vue-cookies";
import axios from "../../helpers/axios";
import config from "../../config.json";
import { useMainStore } from "../../stores/main";
import * as langauges from "../../languages/index";
import { usePageContext } from "../../renderer/usePageContext";

const pageContext = usePageContext();
const phrases = langauges.getPhrases(pageContext.data.lng);

const countries = ref({
  items: [],
  filters: {
    offset: null,
    limit: null,
  },
});

const store = useMainStore();
const selectedCountry = ref('+971'); // Default country
const removeLeadingZero = (number) => String(parseInt(number, 10))
const status = ref("request");
const loginForm = ref({
  phone: null,
  token: null,
  password: null,
  hash: null,
  isNewAccount: false,
  fullname: null,
});

const handleSubmit = async (e) => {
  let formattedPhoneNumber = removeLeadingZero(loginForm.value.phone)
  if (status.value === "request") {
    if (!loginForm.value.phone || loginForm.value.phone.length < 8) return;

    const response = await axios.post("/account/login/request", {
      regex: selectedCountry.value,
      phone: formattedPhoneNumber,
    });

    loginForm.value.hash = response.data.data.hash;

    store.layout.toasts.push({
      type: response.data.status ? "success" : "danger",
      title: " verification code",
      message: response.data.message,
      datetime: new Date(),
    });

    if (response.data.data.isNewAccount === true) {
      loginForm.value.isNewAccount = true;
    } else {
      loginForm.value.isNewAccount = false;
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

    loginForm.value.fullname = null;
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

    if (res) {
      window.location =
        pageContext.data.lng !== "en" ? "/" + pageContext.data.lng : "/";
    }
  }
};

const handleCancel = () => {
  status.value = "request";
  loginForm.value.phone = null;
  loginForm.value.token = null;
  loginForm.value.hash = null;
  loginForm.value.password = null;
  loginForm.value.fullname = null;
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
  <div class="login-page container-lg mb-5">
    <div class="login-box">
      <div class="row p-2 align-items-center">
        <div class="col-12 col-md-6">
          <div v-if="status === 'request'">
            <!-- {{ removeLeadingZero(loginForm.phone) }} -->
            <form
              class="pt-3 p-md-4 d-flex flex-column h-100 justify-content-center"
              @submit.prevent="handleSubmit"
            >
              <h1 class="mt-2 mt-md-0 mb-4">
                {{ phrases.pages.login.header }}
              </h1>

              <div class="row d-flex align-items-center">
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
                <!-- <div class="mb-2">
                <input
                  class="form-control"
                  placeholder="کلمه عبور"
                  type="password"
                />
              </div> -->
                <div class="mb-2 mt-4">
                  <p class="form-check-label ps-2" for="rememberMe">
                    {{ phrases.pages.login.request }}
                  </p>
                </div>
              </div>
              <!-- <div class="mb-2">
              <a href="/login" class="forgot-link">رمز عبورم را فراموش کردم</a>
            </div> -->
              <div class="justify-self-end">
                <button
                  class="btn w-100 submit-btn mt-4 mb-3 mb-lg-0"
                  type="submit"
                >
                  {{ phrases.pages.login.login }}
                </button>
              </div>
              <!-- <a href="/register" class="btn w-100 outlined-btn mt-2">
              حساب کاربری ندارم و می خواهم ثبت نام کنم (ثبت نام)
            </a> -->
            </form>
          </div>
          <div v-if="status === 'verify'">
            <form
              class="pt-3 p-md-4 d-flex flex-column h-100 justify-content-center"
              @submit.prevent="handleSubmit"
            >
              <h1 class="mt-2 mt-md-4 mb-4">{{ phrases.pages.login.login }}</h1>

              <div>
                <div class="mb-2" v-if="loginForm.isNewAccount">
                  <input
                    class="form-control"
                    placeholder="fullname"
                    type="text"
                    v-model="loginForm.fullname"
                  />
                </div>
                <div class="mb-2">
                  <input
                    class="form-control"
                    placeholder="verification code"
                    type="text"
                    v-model="loginForm.token"
                  />
                  <label class="text-muted fw-normal mt-2 ms-1">{{
                    phrases.pages.login.verify
                  }}</label>
                </div>
                <!-- <div class="mb-2">
                <input
                  class="form-control"
                  placeholder="کلمه عبور"
                  type="password"
                />
              </div> -->
              </div>
              <!-- <div class="mb-2">
              <a href="/login" class="forgot-link">رمز عبورم را فراموش کردم</a>
            </div> -->
              <div>
                <button class="btn w-100 submit-btn mt-4" type="submit">
                  {{ phrases.pages.login.submit }}
                </button>
                <button
                  class="btn w-100 outlined-btn mt-2"
                  @click="handleCancel"
                >
                  {{ phrases.pages.login.cancel }}
                </button>
              </div>
              <!-- <a href="/register" class="btn w-100 outlined-btn mt-2">
              حساب کاربری ندارم و می خواهم ثبت نام کنم (ثبت نام)
            </a> -->
            </form>
          </div>
        </div>
        <div class="d-none d-md-block col-md-6">
          <div class="login-img">
            <img src="../../assets/images/login.png" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login-page {
  .login-box {
    background: #a5b68d30;
    margin-top: 50px;
    border-radius: 7px;
    .country-select {
      appearance: auto;
    }
    h1 {
      text-align: center;
    }
    .login-img {
      height: 100%;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        overflow: hidden;
        border-radius: 7px;
      }
    }
    .form-control {
      border-radius: 7px;
      border: none;
      height: 40px;
      box-shadow: none;
    }
    .form-check-input {
      border: none;
      cursor: pointer;
      height: 15px;
      width: 15px;
      margin-right: auto;
      &:checked {
        background-color: var(--primary-color);
      }
      &:focus {
        box-shadow: none;
      }
    }
    .form-check-label {
      cursor: pointer;
    }
    .forgot-link {
      color: var(--primary-color);
      text-decoration: none;
    }

    .btn {
      font-size: 1.15rem;
      box-shadow: none;
      border-radius: 7px;
    }
    .submit-btn {
      background-color: var(--secondary-color);
      color: #fff;
    }
    .outlined-btn {
      background-color: transparent;
      color: var(--secondary-color);
      border: 1px solid var(--secondary-color);
    }
  }
}
</style>
