<script setup>
import { onMounted, ref } from "vue";
import { usePageContext } from "../../renderer/usePageContext";
import * as cookies from "vue-cookies";

const pageContext = usePageContext();
const amount = ref(null);
const user = ref(pageContext.data.user);

const pay = () => {
  if (!amount.value) return;
  const xAccessToken = cookies.get("x-access-token");
  window.location.href = `https://api.khanedaroo.com/payment/zarinpal?x-access-token=${xAccessToken}&amount=${amount.value}`;
};
onMounted(() => {
  if (!user.value) window.location = "/login";
});
</script>
<template>
  <div class="p-1">
    <div class="profile-title">
      <h6>Balance increase</h6>
    </div>
    <div class="profile-box">
      <div class="bg-white border rounded row">
        <div class="container-fluid">
          <div class="my-3 fw-bold">
            <span>Account balance:</span>
            <span class="mx-2">{{
              user.balance ? user.balance.toLocaleString("en") : 0
            }}</span>
          </div>
          <div class="col-12 col-lg-6 my-2">
            <div class="form-group">
              <label>Amount of balance increase</label>

              <input
                v-model="amount"
                type="number"
                class="form-control form-input mt-2"
              />
            </div>
          </div>
          <hr />
          <div class="d-flex flex-column align-items-end balance-btn-wrapper">
            <button class="btn btn-primary mb-2" @click.prevent="pay">
              Payment and balance increase
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.balance-btn-wrapper {
  button {
    width: 100%;
    @media (min-width: 992px) {
      width: 30%;
    }
  }
}
</style>
