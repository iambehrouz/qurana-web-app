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
  experience: "expert", // Default to expert as shown in image
});

const experienceOptions = [
  { key: "beginner", label: "beginner" },
  { key: "intermediate", label: "intermediate" },
  { key: "expert", label: "expert" },
];

const selectExperience = (experience) => {
  registerForm.value.experience = experience;
};

const handleSubmit = async (e) => {
  e.preventDefault();
  // TODO: Implement registration logic
  console.log("Registration form submitted:", registerForm.value);
};

const handleCancel = () => {
  registerForm.value.experience = "expert";
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
    <div class="register-box container pt-4 pb-0">
      <form class="experience-form m-0 p-0" @submit="handleSubmit">
        <h1 class="form-title">
          {{ phrases.pages.register.stepThree.title }}
        </h1>

        <div class="experience-options">
          <div
            v-for="option in experienceOptions"
            :key="option.key"
            class="experience-option"
            :class="{ selected: registerForm.experience === option.key }"
            @click="selectExperience(option.key)"
          >
            <div class="selection-indicator">
              <div class="indicator-inner"></div>
            </div>
            <div class="option-label text-center">
              {{ phrases.pages.register.stepThree[option.label] }}
            </div>
          </div>
        </div>

        <div class="container-fluid px-0 text-center submit-button" >
          <Link href="/register/step-three">
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
  min-height: calc(100vh - 122px);
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

.experience-form {
  // background-color: #fff;
  // padding: 40px;
  // border-radius: 8px;
  // box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  .form-title {
    font-family: "serif", serif;
    font-size: 2rem;
    font-weight: bold;
    color: #000;
    margin-bottom: 40px;
    text-align: center;
  }

  .experience-options {
    margin-bottom: 40px;

    .experience-option {
      &:nth-child(1) {
        .selection-indicator,
        .option-label {
          background-color: #ebd9f5 !important;
        }
      }

      &:nth-child(2) {
        .selection-indicator,
        .option-label {
          background-color: #dcbaed !important;
        }
      }

      &:nth-child(3) {
        .selection-indicator,
        .option-label {
          background-color: #c791e1 !important;
        }
      }
      display: flex;
      align-items: center;
      margin-bottom: 15px;
      cursor: pointer;
      transition: all 0.3s ease;

      .selection-indicator {
        width: 40px;
        height: 40px;
        // background-color: #e8d5f2;
        border-radius: 4px;
        margin-right: 15px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;

        .indicator-inner {
          width: 15px;
          height: 15px;
          // background-color: #8e44ad;
          border: 1px solid #fff;
          border-radius: 2px;
        }
      }

      .option-label {
        flex: 1;
        padding: 15px 20px;
        // background-color: #f8f4ff;
        border-radius: 8px;
        font-family: "sans-serif", sans-serif;
        font-size: 1rem;
        color: #333;
        font-weight: 500;
        transition: all 0.3s ease;
      }

      &.selected {
        // .selection-indicator {
        //   background-color: #e8d5f2;
        // }

        // .option-label {
        //   background-color: #d4a5f0;
        //   color: #333;
        // }
        .indicator-inner {
          background-color: #8e44ad;
          border-color: #8e44ad;
        }
      }

      // &:hover {
      //   .option-label {
      //     background-color: #f0e6ff;
      //   }

      //   &.selected .option-label {
      //     background-color: #d4a5f0;
      //   }
      // }
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
  .experience-form {
    padding: 30px 20px;
    margin: 0 10px;

    .form-title {
      font-size: 1.5rem;
      margin-bottom: 30px;
    }

    .experience-options {
      .experience-option {
        .option-label {
          padding: 12px 15px;
          font-size: 0.9rem;
        }
      }
    }
  }
}
</style>
