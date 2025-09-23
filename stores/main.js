import { defineStore } from "pinia";
import config from "../config.json";
import axios from "axios";

export const useMainStore = defineStore("main", {
  state() {
    return {
      layout: {
        toasts: [],
      },
      cart: {
        items: [],
      },
      settings: null,
    };
  },
  getters: {},
  actions: {
    async getSettings() {
      // console.log(this.settings, '!this.settings');

      var result = await axios
        .post(
          `${config.apiUrl}/settings/get`,
          {
            query: {
              settingKey: "theme",
            },
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then(function (response) {
          if (response.data.status == true) {
            return response.data.data.settings.items[0];
          } else if (response.data.status == false) {
            return null;
          }
        })
        .catch(function (error) {});

      this.settings = result;
    },
    async increaseCartItemCount(item) {
      let index = this.cart.items.findIndex(
        (obj) => obj.productItemId === item.productItemId
      );

      console.log(index, "this is index");

      const instockCount = await this.getProductItemStock(item);
      if (instockCount < 1) {
        this.layout.toasts.push({
          type: "danger",
          title: "  product",
          message: "The product you are looking for is unavailable.",
          datetime: new Date(),
        });

        this.removeItemFromCart(item);

        return;
      }

      if (Number(this.cart.items[index].cartCount) + 1 > instockCount) {
        this.layout.toasts.push({
          type: "danger",
          title: "  prooduct",
          message: "The requested number is more than the inventory.",
          datetime: new Date(),
        });

        this.cart.items[index].cartCount = instockCount;
        return;
      }
      this.cart.items[index].cartCount++;
      localStorage.setItem("cart", JSON.stringify(this.cart));
    },
    async decreaseCartItemCount(item) {
      let index = this.cart.items.findIndex(
        (obj) => obj.productItemId === item.productItemId
      );
      const instockCount = await this.getProductItemStock(item);
      if (instockCount < 1) {
        // helpers.ui.notification.show(
        //   null,
        //   helpers.ui.notification.types.error,
        //   "کالای مورد نظر شما ناموجود می‌باشد.",
        //   2
        // );
        this.removeItemFromCart(item);
      }
      if (Number(this.cart.items[index].cartCount) - 1 > instockCount) {
        // helpers.ui.notification.show(
        //   null,
        //   helpers.ui.notification.types.error,
        //   "تعداد درخواستی بیشتر از موجودی کالا می‌باشد.",
        //   2
        // );
        this.cart.items[index].cartCount = instockCount;
        return;
      }
      if (this.cart.items[index].cartCount > 1) {
        this.cart.items[index].cartCount--;
      } else {
        this.removeItemFromCart(item);
      }
      localStorage.setItem("cart", JSON.stringify(this.cart));
    },
    removeItemFromCart(item) {
      let index = this.cart.items.findIndex(
        (obj) => obj.productItemId === item.productItemId
      );
      this.cart.items.splice(index, 1);
      localStorage.setItem("cart", JSON.stringify(this.cart));
    },
    async getProductItemStock(item) {
      if(!this.settings) await this.getSettings()
      var settingsSellerId = this.settings.value.store.sellerId;
      var instockCount = 0;
      await axios
        .post(
          config.apiUrl + "/products/items/get",
          { query: { productItemId: item.productItemId } },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then(function (response) {
          let sellers =
            response.data.data.productItems.items[0].productItemSellers.filter(
              (seller) => {
                return seller.sellerId == settingsSellerId;
              }
            );
          if (sellers.length) {
            instockCount = sellers[0].count;
            return;
          } else {
            return;
          }
        })
        .catch(function (err) {
          return err;
        });
      return instockCount;
    },
    async accountGet() {
      var thisStore = this;
      await axios
        .post(config.apiUrl + "/account/get", {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then(function (response) {
          window.location.href = "/authorize";
        });
    },
    async checkLogin() {
      var thisStore = this;

      await axios
        .post(
          config.apiUrl + "/products/items/get",
          { query: { productItemId: item.productItemId } },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then(function (response) {
          window.location.href = "/authorize";
        });
    },
    loginStatusTrue() {
      this.account.loginStatus = true;
    },
  },
});
