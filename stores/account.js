import { defineStore } from "pinia";
import axios from "../helpers/axios";
import router from "../router";
import { useMainStore } from "./main";

export const useAccountStore = defineStore("account", {
  state: () => ({
    token: null,
    user: null,
    loginForm: {
      phone: null,
      password: null,
    },
  }),
  actions: {
    async get() {
      const res = await axios.post("/account/get");
      if (res.data.status) {
        this.user = res.data.data.user;
      }
      return res;
    },

    async login() {
      const mainStore = useMainStore();
      const res = await axios.post(
        "/account/login/by-password",
        this.loginForm
      );

      if (res.data.status) {
        this.token = res.data.data.xAccessToken;
        this.user = res.data.data.user.userId;

        localStorage.setItem("x-access-token", this.token);
        localStorage.setItem("x-access-user", JSON.stringify(this.user));

        axios.defaults.headers.common["x-access-token"] = this.token;

        document.getElementById("navigation").classList.remove("d-none");
        document.getElementById("top-bar").classList.remove("d-none");

        router.push("/");
      } else if (res.data) {
        mainStore.layout.toasts.push({
          type: "danger",
          title: "login",
          message: res.data.message,
          datetime: new Date(),
        });
      }
    },
    async logout() {
      localStorage.removeItem("x-access-token");
      localStorage.removeItem("x-access-user");

      this.token = null;
      this.user = null;

      router.push("/login");
    },
  },
});
