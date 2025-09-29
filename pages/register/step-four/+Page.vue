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
  verse: 'verse1', // Default to verse1 as shown in image (selected)
});

const verseOptions = [
  { key: 'verse1', label: 'verse1' },
  { key: 'verse2', label: 'verse2' },
  { key: 'verse3', label: 'verse3' },
  { key: 'verse4', label: 'verse4' }
];

const selectVerse = (verse) => {
  registerForm.value.verse = verse;
};

const handleSubmit = async (e) => {
  e.preventDefault();
  // TODO: Implement registration logic
  console.log("Registration form submitted:", registerForm.value);
};

const handleCancel = () => {
  registerForm.value.verse = 'verse3';
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
      <form class="verse-form p-0 m-0" @submit="handleSubmit">
        <h1 class="form-title">
          {{ phrases.pages.register.stepFour.title }}
        </h1>

        <div class="verse-options">
          <div 
            v-for="option in verseOptions" 
            :key="option.key" 
            class="verse-option p-0"
            :class="{ 'selected': registerForm.verse === option.key }"
            @click="selectVerse(option.key)"
          >
            <div class="selection-indicator m-0">
              <div class="indicator-inner"></div>
            </div>
            <div class="verse-text">
              {{ phrases.pages.register.stepFour[option.label] }}
            </div>
          </div>
        </div>

        <div class="container-fluid px-0 text-center submit-button" >
          <Link href="/register/step-five">
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
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
    padding: 40px 20px;
  }
}

.verse-form {
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

  .verse-options {
    margin-bottom: 40px;

    .verse-option {
      display: flex;
      align-items: flex-start;
      margin-bottom: 20px;
      gap: 15px;
      cursor: pointer;
      transition: all 0.3s ease;

      .selection-indicator {
        width: 40px;
        height: 40px;
        // border: 2px solid #ff6b35;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        transition: all 0.3s ease;
        // padding: 15px;
        background-color: #fff;
        // border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

        .indicator-inner {
          width: 16px;
          height: 16px;
          // background-color: #8e44ad;
          border-radius: 3px;
          border: 1px solid var(--primary-color);
        }
      }

      .verse-text {
        flex: 1;
        padding: 10px;
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        font-family: "sans-serif", sans-serif;
        font-size: 0.9rem;
        color: #333;
        line-height: 1.6;
        font-weight: 400;
        transition: all 0.3s ease;
      }

      &.selected {
        .selection-indicator {
          .indicator-inner {
            border-color: #8e44ad;
          background-color: #8e44ad;
          }
        }
      }

      &:hover {
        .verse-text {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
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
  .verse-form {
    padding: 30px 20px;
    margin: 0 10px;

    .form-title {
      font-size: 1.5rem;
      margin-bottom: 30px;
    }

    .verse-options {
      .verse-option {
        padding: 15px;
        
        .selection-indicator {
          width: 40px;
          height: 40px;
          margin-right: 15px;
        }

        .verse-text {
          font-size: 0.8rem;
        }
      }
    }
  }
}
</style>
