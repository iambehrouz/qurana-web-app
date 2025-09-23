<script setup>
import { ref } from "vue";
import { usePageContext } from "../renderer/usePageContext";
import * as langauges from "../languages/index";
import LoginModal from "./LoginModal.vue";
import { useMainStore } from "../stores/main";
import axios from "../helpers/axios";
import helpers from "../helpers";

const emit = defineEmits(["review-added"]);
const props = defineProps(["objectType", "objectId", "reviews"]);
const mainStore = useMainStore();
const pageContext = usePageContext();
const settings = pageContext.data.settings;
const phrases = langauges.getPhrases(pageContext.data.lng);
const showLoginModal = ref(false);
const reviewForm = ref({
  parentId: null,
  userId: null,
  objectType: null,
  objectId: null,
  isActive: true,
  rate: null,
  comment: null,
});

const handleVerifiedLogin = () => {
  showLoginModal.value = false;
  submitReview();
};

const submitReview = async () => {
  if (!pageContext.data.user) {
    mainStore.layout.toasts.push({
      type: "danger",
      title: " User is not logged in",
      message: "please log in first",
      datetime: new Date(),
    });

    showLoginModal.value = true;

    return;
  }

  reviewForm.value.objectType = props.objectType;
  reviewForm.value.objectId = props.objectId;
  reviewForm.value.userId = pageContext.data.user.userId;

  await axios.post("/reviews/add", reviewForm.value);
  reviewForm.value.comment = null;
  reviewForm.value.rate = null;
  emit("review-added");
  mainStore.layout.toasts.push({
    type: "success",
    title: " review",
    message: "Your comment has been submited and will be displayed after approval.",
    datetime: new Date(),
  });
};

const getStarsCount = (num) => {
  var count = 0;
  for (const key in props.reviews) {
    const review = props.reviews[key];
    if (review.rate == num) count++;
  }
  return count;
};

