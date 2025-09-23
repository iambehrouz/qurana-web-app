<script setup></script>

<template>
  <div>
    <div class="loader"></div>
  </div>
</template>

<style lang="scss">
$color-primary-light: #f3fbfa;
$color-primary: #00b0ae;
$color-primary-dark: #008d8b;

.loader {
  background-color: rgba(0, 0, 0, 0.08);
  z-index: 100;
  display: inline-block;
  position: absolute;
  height: 100%;
  width: 100%;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
}
.loader:after {
  content: " ";
  display: block;
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  width: 30px;
  height: 30px;
  margin: 8px;
  border-radius: 50%;
  border: 4px solid #ffffff;
  border-color: var(--primary-color) var(--primary-color) var(--primary-color)
    var(--primary-color-light) $color-primary-light;
  animation: loader 1.6s linear infinite;
}
@keyframes loader {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
