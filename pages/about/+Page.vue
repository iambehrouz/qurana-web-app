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
        <div class="horizontal-row">{{ phrases.pages.about.name }}</div>
        <p class="title text-center text-en">{{ phrases.pages.about.title }}</p>
        <p class="description text-center">
          {{ phrases.pages.about.subTitle }}
        </p>
      </div>
    </div>
  </section>

  <section class="container section-description mb">
    <h3 class="title mb-3">{{ phrases.pages.about.aboutTitle }}</h3>
    <p class="description mb-0">
      {{ phrases.pages.about.aboutDescription }}
    </p>
  </section>

  <section class="container section-description">
    <h3 class="title mb-3">{{ phrases.pages.about.whyTitle }}</h3>
    <p class="description mb-0">
      <ul>
        <li>
          {{ phrases.pages.about.whyItems.text1 }}
        </li>
        <li>
          {{ phrases.pages.about.whyItems.text2 }}
        </li>
        <li>
          {{ phrases.pages.about.whyItems.text3 }}
        </li>
        <li>
          {{ phrases.pages.about.whyItems.text4 }}
        </li>
      </ul>
    </p>
  </section>
</template>

<style lang="scss" scoped>
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
      background: linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url("../../assets/images/aboutus-image.jpg");
      z-index: -1;
      border-radius: var(--border-radius-xl);
      opacity: .8;
      background-repeat: no-repeat;
    }

    .horizontal-row {
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
      font-weight: blod;
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
    font-weight: 400;
    line-height: 1.7;
  }
}
.item {
  padding: 10px;
  border-radius: var(--border-radius-lg);
  border: 0.5px solid var(--border-card-color);
  .member-name {
    font-size: 120%;
    font-weight: bold;
    color: var(--text-primary-color);
  }
  .member-position {
    font-family: "mona";
    font-size: 90%;
    font-weight: normal;
    color: var(--text-secondary-color);
    @media (min-width: 992px) {
      font-size: 100%;
    }
  }

  .img-container {
    background-color: var(--background-secondary-color);
    border-radius: 15px;
    margin-bottom: 12px;
  }
  .item-img {
    width: 100%;
    max-width: 130px;
    @media (min-width: 992px) {
      max-width: 100%;
      width: 260px;
    }
  }
}
ul {
  padding-left: 10px;
  li {
    list-style: disc;
    margin-bottom: 15px;
  }
}
</style>
