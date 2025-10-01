<script setup>
import { onMounted, ref, computed } from "vue";
import "../assets/libs/bootstrap-5.2.3-dist/css/bootstrap.rtl.min.css";
import "../assets/fonts/fontawesome.pro.6.5.2/js/all.js";
import "../assets/fonts/amiri/style.css";
import "../assets/fonts/orator/style.css";
import "../assets/styles/main.scss";
import Header from "./../components/Header.vue";
import Footer from "./../components/Footer.vue";
import Toast from "../components/Toast.vue";
import { useMainStore } from "../stores/main";
import { usePageContext } from "./usePageContext";

const pageContext = usePageContext();
const store = useMainStore();
// const mainStore = useToastsStore();

// Password protection state
const isPasswordCorrect = ref(false);
const enteredPassword = ref('');
const correctPassword = 'qurana2025'; // You can change this password
const passwordError = ref('');

// Check if password is correct
const checkPassword = () => {
  if (enteredPassword.value === correctPassword) {
    isPasswordCorrect.value = true;
    passwordError.value = '';
    // Store in sessionStorage so it persists during the session
    sessionStorage.setItem('passwordVerified', 'true');
  } else {
    passwordError.value = 'Incorrect password';
    enteredPassword.value = '';
  }
};

// Check if password was already verified in this session
onMounted(() => {
  const passwordVerified = sessionStorage.getItem('passwordVerified');
  if (passwordVerified === 'true') {
    isPasswordCorrect.value = true;
  }
  
  if (localStorage.cart && !store.cart.items.length) {
    store.cart = JSON.parse(localStorage.cart);
  }
  store.settings = pageContext.data.settings;
  // store.accountGet();

  const existingLink = document.getElementById("bootstrap-style");
  if (existingLink) {
    existingLink.parentNode.removeChild(existingLink);
  }

  // Create a new link element
  const link = window.document.createElement("link");
  link.id = "bootstrap-style";
  link.rel = "stylesheet";
  link.type = "text/css";

  link.href = "/assets/libs/bootstrap-5.2.3-dist/css/bootstrap.min.css";

  // Append to head
  window.document.head.insertBefore(link, window.document.head.firstChild);
});
</script>

<template>
    <Header />

    <!-- Password Protection Screen -->
  <div v-if="!isPasswordCorrect" class="password-protection-screen">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-4">
          <div class="card shadow-lg border-0">
            <div class="card-body p-5 text-center">
              <div class="mb-4">
                <i class="fas fa-lock fa-3x text-primary mb-3"></i>
                <h3 class="card-title">Protected Access</h3>
                <p class="text-muted">Please enter the password</p>
              </div>
              
              <form @submit.prevent="checkPassword">
                <div class="mb-3">
                  <input
                    v-model="enteredPassword"
                    type="password"
                    class="form-control form-control-lg text-center"
                    placeholder="Password"
                    required
                    autocomplete="current-password"
                  />
                  <div v-if="passwordError" class="text-danger mt-2 small">
                    {{ passwordError }}
                  </div>
                </div>
                
                <button type="submit" class="btn btn-primary btn-lg w-100">
                  <i class="fas fa-sign-in-alt me-2"></i>
                  Enter
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Main Content (only shown when password is correct) -->
  <div v-else>
    <slot />
  </div>

  <Footer />

  <!-- Toast Container (always visible) -->
  <div class="toast-container position-fixed bottom-0 start-0 p-3">
    <Toast
      :key="index"
      :index="index"
      :type="toast.type"
      :title="toast.title"
      :message="toast.message"
      :datetime="toast.datetime"
      v-for="(toast, index) in store.layout.toasts"
    ></Toast>
  </div>
</template>

<style lang="scss" scoped>
.password-protection-screen {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  
  .card {
    border-radius: 1rem;
    backdrop-filter: blur(10px);
    background: rgba(255, 255, 255, 0.95);
    
    .card-title {
      font-weight: 600;
      color: #2c3e50;
    }
    
    .form-control {
      border-radius: 0.5rem;
      border: 2px solid #e9ecef;
      transition: all 0.3s ease;
      
      &:focus {
        border-color: #667eea;
        box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
      }
    }
    
    .btn-primary {
      border-radius: 0.5rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
      transition: all 0.3s ease;
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
      }
    }
  }
}

@media (max-width: 768px) {
  .password-protection-screen {
    padding: 1rem;
    
    .card-body {
      padding: 2rem !important;
    }
  }
}
</style>
