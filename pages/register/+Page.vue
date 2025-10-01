<script setup>
import { ref, onMounted } from "vue";
import * as cookies from "vue-cookies";
import axios from "../../helpers/axios";
import config from "../../config.json";
import { useMainStore } from "../../stores/main";
import * as langauges from "../../languages/index";
import { usePageContext } from "../../renderer/usePageContext";
import Link from "../../renderer/Link.vue";

const pageContext = usePageContext();
const phrases = langauges.getPhrases(pageContext.data.lng);

const store = useMainStore();
const status = ref("step-1");
const registerForm = ref({
  fullname: null,
  email: null,
  phone: null,
  age: null,
  isTermChecked: false,
  userLevelType: "advanced",
  verse: null,
  verseTwo: null,
  hadith: null,
  token: null,
  password: null,
  passwordverify: null,
  hash: null,
  participants: 1,
  city: null,
});
const message = ref("");
const showCityDropdown = ref(false);

const experienceOptions = [
  { key: "beginner", label: "beginner" },
  { key: "intermediate", label: "intermediate" },
  { key: "advanced", label: "advanced" },
];

const verseOptions = [
  { key: "verse1", label: "verse1" },
  { key: "verse2", label: "verse2" },
  { key: "verse3", label: "verse3" },
  { key: "verse4", label: "verse4" },
];

const hadithOptions = [
  { key: "hadith1", label: "hadith1" },
  { key: "hadith2", label: "hadith2" },
  { key: "hadith3", label: "hadith3" },
  { key: "hadith4", label: "hadith4" },
];

const participantOptions = [
  { key: 1, label: "onePerson" },
  { key: 2, label: "twoPerson" },
  { key: 4, label: "fourPerson" },
];

const cityOptions = [
  { key: "paris", label: "Paris" },
  { key: "lyon", label: "Lyon" },
  { key: "marseille", label: "Marseille" },
  { key: "toulouse", label: "Toulouse" },
  { key: "nice", label: "Nice" },
  { key: "nantes", label: "Nantes" },
];

const selectVerse = (verse) => {
  registerForm.value.verse = verse;
};

const selectVerseTwo = (verseTwo) => {
  registerForm.value.verseTwo = verseTwo;
};

const selectExperience = (userLevelType) => {
  registerForm.value.userLevelType = userLevelType;
};
const selectHadith = (hadith) => {
  registerForm.value.hadith = hadith;
};

const selectParticipants = (participants) => {
  registerForm.value.participants = participants;
};

const selectCity = (city) => {
  registerForm.value.city = city;
};

const toggleCityDropdown = () => {
  showCityDropdown.value = !showCityDropdown.value;
};

const changeStatus = () => {
  if (status.value == "step-1") {
    status.value = "step-2";
  } else if (status.value == "step-2") {
    status.value = "step-3";
  } else if (status.value == "step-3") {
    status.value = "step-4";
  } else if (status.value == "step-4") {
    status.value = "step-5";
  } else if (status.value == "step-5") {
    status.value = "step-6";
  } else if (status.value == "step-6") {
    status.value = "step-7";
  } else if (status.value == "step-7") {
    status.value = "step-8";
  }
};

const goBack = () => {
  if (status.value == "step-2") {
    status.value = "step-1";
  } else if (status.value == "step-3") {
    status.value = "step-2";
  } else if (status.value == "step-4") {
    status.value = "step-3";
  } else if (status.value == "step-5") {
    status.value = "step-4";
  } else if (status.value == "step-6") {
    status.value = "step-5";
  } else if (status.value == "step-7") {
    status.value = "step-6";
  } else if (status.value == "step-8") {
    status.value = "step-7";
  }
};