const getStarsPercent = (num) => {
  var allStarsCount = props.reviews.length;
  var count = 0;
  for (const key in props.reviews) {
    const review = props.reviews[key];
    if (review.rate == num) count++;
  }
  return (count / allStarsCount) * 100;
};
</script>
<template>
  <div class="comments-form w-100">
    <LoginModal
      :show="showLoginModal"
      :settings="settings"
      @close="showLoginModal = false"
      @login-verified="handleVerifiedLogin"
    />
    <div class="comments">
      <div class="col-12 col-md-5 rate mb-4">
        <div class="fw-bold mb-2">
          <i class="fa-regular fa-star"></i>
          <span>{{ phrases.pages.blog.rateTitle }}</span>
        </div>
        <div class="rate-row">
          <span>{{ phrases.pages.blog.fiveStars }}</span>
          <div class="percent-bar">
            <div
              class="percent-progress"
              :style="{ width: getStarsPercent(5) + '%' }"
            ></div>
          </div>
          <span>{{ getStarsCount(5) }}</span>
        </div>
        <div class="rate-row">
          <span>{{ phrases.pages.blog.fourStars }}</span>
          <div class="percent-bar">
            <div
              class="percent-progress"
              :style="{ width: getStarsPercent(4) + '%' }"
            ></div>
          </div>
          <span>{{ getStarsCount(4) }}</span>
        </div>
        <div class="rate-row">
          <span>{{ phrases.pages.blog.threeStars }}</span>
          <div class="percent-bar">
            <div
              class="percent-progress"
              :style="{ width: getStarsPercent(3) + '%' }"
            ></div>
          </div>
          <span>{{ getStarsCount(3) }}</span>
        </div>
        <div class="rate-row">
          <span>{{ phrases.pages.blog.twoStars }}</span>
          <div class="percent-bar">
            <div
              class="percent-progress"
              :style="{ width: getStarsPercent(2) + '%' }"
            ></div>
          </div>
          <span>{{ getStarsCount(2) }}</span>
        </div>
        <div class="rate-row">
          <span>{{ phrases.pages.blog.oneStar }}</span>
          <div class="percent-bar">
            <div
              class="percent-progress"
              :style="{ width: getStarsPercent(1) + '%' }"
            ></div>
          </div>
          <span>{{ getStarsCount(1) }}</span>
        </div>
      </div>
      <div
        class="col-12 comment mt-3"
        v-for="(review, index) in reviews"
        :key="index"
      >
        <div class="card">
          <div class="card-header bg-transparent">
            <span>{{ review.user.fullname }} {{ phrases.pages.blog.review }}</span>
            <span dir="ltr">
              {{ helpers.datetime.gregorianToJalali(review.createdAt) }}</span
            >
          </div>
          <div class="card-body">
            <div class="comment-rate mb-2">
              <i
                class="fa"
                :class="review.rate >= 1 ? 'fa-star' : 'fa-star-o'"
              ></i>
              <i
                class="fa"
                :class="review.rate >= 2 ? 'fa-star' : 'fa-star-o'"
              ></i>
              <i
                class="fa"
                :class="review.rate >= 3 ? 'fa-star' : 'fa-star-o'"
              ></i>
              <i
                class="fa"
                :class="review.rate >= 4 ? 'fa-star' : 'fa-star-o'"
              ></i>
              <i
                class="fa"
                :class="review.rate >= 5 ? 'fa-star' : 'fa-star-o'"
              ></i>
            </div>
            <p>
              {{ review.comment }}
            </p>
            <div
              class="comment-response border p-2 mt-3"
              v-for="(child, index) in review.childs"
              :key="index"
            >
              <div class="response-title">
                <span
                  >{{ child.user ? child.user.fullname : "--" }} {{ phrases.pages.blog.respond }}</span
                >
                <span dir="ltr" class="mx-2">
                  {{
                    helpers.datetime.gregorianToJalali(child.createdAt)
                  }}</span
                >
              </div>
              <p class="mb-0 mt-3">{{ child.comment }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <form class="mt-4" @submit.prevent="submitReview">
      <span class="fw-bold form-title">{{ phrases.pages.blog.submitReview }}</span>
      <span>* {{ phrases.pages.blog.caption }}</span>
      <div class="form-rate">
        <button @click="reviewForm.rate = 1" type="button">
          <span v-if="reviewForm.rate >= 1">
            <i class="fa-solid fa-star"></i>
          </span>
          <span v-else>
            <i class="fa-regular fa-star"></i>
          </span>
        </button>
        <button @click="reviewForm.rate = 2" type="button">
          <span v-if="reviewForm.rate >= 2">
            <i class="fa-solid fa-star"></i>
          </span>
          <span v-else>
            <i class="fa-regular fa-star"></i>
          </span>
        </button>
        <button @click="reviewForm.rate = 3" type="button">
          <span v-if="reviewForm.rate >= 3">
            <i class="fa-solid fa-star"></i>
          </span>
          <span v-else>
            <i class="fa-regular fa-star"></i>
          </span>
        </button>
        <button @click="reviewForm.rate = 4" type="button">
          <span v-if="reviewForm.rate >= 4">
            <i class="fa-solid fa-star"></i>
          </span>
          <span v-else>
            <i class="fa-regular fa-star"></i>
          </span>
        </button>
        <button @click="reviewForm.rate = 5" type="button">
          <span v-if="reviewForm.rate >= 5">
            <i class="fa-solid fa-star"></i>
          </span>
          <span v-else>
            <i class="fa-regular fa-star"></i>
          </span>
        </button>
      </div>
      <textarea
        class="form-control my-3"
        rows="6"
        v-model="reviewForm.comment"
      ></textarea>
      <div class="col-12 col-lg-4">
        <button type="submit" class="btn w-100">{{ phrases.pages.blog.submitBtn }}</button>
      </div>
    </form>
  </div>
</template>

<style scoped lang="scss">
.comments-form {
  .form-title {
    font-size: 1.2rem;
    display: block;
  }
  button {
    background-color: var(--secondary-color);
    color: white;

    &:hover {
      color: white;
      background-color: var(--secondary-color);
    }
    &:active {
      background-color: var(--secondary-color);
      color: white;
    }
  }

  .rate-row {
    span {
      display: block;
    }
    display: flex;
    .percent-bar {
      // background-color: rgb(184, 184, 184);
      margin: 0 10px;
      margin-top: 8px;
      border-radius: 5px;
      height: 5px;
      flex-grow: 1;
    }
    .percent-progress {
      background-color: var(--primary-color);
      border-radius: 5px;
      height: 100%;
      width: 0;
    }
  }
  .comment {
    .card-header {
      color: var(--text-primary-color);
      font-size: 0.9rem;
    }
  }

  form {
    .form-rate {
      margin-top: 15px;
      button {
        border: 0;
        background-color: transparent;
        color: var(--primary-color);
        font-size: 1.2rem;
        span {
          border: 0;
          background-color: transparent;
          color: var(--primary-color);
          font-size: 1.2rem;
        }
      }
    }
  }
}
</style>
