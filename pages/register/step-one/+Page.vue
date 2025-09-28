<script setup>
import { ref, onMounted } from "vue";
import * as cookies from "vue-cookies";
import axios from "../../../helpers/axios";
import config from "../../../config.json";
import { useMainStore } from "../../../stores/main";
import * as langauges from "../../../languages/index";
import { usePageContext } from "../../../renderer/usePageContext";
import Link from "../../../renderer/Link.vue";

const pageContext = usePageContext();
const phrases = langauges.getPhrases(pageContext.data.lng);

const store = useMainStore();
const registerForm = ref({
  firstname: null,
  lastname: null,
  email: null,
  age: null,
  isTermChecked: false,
});

const handleSubmit = async (e) => {
  e.preventDefault();
  // TODO: Implement registration logic
  console.log("Registration form submitted:", registerForm.value);
};

const handleCancel = () => {
  registerForm.value.firstname = null;
  registerForm.value.lastname = null;
  registerForm.value.email = null;
  registerForm.value.age = null;
  registerForm.value.isTermChecked = false;
};

onMounted(() => {
  const footer = document.getElementById("footer-wrapper");
  if(footer) {
    footer.classList.add("darkFooter");
  }
});
</script>
<template>
  <div class="register-page container-fluid px-0">
    <div class="top-image w-100">
      <img
        class="img-fluid"
        src="../../../assets/images/register-stepone-back.svg"
        alt="Register Top Image"
      />
    </div>
    <div class="register-box container px-4">
      <form class="register-form p-0 m-0" @submit="handleSubmit">
        <h1 class="form-title mb-5">
          {{ phrases.pages.register.stepOne.signUp }}
        </h1>

        <div class="form-group">
          <label class="form-label">{{
            phrases.pages.register.stepOne.firstName
          }}</label>
          <input
            type="text"
            v-model="registerForm.firstname"
            :placeholder="phrases.pages.register.stepOne.firstNamePlaceholder"
            class="form-input"
            required
          />
        </div>

        <div class="form-group">
          <label class="form-label">{{
            phrases.pages.register.stepOne.lastName
          }}</label>
          <input
            type="text"
            v-model="registerForm.lastname"
            :placeholder="phrases.pages.register.stepOne.lastNamePlaceholder"
            class="form-input"
            required
          />
        </div>

        <div class="form-group">
          <label class="form-label">{{
            phrases.pages.register.stepOne.email
          }}</label>
          <input
            type="email"
            v-model="registerForm.email"
            :placeholder="phrases.pages.register.stepOne.emailPlaceholder"
            class="form-input"
            required
          />
        </div>

        <div class="form-group">
          <label class="form-label">{{
            phrases.pages.register.stepOne.age
          }}</label>
          <input
            type="number"
            v-model="registerForm.age"
            :placeholder="phrases.pages.register.stepOne.agePlaceholder"
            class="form-input"
            required
          />
        </div>

        <div class="form-group checkbox-group">
          <label class="checkbox-label">
            <input
              type="checkbox"
              v-model="registerForm.isTermChecked"
              class="checkbox-input"
              required
            />
            <span class="checkbox-text">{{
              phrases.pages.register.stepOne.terms
            }}</span>
          </label>
        </div>

        <div class="container-fluid px-0 text-center submit-button" >
          <Link href="/register/step-two">
          {{ phrases.pages.register.stepOne.submit }}
        </Link>
        </div>
      </form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.register-page {
  margin-bottom: 70px;
  background-color: #fff;
  min-height: calc(100vh - 53px);
  @media (min-width: 992px) {
    min-height: calc(100vh - 183px);
  }

  .top-image {
    @media (min-width: 992px) {
      img {
        width: 100%;
      object-fit: cover;
      height: 300px;
      object-position: bottom;
      }
    }
  }

  .register-box {
    margin-top: 0;
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
    padding: 40px 20px;
  }
}

.register-form {
  // background-color: #fff;
  // padding: 40px;
  border-radius: 8px;
  // box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  .form-title {
    font-family: "serif", serif;
    font-size: 2rem;
    font-weight: bold;
    color: #000;
    margin-bottom: 30px;
    // text-align: center;
  }

  .form-group {
    margin-bottom: 25px;

    .form-label {
      display: block;
      font-family: "sans-serif", sans-serif;
      font-size: 0.9rem;
      color: #333;
      margin-bottom: 8px;
      font-weight: 500;
    }

    .form-input {
      width: 100%;
      padding: 12px 0;
      border: none;
      border-bottom: 1px solid #ddd;
      background: transparent;
      font-size: 1rem;
      color: #333;
      outline: none;
      transition: border-color 0.3s ease;

      &::placeholder {
        color: #999;
        font-size: 0.9rem;
      }

      &:focus {
        border-bottom-color: #ff6b35;
      }

      &:required:invalid {
        border-bottom-color: #b0b0b0;
      }
    }
  }

  .checkbox-group {
    margin-bottom: 30px;

    .checkbox-label {
      display: flex;
      align-items: center;
      cursor: pointer;
      font-family: "sans-serif", sans-serif;
      font-size: 0.9rem;
      color: #333;

      .checkbox-input {
        margin-right: 10px;
        width: 16px;
        height: 16px;
        accent-color: #ff6b35;
        background: #e7e7e7 !important;
        cursor: pointer;
      }

      .checkbox-text {
        line-height: 1.4;
      }
    }
  }

  .submit-button {
    width: 100%;
    background-color: var(--primary-color);
    color: white;
    border: none;
    padding: 15px 30px;
    border-radius: 6px;
    font-size: 1rem;
    font-weight: 500;
    font-family: "sans-serif", sans-serif;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #e55a2b;
    }

    &:active {
      transform: translateY(1px);
    }

    a {
      color: white;
    }
  }
}

@media (max-width: 768px) {
  .register-form {
    padding: 30px 20px;
    margin: 0 10px;

    .form-title {
      font-size: 1.5rem;
      margin-bottom: 25px;
    }
  }
}
</style>
