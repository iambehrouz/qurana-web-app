<script setup>
import { usePageContext } from "../../renderer/usePageContext";
import * as langauges from "../../languages/index";
import { ref, onMounted } from "vue";
import { useMainStore } from "../../stores/main";
import axios from "../../helpers/axios";

const store = useMainStore();
const pageContext = usePageContext();
const phrases = langauges.getPhrases(pageContext.data.lng);
const user = ref(pageContext.data.user);
const updateForm = ref({
  userId: user.value.userId,
  fullname: user.value.fullname,
  phone: user.value.phone,
});
const status = ref("info");
const updateSubmit = async () => {
  const response = await axios.post("/users/update", updateForm.value);
  console.log(response);
  if (response.data.status) {
    pageContext.data.user = response.data.user;
    updateForm.value.fullname = response.data.data.user.fullname;
    updateForm.value.phone = response.data.data.user.phone;
    user.value.fullname = response.data.data.user.fullname;
    user.value.phone = response.data.data.user.phone;
  }
  store.layout.toasts.push({
    type: "success",
    title: "  submit",
    message: response.data.message,
    datetime: new Date(),
  });
  status.value = "info";
};
onMounted(() => {
  if (!user.value) window.location = "/login";
});
</script>
<template>
  <div class="p-1">
    <div class="profile-title">
      <h6>{{ phrases.components.profile.home.title }}</h6>
    </div>
    <div class="profile-box">
      <div class="bg-white border rounded row">
        <div class="col-12 col-md-6 profile-col">
          <div class="profile-col-content">
            <span class="title">{{ phrases.components.profile.home.name }}</span>
            <span class="value" v-if="status === 'info'">{{
              user.fullname
            }}</span>
            <input
              v-if="status === 'edit'"
              type="text"
              v-model="updateForm.fullname"
              class="form-control mt-1 px-2"
            />
          </div>
        </div>

        <div class="col-12 col-md-6 profile-col">
          <div class="profile-col-content">
            <span class="title">{{ phrases.components.profile.home.phone }}</span>
            <span class="value" v-if="status === 'info'">{{ user.phone }}</span>
            <input
              v-if="status === 'edit'"
              type="text"
              v-model="updateForm.phone"
              class="form-control mt-1 px-2"
            />
          </div>
        </div>

        <div class="profile-box-btns p-0 align-items-end">
          <div class="d-flex flex-column flex-md-row-reverse gap-2 justify-content-start p-3">
            <button @click="status = 'edit'" v-if="status === 'info'">
              {{ phrases.components.profile.home.edit }}
            </button>
            <button
              @click="updateSubmit"
              v-if="status === 'edit'"
              class="fw-bold"
            >
            {{ phrases.components.profile.home.submit }}
            </button>
            <button
              @click="status = 'info'"
              v-if="status === 'edit'"
              class="fw-bold cancel-button"
            >
            {{ phrases.components.profile.home.cancel }}
            </button>
          </div>
          <!-- <div class="col-12 col-md-6">
            <button>تغیر رمز عبور</button>
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
input {
  font-size: 0.9rem;
  margin-right: 4px;
  padding: 3px;
}
.profile-title {
  h6 {
    color: #000;
    font-size: 1rem;
    position: relative;
    &::after {
      content: "";
      display: block;
      background-color: #3333;
      height: 1px;
      width: calc(100% - 170px);
      right: 0;
      top: 10px;
      position: absolute;
    }
  }
}
.profile-col {
  border: 1px solid #bfbfbf33;

  color: var(--text-secondary-color);

  .profile-col-content {
    min-height: 80px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    padding: 15px 10px;
    input {
      height: 40px;
    }
  }

  span {
    display: block;
    font-size: 0.9rem;
  }
  .value {
    padding-right: 10px;
    font-weight: bold;
    margin-top: 5px;
  }
}
.profile-box-btns {
  button {
    background-color: transparent;
    background-color: var(--secondary-color);
    color: #fff;
    text-align: center;
    width: 100%;
    height: 40px;
    border: none;
    border-radius: var(--border-radius-sm);
    @media (min-width: 992px) {
      width: 30% !important;
    }
  }
  .cancel-button {
    border: 1px solid var(--secondary-color);
    color: var(--secondary-color);
    background: transparent;
  }
}
</style>
