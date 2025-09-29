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
  availability: {
    monday: null,
    tuesday: null,
    wednesday: null,
    thursday: null,
    friday: null,
    saturday: null,
    sunday: null,
  }
});

const timeSlots = [
  { id: '11h-13h', label: '11 h-13 h' },
  { id: '14h-16h', label: '14 h-16 h' },
  { id: '17h-19h', label: '17 h-19 h' },
  { id: '20h-22h', label: '20 h-22 h' }
];

const days = [
  { key: 'monday', label: 'monday' },
  { key: 'tuesday', label: 'tuesday' },
  { key: 'wednesday', label: 'wednesday' },
  { key: 'thursday', label: 'thursday' },
  { key: 'friday', label: 'friday' },
  { key: 'saturday', label: 'saturday' },
  { key: 'sunday', label: 'sunday' }
];

const selectTimeSlot = (day, timeSlot) => {
  registerForm.value.availability[day] = timeSlot;
};

const handleSubmit = async (e) => {
  e.preventDefault();
  // TODO: Implement registration logic
  console.log("Registration form submitted:", registerForm.value);
};

const handleCancel = () => {
  registerForm.value.availability = {
    monday: null,
    tuesday: null,
    wednesday: null,
    thursday: null,
    friday: null,
    saturday: null,
    sunday: null,
  };
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
    <div class="register-box container">
      <form class="availability-form m-0 p-0" @submit="handleSubmit">
        <h1 class="form-title">
          {{ phrases.pages.register.stepTwo.title }}
        </h1>

        <div class="availability-grid">
          <div 
            v-for="day in days" 
            :key="day.key" 
            class="day-row"
          >
            <div class="day-label py-lg-2">
              {{ phrases.pages.register.stepTwo[day.label] }}
            </div>
            <div class="time-slots-block">
              <button
                v-for="timeSlot in timeSlots"
                :key="timeSlot.id"
                type="button"
                :class="[
                  'time-slot-button',
                  { 'selected': registerForm.availability[day.key] === timeSlot.id }
                ]"
                @click="selectTimeSlot(day.key, timeSlot.id)"
              >
                <span>{{ timeSlot.label }}</span>
              </button>
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
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
    padding: 40px 20px;
  }
}

.availability-form {
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

  .availability-grid {
    margin-bottom: 40px;

    .day-row {
      display: flex;
      align-items: center;
      margin-bottom: 12px;
      gap: 15px;
      // box-shadow: 0 3px 8px 0 rgba(142, 68, 173, 0.10);

      &:nth-child(odd) {
        .day-label {
          background-color: #fff;
          box-shadow: 0 3px 8px 0 rgba(142, 68, 173, 0.10);
        }
        .time-slots-block {
          background-color: #fff;
          box-shadow: 0 3px 8px 0 rgba(142, 68, 173, 0.10);
          button {
            background-color: #fff;
          }
        }
      }

      &:nth-child(even) {
        .day-label {
          background-color: #F9F9F4;
        }
        .time-slots-block {
          background-color: #F9F9F4;
          button {
            background-color: #F9F9F4;
          }
        }
      }

      .day-label {
        display: flex;
        align-items: center;
        justify-content: center;
        color: #333;
        // padding: 12px 16px;
        border-radius: 8px;
        width: 65px;
        font-family: "sans-serif", sans-serif;
        font-size: 0.9rem;
        font-weight: 500;
        // min-width: 100px;
        text-align: center;
        border: 1px solid transparent;
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
          background-color: #e8e8e8;
        }
      }

      .time-slots-block {
        display: flex;
        flex: 1;
        border-radius: 8px;
        overflow: hidden;
        border: 1px solid transparent;

        .time-slot-button {
          color: #333;
          border: none;
          padding: 12px 5px;
          font-family: "sans-serif", sans-serif;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s ease;
          flex: 1;
          position: relative;
          // border-right: 1px solid #d0d0d0;
           span {
              padding: 5px 2px;
              border-radius: 5px;
            }

          &:last-child {
            border-right: none;
          }

          &:hover {
            background-color: #f8f8f8;
          }

          &.selected {
            background-color: transparent;
            span {
              background-color: #ff6b35;
            color: white;
            }
          }

          &:not(:last-child)::after {
            content: '';
            position: absolute;
            right: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 1px;
            height: 60%;
            background-color: var(--secondary-color);
            z-index: 1;
          }

          // &.selected:not(:last-child)::after {
          //   background-color: rgba(255, 255, 255, 0.3);
          // }
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
  .availability-form {
    padding: 30px 20px;
    margin: 0 10px;

    .form-title {
      font-size: 1.3rem;
      margin-bottom: 30px;
    }

    .availability-grid {
      .day-row {
        // flex-direction: column;
        align-items: stretch;
        gap: 10px;

        .day-label {
          min-width: auto;
          text-align: center;
          // padding: 10px 15px;
          width: 65px;
          font-size: 0.85rem;
        }

        .time-slots-block {
          .time-slot-button {
            padding: 10px 2px;
            font-size: 0.7rem;
            span {
              padding: 5px 2px !important;
              border-radius: 5px;
            }
          }
        }
      }
    }
  }
}
</style>