const handleSubmit = async (e) => {
  if (status.value === "step-7") {
    message.value = "";
    if (
      !registerForm.value.email ||
      !registerForm.value.password ||
      !registerForm.value.passwordverify
    )
      return;

    const response = await axios.post(
      config.apiUrl + "/account/register/request",
      {
        email: registerForm.value.email,
        password: registerForm.value.password,
        passwordverify: registerForm.value.passwordverify,
      }
    );

    message.value = response.data.message;

    registerForm.value.hash = response.data.data.hash;

    status.value = "step-8";

    // store.layout.toasts.push({
    //   type: response.data.status ? "success" : "danger",
    //   title: " verification code",
    //   message: response.data.message,
    //   datetime: new Date(),
    // });
  } else if (status.value === "step-8") {
    const response = await axios.post(
      config.apiUrl + "/account/register/verify",
      {
        email: registerForm.value.email,
        password: registerForm.value.password,
        fullname: registerForm.value.fullname,
        phone: registerForm.value.phone,
        age: registerForm.value.age,
        userLevelType: registerForm.value.userLevelType,
        token: registerForm.value.token,
        hash: registerForm.value.hash,
      }
    );
    message.value = response.data.message;

    if (response.data.status) {
      cookies.set(
        "x-access-token",
        response.data.data.xAccessToken,
        "365d",
        null,
        config.cookieDomain
      );
      const res = await axios.post(config.apiUrl + "/account/get", {
        "x-access-token": cookies.get("x-access-token"),
      });

      if (res) {
        window.location.href = "/";
      }
    }
  }
};

// const handleCancel = () => {
//   registerForm.value.firstname = null;
//   registerForm.value.lastname = null;
//   registerForm.value.email = null;
//   registerForm.value.age = null;
//   registerForm.value.isTermChecked = false;
// };

