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

const store = useMainStore();
const loginForm = ref({
  email: null,
  password: null,
});

const handleSubmit = async (e) => {
  const response = await axios.post("/account/login/by-password", {
    email: loginForm.value.email,
    password: loginForm.value.password,
  });

  loginForm.value.email = null;
  loginForm.value.password = null;
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
      pageContext.data.lng !== "fr" ? "/" + pageContext.data.lng : "/";
  }
};

const handleCancel = () => {
  loginForm.value.email = null;
  loginForm.value.password = null;
};

onMounted(async () => {
});
</script>
<template>
  <div class="login-page container-lg mb-5">
    <div class="login-box">
      <div class="row p-2 align-items-center">
        <div class="col-12 col-md-6">
          <div >
            <!-- {{ removeLeadingZero(loginForm.phone) }} -->
            <form
              class="pt-3 p-md-4 d-flex flex-column h-100 justify-content-center"
              @submit.prevent="handleSubmit"
            >
              <h1 class="mt-2 mt-md-0 mb-4">
                {{ phrases.pages.login.header }}
              </h1>

              <div class="row d-flex align-items-center">
                <div class="col-12 col-lg-6 p-lg-0 mb-2">
                  <input
                    class="form-control"
                    placeholder="email"
                    type="email"
                    v-model="loginForm.email"
                  />
                </div>
                <div class="col-12 col-lg-6 p-lg-0 mb-2">
                  <input
                    class="form-control"
                    placeholder="password"
                    type="password"
                    v-model="loginForm.password"
                  />
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
  min-height: calc(100vh - 151px);
  @media (min-width: 992px) {
    min-height: calc(100vh - 183px);
  }
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
