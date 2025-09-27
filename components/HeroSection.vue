<script setup>
// import { onMounted, ref } from "vue";
import { onMounted, ref } from "vue";
import { usePageContext } from "../renderer/usePageContext";
import config from "../config.json";
import * as langauges from "../languages/index";
import Link from "../renderer/Link.vue";

const pageContext = usePageContext();
const apiUrl = config.apiUrl;
const lng = ref(pageContext.data.lng);
const phrases = langauges.getPhrases(pageContext.data.lng);
</script>

<template>
  <section class="hero-container">
    <!-- Mobile Layout (unchanged) -->
    <div class="mobile-layout d-lg-none">
      <div class="container pt-5">
        <div class="hero-section-wrapper row">
          <div
            class="mt-4 col-12 d-flex flex-column justify-content-center align-items-center hero-section-text-wrapper"
          >
            <div class="hero-section-title">
              <h1 class="text-start mb-0">
                {{ phrases.components.homePage.heroSection.title1 }}
              </h1>
              <p>{{ phrases.components.homePage.heroSection.title2 }}</p>
            </div>
          </div>
          <div
            class="col-12 d-flex justify-content-center align-items-center hero-section-image-wrapper"
          >
            <div class="hero-section-image">
              <img src="../assets/images/muslim-women-hero.png" alt="" />
            </div>
          </div>
        </div>
        
        <!-- Star icon -->
        <div class="hero-star">
          <img src="../assets/images/star-shape.svg" alt="Star" />
        </div>
        
        <!-- Commencer button -->
        <div class="hero-button-container d-flex justify-content-center">
          <button class="hero-button">{{ phrases.components.homePage.heroSection.start }}</button>
        </div>
      </div>
    </div>

    <!-- Desktop Layout -->
    <div class="desktop-layout d-none d-lg-block">
      <div class="desktop-hero">
        <!-- Text content -->
        <div class="desktop-text">
          <h1 class="desktop-title">{{ phrases.components.homePage.heroSection.title1 }}</h1>
          <h2 class="desktop-subtitle">{{ phrases.components.homePage.heroSection.title2 }}</h2>
        </div>
        
        <!-- Visual elements -->
        <div class="desktop-visual">
          <!-- Muslim women image -->
          <img 
            class="desktop-women-image" 
            src="../assets/images/muslim-women-hero.png" 
            alt="Muslim women" 
          />
          
          <!-- Purple crescent moon -->
          <!-- <img 
            class="desktop-crescent" 
            src="../assets/images/hero-linear.svg" 
            alt="Crescent moon" 
          /> -->
          
          <!-- Star icon -->
          <img 
            class="desktop-star" 
            src="../assets/images/star-shape.svg" 
            alt="Star" 
          />
        </div>
        
        <!-- Commencer button -->
        <div class="desktop-button-container">
          <button class="desktop-button">{{ phrases.components.homePage.heroSection.start }}</button>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
// Mobile Layout (unchanged - keeping your existing styles)
.mobile-layout {
  .container {
    position: relative;
    height: calc(100vh - 54px);
    &:after {
      content: "";
      display: block;
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      width: 100%;
      height: 100%;
      background-image: url(../assets/images/hero-linear.png);
      background-repeat: no-repeat;
      background-position: bottom center;
      background-size: contain;
      z-index: -1;
    }
    .hero-section-wrapper {
      .hero-section-text-wrapper {
        h1 {
          font-size: 240%;
          color: var(--secondary-color);
          line-height: 1;
          font-weight: 700;
        }
        p {
          font-size: 150%;
          color: var(--secondary-color);
          line-height: 1;
        }
      }
      .hero-section-image-wrapper {
        margin-top: -20px;
        margin-bottom: 30px;

        .hero-section-image {
          img {
            width: 100%;
          }
        }
      }
    }
    
    .hero-star {
      position: absolute;
      top: 23%;
      right: 18%;
      width: 50px;
      height: 50px;
      z-index: 2;
      
      img {
        width: 100%;
        height: 100%;
      }
    }
    
    .hero-button-container {
      z-index: 2;
    }
    
    .hero-button {
      background-color: #fff;
      color: var(--secondary-color);
      border: none;
      padding: .3rem 5.5rem;
      border-radius: 8px;
      font-size: 1.1rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(114, 34, 125, 0.2);
      }
    }
  }
}

// Desktop Layout (completely new)
.desktop-layout {
  .desktop-hero {
    position: relative;
    min-height: calc(100vh - 85px);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 4rem;
    background: linear-gradient(180deg, #ffffff 0%, #ffffff 60%, #FFA958 100%);
    overflow: hidden;
    
    // Bottom gradient
    &::after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 35%;
      background: linear-gradient(180deg, #72227D 0%, #FFA958 100%);
      z-index: 0;
    }
  }
  
  .desktop-text {
    flex: 1;
    z-index: 2;
    position: relative;
    padding-right: 2rem;
  }
  
  .desktop-title {
    font-size: 4rem;
    font-weight: bold;
    color: #72227D;
    margin: 0;
    line-height: 1.1;
    font-family: serif;
  }
  
  .desktop-subtitle {
    font-size: 2.5rem;
    font-weight: normal;
    color: #72227D;
    margin: 0.5rem 0 0 0;
    line-height: 1.1;
    font-family: serif;
  }
  
  .desktop-visual {
    flex: 1;
    position: relative;
    height: 80vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .desktop-women-image {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-width: 100%;
    height: auto;
    z-index: 2;
  }
  
  .desktop-crescent {
    position: absolute;
    top: 50%;
    right: -10%;
    transform: translateY(-50%);
    width: 60%;
    height: auto;
    z-index: 1;
  }
  
  .desktop-star {
    position: absolute;
    top: 20%;
    right: 10%;
    width: 60px;
    height: 60px;
    z-index: 3;
  }
  
  .desktop-button-container {
    position: absolute;
    bottom: 20%;
    left: 20%;
    transform: translateX(-50%);
    z-index: 2;
  }
  
  .desktop-button {
    background: linear-gradient(180deg, #f5f5f5 0%, #e8e8e8 100%);
    color: #72227D;
    border: none;
    padding: 1rem 2rem;
    border-radius: 8px;
    font-size: 1.1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(114, 34, 125, 0.2);
    }
  }
}
</style>
