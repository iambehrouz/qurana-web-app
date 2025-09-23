<script setup>
import { onMounted } from "vue";
import { useMainStore } from "../stores/main";
import _ from "lodash";

const props = defineProps({
  index: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  datetime: {
    type: Date,
    required: true,
  },
});

const mainStore = useMainStore();

const remove = () => {
  _.remove(
    mainStore.layout.toasts,
    (toast) => toast.datetime.getTime() === props.datetime.getTime()
  );
};

onMounted(() => {
  try {
    var audio = new Audio("/assets/sounds/message-popup.mp3");
    audio.play();
  } catch (err) {}

  setTimeout(() => {
    remove();
  }, 5000);
});
</script>

<template>
  <div class="toast" role="alert" aria-live="assertive" aria-atomic="true">
    <div class="toast-header" v-bind:class="['text-' + type]">
      <span class="fa-duotone fa-bell icon"></span>
      <strong class="me-auto">{{ title }}</strong>
      <small>just now</small>
      <button
        type="button"
        class="btn-close me-0 ms-1"
        aria-label="Close"
        v-on:click="remove()"
      ></button>
    </div>
    <div class="toast-body">{{ message }}</div>
  </div>
</template>

<style lang="scss" scoped>
.toast {
  display: block !important;

  .toast-header {
    .icon {
      margin-left: 8px;
    }
  }
}
</style>
