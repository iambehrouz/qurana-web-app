<script setup>
import * as langauges from "../../languages/index";
import { usePageContext } from "../../renderer/usePageContext";

const pageContext = usePageContext();
const phrases = langauges.getPhrases(pageContext.data.lng);
</script>

<template>
  <section class="container mb-4">
    <div class="wrapper-1 py-5 mt-2 mt-lg-0">
      <div class="container-fluid">
        <div class="horizontal-row">{{ phrases.pages.contact.name }}</div>
        <p class="title text-center text-en">{{ phrases.pages.contact.title }}</p>
        <p class="description text-center">
          {{ phrases.pages.contact.subTitle }}
        </p>
      </div>
    </div>
  </section>

  <section class="container section-description">
    <h3 class="title mb-3">{{ phrases.pages.contact.titleCaption }}</h3>
    <p class="description mb-0">
      {{ phrases.pages.contact.caption }}
    </p>
  </section>

  <section class="container section-contact">
    <div class="row d-flex flex-lg-row-reverse">
      <!-- <div class="col-12 mb-3 mb-lg-0 col-lg-6">
        <div class="map-container">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3021.06638436533!2d-73.9655834!3d40.7825547!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c2589a018531e3%3A0xb9df1f7387a94119!2sCentral%20Park!5e0!3m2!1sen!2s!4v1729602815738!5m2!1sen!2s"
            width="600"
            height="450"
            style="border: 0"
            allowfullscreen=""
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            class="map"
          ></iframe>
        </div>
      </div> -->
      <div class="col-12 d-flex">
        <div class="row">
          <!-- call -->
          <div class="col-7 col-lg-4">
            <img
              class="me-3 icon"
              src="./../../assets/images/telephone-black.svg"
              alt="call"
            />
            <span class="icon-title">{{ phrases.pages.contact.callTitle }}</span>
          </div>
          <div class="col-5 mb-4 col-lg-8">
            <div class="row">
              <div class="col-12">
                <a href="tel:00971504059262" class="text-en">00971504059262</a>
              </div>
            </div>
          </div>

          <!-- email  -->
          <div class="col-6 col-lg-4">
            <img
              class="me-3 icon"
              src="./../../assets/images/email-b.svg"
              alt="email"
            />
            <span class="icon-title">{{ phrases.pages.contact.emailTitle }}</span>
          </div>
          <div class="col-6 mb-4 col-lg-8">
            <div class="row">
              <div class="col-12">
                <a class="text-en" href="mailto:info@trendytrades.io"
                  >info@trendytrades.io</a
                >
              </div>
            </div>
          </div>
          <!-- work time  -->
          <!-- <div class="col-6 col-lg-4">
            <img
              class="me-3 icon"
              src="./../../assets/images/clock-b.svg"
              alt="clock"
            />
            <span class="icon-title"> Working hours:</span>
          </div>
          <div class="col-6 mb-4 col-lg-8">
            <div class="row">
              <div class="col-12 col-lg-4">
                <span class="description">monday to friday</span>
              </div>
              <div class="col-12 col-lg-4">
                <span class="description">8 AM to 21 PM</span>
              </div>
            </div>
          </div> -->
          <!-- address  -->
          <div class="col-6 col-lg-4">
            <img
              class="me-3 icon"
              src="./../../assets/images/pin-b.svg"
              alt="pin"
            />
            <span class="icon-title"> {{ phrases.pages.contact.addressTitle }}</span>
          </div>
          <div class="col-6 mb-4 col-lg-8">
            <div class="row">
              <div class="col-12">
                <span class="description">
                  {{ phrases.pages.contact.address }}</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.wrapper-1 {
  position: relative;
  border-radius: var(--border-radius-xl);
  .container-fluid {
    color: var(--text-primary-color);
    &::before {
      content: '';
      display: block;
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      background: linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url("../../assets/images/contactus-image.jpg");
      z-index: -1;
      background-repeat: no-repeat;
      background-size: cover;
      border-radius: var(--border-radius-xl);
      opacity: .6;
      background-position: center;
    }

    .horizontal-row {
      font-size: 1rem;
      display: flex;
      flex-direction: row;
      gap: 32px;
      margin-bottom: 10px;
      @media (min-width: 992px) {
        margin-bottom: 50px;
        width: 465px;
      }
    }
    .horizontal-row:before,
    .horizontal-row:after {
      content: "";
      flex: 1 1;
      border-bottom: 1px solid;
      margin: auto;
    }
    .title {
      font-size: 60px;
      font-weight: 700;
      margin-bottom: 100px;

      @media (min-width: 992px) {
        font-size: 69px;
        margin-bottom: 48px;
      }
    }
    .description {
      font-size: 1rem;
      @media (min-width: 992px) {
        width: 440px;
        margin-bottom: 48px;
      }
    }
    @media (min-width: 992px) {
      width: 556px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  }
}

.section-description {
  &:last-child {
    margin-bottom: 32px;
    @media (min-width: 992px) {
      margin-bottom: 32px;
    }
  }
  margin-bottom: 40px;
  @media (min-width: 992px) {
    margin-bottom: 60px;
  }
  .title {
    font-size: 140%;
    font-weight: bold;
    @media (min-width: 992px) {
      margin-bottom: 32px;
    }
  }
  .description {
    font-size: 1rem;
    font-weight: normal;
    line-height: 1.7;
  }
}
.section-contact {
  color: var(--text-primary-color);
  margin-bottom: 40px;

  .map {
    width: 100%;
    height: 134px;
    border-radius: var(--border-radius-md);
    @media (min-width: 992px) {
      height: 285px;
    }
  }
  .icon {
    width: 24px;
  }
  .icon-title {
    font-size: 90%;
    font-weight: bold;
    margin-bottom: 0;
  }
  .description {
    font-size: 90%;
    font-weight: 400;
  }

  a {
    color: inherit;
    font-size: 90%;
    font-weight: normal;
    cursor: pointer;
  }
}
</style>