onMounted(() => {
  const footer = document.getElementById("footer-wrapper");
  if (footer) {
    footer.classList.add("darkFooter");
  }
});
</script>
<template>
  <div class="register-page container-fluid px-0">
    <div class="top-image w-100">
      <img
        class="img-fluid"
        src="../../assets/images/register-stepone-back.svg"
        alt="Register Top Image"
      />
    </div>
    <div class="register-box container px-3">
      <form class="verse-form p-0 m-0" v-if="status === 'step-1'">
        <div class="video-wrapper w-100 mb-3">
          <video
            class="w-100"
            src="../../assets/images/test-video.mp4"
            controls
            muted
            autoplay
          ></video>
        </div>
        <h1 class="form-title">
          {{ phrases.pages.register.stepFour.title }}
        </h1>

        <div class="verse-options">
          <div
            v-for="option in verseOptions"
            :key="option.key"
            class="verse-option p-0"
            :class="{ selected: registerForm.verse === option.key }"
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

        <div class="container-fluid px-0 text-center submit-button">
          <button type="button" @click="changeStatus()">
            {{ phrases.pages.register.stepOne.submit }}
          </button>
        </div>
      </form>
      <form class="experience-form m-0 p-0" v-else-if="status === 'step-2'">
        <h1 class="form-title">
          {{ phrases.pages.register.stepThree.title }}
        </h1>

        <div class="experience-options">
          <div
            v-for="option in experienceOptions"
            :key="option.key"
            class="experience-option"
            :class="{ selected: registerForm.userLevelType === option.key }"
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

        <div class="container-fluid px-0 text-center button-group">
          <button type="button" class="back-button" @click="goBack()">
            {{ phrases.pages.register.back }}
          </button>
          <button type="button" class="submit-button" @click="changeStatus()">
            {{ phrases.pages.register.stepOne.submit }}
          </button>
        </div>
      </form>
      <form class="register-form p-0 m-0" v-else-if="status === 'step-3'">
        <h1 class="form-title mb-5">
          {{ phrases.pages.register.stepOne.signUp }}
        </h1>

        <div class="form-group">
          <label class="form-label">{{
            phrases.pages.register.stepOne.fullname
          }}</label>
          <input
            type="text"
            v-model="registerForm.fullname"
            :placeholder="phrases.pages.register.stepOne.fullnamePlaceholder"
            class="form-input"
            required
          />
        </div>

        <!-- <div class="form-group">
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
        </div> -->

        <!-- <div class="form-group">
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
        </div> -->

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

        <div class="container-fluid px-0 text-center button-group">
          <button type="button" class="back-button" @click="goBack()">
            {{ phrases.pages.register.back }}
          </button>
          <button type="button" class="submit-button" @click="changeStatus()">
            {{ phrases.pages.register.stepOne.submit }}
          </button>
        </div>
      </form>
      <form class="verse-form p-0 m-0" v-else-if="status === 'step-4'">
        <div class="video-wrapper w-100 mb-3">
          <video
            class="w-100"
            src="../../assets/images/test-video.mp4"
            controls
            muted
            autoplay
          ></video>
        </div>
        <h1 class="form-title">
          {{ phrases.pages.register.stepFour.title }}
        </h1>

        <div class="verse-options">
          <div
            v-for="option in verseOptions"
            :key="option.key"
            class="verse-option p-0"
            :class="{ selected: registerForm.verseTwo === option.key }"
            @click="selectVerseTwo(option.key)"
          >
            <div class="selection-indicator m-0">
              <div class="indicator-inner"></div>
            </div>
            <div class="verse-text">
              {{ phrases.pages.register.stepFour[option.label] }}
            </div>
          </div>
        </div>

        <div class="container-fluid px-0 text-center button-group">
          <button type="button" class="back-button" @click="goBack()">
            {{ phrases.pages.register.back }}
          </button>
          <button type="button" class="submit-button" @click="changeStatus()">
            {{ phrases.pages.register.stepOne.submit }}
          </button>
        </div>
      </form>
      <form class="verse-form p-0 m-0" v-else-if="status === 'step-5'">
        <div class="video-wrapper w-100 mb-3">
          <video
            class="w-100"
            src="../../assets/images/test-video.mp4"
            controls
            muted
            autoplay
          ></video>
        </div>
        <h1 class="form-title">
          {{ phrases.pages.register.stepFive.title }}
        </h1>

        <div class="verse-options">
          <div
            v-for="option in hadithOptions"
            :key="option.key"
            class="verse-option p-0"
            :class="{ selected: registerForm.hadith === option.key }"
            @click="selectHadith(option.key)"
          >
            <div class="selection-indicator m-0">
              <div class="indicator-inner"></div>
            </div>
            <div class="verse-text">
              {{ phrases.pages.register.stepFive[option.label] }}
            </div>
          </div>
        </div>

        <div class="container-fluid px-0 text-center button-group">
          <button type="button" class="back-button" @click="goBack()">
            {{ phrases.pages.register.back }}
          </button>
          <button type="button" class="submit-button" @click="changeStatus()">
            {{ phrases.pages.register.stepFive.submit }}
          </button>
        </div>
      </form>
      <form class="challenge-form p-0 m-0" v-else-if="status === 'step-6'">
        <h1 class="form-title">
          {{ phrases.pages.register.stepSix.title }}
        </h1>

        <div class="participant-options row">
          <div
            v-for="option in participantOptions"
            :key="option.key"
            class="col-4 px-2"
            @click="selectParticipants(option.key)"
          >
            <!-- <div class="participant-icon">
              <i class="fas fa-user"></i>
            </div> -->
            <div class="participant-option px-2 py-3" :class="{ selected: registerForm.participants === option.key }">
              <div class="participant-icon">
                <img src="/assets/images/one-user.svg" alt="Participant Icon" v-if="option.key === 1" />
                <img src="/assets/images/two-user.svg" alt="Participant Icon" v-if="option.key === 2" />
                <img src="/assets/images/four-user.svg" alt="Participant Icon" v-if="option.key === 4" />
              </div>
              <div class="participant-label text-center">
                {{ phrases.pages.register.stepSix[option.label] }}
              </div>
            </div>
          </div>
        </div>

        <h2 class="form-subtitle">
          {{ phrases.pages.register.stepSix.cityTitle }}
        </h2>

        <div class="city-selection">
          <div class="city-input-wrapper">
            <input
              type="text"
              v-model="registerForm.city"
              placeholder="| Paris"
              class="city-input"
              readonl
              @click="toggleCityDropdown"
            />
            <div class="city-dropdown-icon">
              <i class="fas fa-chevron-down"></i>
            </div>
          </div>

          <div class="city-dropdown" v-if="showCityDropdown">
            <div
              v-for="city in cityOptions"
              :key="city.key"
              class="city-option"
              @click="
                selectCity(city.key);
                toggleCityDropdown();
              "
            >
              <div class="city-icon">
                <i class="fas fa-building"></i>
              </div>
              <div class="city-name">{{ city.label }}</div>
            </div>
          </div>
        </div>

        <div class="container-fluid px-0 text-center button-group">
          <button type="button" class="back-button" @click="goBack()">
            {{ phrases.pages.register.back }}
          </button>
          <button type="button" class="submit-button" @click="changeStatus()">
            {{ phrases.pages.register.stepSix.submit || "Étape suivante" }}
          </button>
        </div>
      </form>
      <form class="register-form p-0 m-0" v-else-if="status === 'step-7'">
        <h1 class="form-title mb-5">
          {{ phrases.pages.register.stepOne.signUp }}
        </h1>

        <div class="form-group">
          <label class="form-label">{{
            phrases.pages.register.stepSeven.email
          }}</label>
          <input
            type="email"
            v-model="registerForm.email"
            :placeholder="phrases.pages.register.stepSeven.emailPlaceholder"
            class="form-input"
            required
          />
        </div>

        <div class="form-group">
          <label class="form-label">{{
            phrases.pages.register.stepSeven.phone
          }}</label>
          <input
            type="number"
            v-model="registerForm.phone"
            :placeholder="phrases.pages.register.stepSeven.phonePlaceholder"
            class="form-input"
            required
          />
        </div>
        <div class="form-group">
          <label class="form-label">{{
            phrases.pages.register.stepSeven.password
          }}</label>
          <input
            type="password"
            v-model="registerForm.password"
            :placeholder="phrases.pages.register.stepSeven.passwordPlaceholder"
            class="form-input"
            required
          />
        </div>
        <div class="form-group">
          <label class="form-label">{{
            phrases.pages.register.stepSeven.passwordverify
          }}</label>
          <input
            type="password"
            v-model="registerForm.passwordverify"
            :placeholder="
              phrases.pages.register.stepSeven.passwordverifyPlaceholder
            "
            class="form-input"
            required
          />
        </div>

        <div class="container-fluid px-0 text-center button-group">
          <button type="button" class="back-button" @click="goBack()">
            {{ phrases.pages.register.back }}
          </button>
          <button type="button" class="submit-button" @click="handleSubmit()">
            {{ phrases.pages.register.stepSeven.submit }}
          </button>
        </div>
      </form>
      <form class="register-form p-0 m-0" v-else-if="status === 'step-8'">
        <div class="form-group">
          <!-- <label class="form-label">{{
            phrases.pages.register.stepEight.email
          }}</label> -->
          <input
            type="email"
            v-model="registerForm.verification"
            class="form-input"
            required
          />
        </div>
        <div class="form-group">
          <p>
            {{ phrases.pages.register.stepEight.verification }}
          </p>
        </div>

        <!-- <div class="form-group checkbox-group">
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
        </div> -->

        <div class="container-fluid px-0 text-center button-group">
          <button type="button" class="back-button" @click="goBack()">
            {{ phrases.pages.register.back }}
          </button>
          <button type="button" class="submit-button" @click="handleSubmit()">
            {{ phrases.pages.register.stepEight.submit }}
          </button>
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

  .button-group {
    display: flex;
    flex-direction: column;
    gap: 15px;
    width: 100%;
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

  .back-button {
    flex: 1;
    background-color: transparent;
    color: var(--primary-color);
    border: 2px solid var(--primary-color);
    padding: 15px 30px;
    border-radius: 6px;
    font-size: 1rem;
    font-weight: 500;
    font-family: "sans-serif", sans-serif;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      background-color: var(--primary-color);
      color: white;
    }

    &:active {
      transform: translateY(1px);
    }
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

  .button-group {
    display: flex;
    flex-direction: column;
    gap: 15px;
    width: 100%;
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
    flex: 1;
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

  .back-button {
    flex: 1;
    background-color: transparent;
    color: var(--primary-color);
    border: 2px solid var(--primary-color);
    padding: 15px 30px;
    border-radius: 6px;
    font-size: 1rem;
    font-weight: 500;
    font-family: "sans-serif", sans-serif;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      background-color: var(--primary-color);
      color: white;
    }

    &:active {
      transform: translateY(1px);
    }
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

  .button-group {
    display: flex;
    flex-direction: column;
    gap: 15px;
    width: 100%;
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
    flex: 1;
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

  .back-button {
    flex: 1;
    background-color: transparent;
    color: var(--primary-color);
    border: 2px solid var(--primary-color);
    padding: 15px 30px;
    border-radius: 6px;
    font-size: 1rem;
    font-weight: 500;
    font-family: "sans-serif", sans-serif;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      background-color: var(--primary-color);
      color: white;
    }

    &:active {
      transform: translateY(1px);
    }
  }
}

.challenge-form {
  .form-title {
    font-family: "serif", serif;
    font-size: 2rem;
    font-weight: bold;
    color: #000;
    margin-bottom: 40px;
    text-align: center;
  }

  .form-subtitle {
    font-family: "serif", serif;
    font-size: 1.5rem;
    font-weight: bold;
    color: #000;
    margin-bottom: 30px;
    text-align: center;
  }

  .button-group {
    display: flex;
    flex-direction: column;
    gap: 15px;
    width: 100%;
  }

  .participant-options {
    display: flex;
    // gap: 15px;
    margin-bottom: 40px;
    justify-content: center;

    .participant-option {
      display: flex;
      flex-direction: row;
      align-items: center;
      // padding: 15px 20px;
      border: none;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.3s ease;
      background-color: white;
      box-shadow: 0 3px 8px 0 rgba(142, 68, 173, 0.10);
      // min-width: 140px;
      justify-content: flex-start;

      .participant-icon {
        // width: 24px;
        // height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 12px;
        color: #8e44ad;
        font-size: 1rem;
        img {
          width: 24px;
        height: 24px;
        }
      }

      .participant-label {
        font-family: "sans-serif", sans-serif;
        font-size: 0.9rem;
        color: #8e44ad;
        font-weight: 500;
        text-align: left;
      }

      &.selected {
        background-color: #8e44ad;

        .participant-icon {
          color: white;
          img {
            filter: brightness(0) invert(1);
          }
        }

        .participant-label {
          color: white;
        }
      }

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(142, 68, 173, 0.2);
      }
    }
  }

  .city-selection {
    position: relative;
    margin-bottom: 40px;

    .city-input-wrapper {
      position: relative;
      width: 100%;

      .city-input {
        width: 100%;
        padding: 20px 50px 15px 15px;
        border: 2px solid #e0e0e0;
        border-radius: 8px;
        font-size: 1rem;
        color: #333;
        background-color: white;
        cursor: pointer;
        transition: all 0.3s ease;

        &:focus {
          outline: none;
          border-color: var(--primary-color);
        }

        &[readonly] {
          cursor: pointer;
        }
      }

      .city-dropdown-icon {
        position: absolute;
        left: 15px;
        top: 50%;
        transform: translateY(-50%);
        color: #666;
        pointer-events: none;
        transition: transform 0.3s ease;
      }
    }

    .city-dropdown {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: white;
      border: 2px solid #e0e0e0;
      border-top: none;
      border-radius: 0 0 8px 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      z-index: 10;
      max-height: 200px;
      overflow-y: auto;

      .city-option {
        display: flex;
        align-items: center;
        padding: 12px 20px;
        cursor: pointer;
        transition: background-color 0.2s ease;

        .city-icon {
          width: 20px;
          height: 20px;
          margin-right: 12px;
          color: #666;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .city-name {
          font-family: "sans-serif", sans-serif;
          font-size: 0.9rem;
          color: #333;
        }

        &:hover {
          background-color: #f8f9fa;
        }
      }
    }
  }

  .submit-button {
    flex: 1;
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
  }

  .back-button {
    flex: 1;
    background-color: transparent;
    color: var(--primary-color);
    border: 2px solid var(--primary-color);
    padding: 15px 30px;
    border-radius: 6px;
    font-size: 1rem;
    font-weight: 500;
    font-family: "sans-serif", sans-serif;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      background-color: var(--primary-color);
      color: white;
    }

    &:active {
      transform: translateY(1px);
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

  .challenge-form {
    padding: 30px 20px;
    margin: 0 10px;

    .form-title {
      font-size: 1.5rem;
      margin-bottom: 30px;
    }

    .form-subtitle {
      font-size: 1.2rem;
      margin-bottom: 25px;
    }

    .participant-options {
      // gap: 8px;

      .participant-option {
        // min-width: auto;
        // padding: 12px 15px;
        flex-direction: row;
        justify-content: flex-start;

        .participant-icon {
          img {
          width: 20px;
        height: 20px;
        }
          margin-right: 5px;
          margin-bottom: 0;
          font-size: 0.6rem;
        }

        .participant-label {
          font-size: 0.8rem;
        }
      }
    }

    .city-selection {
      .city-input-wrapper {
        .city-input {
          padding: 15px 12px 12px 40px;
          font-size: 0.9rem;
        }
      }
    }
  }
}
</style>
