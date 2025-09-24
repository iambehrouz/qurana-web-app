<script setup>
import * as langauges from "../../languages/index";
import { usePageContext } from "../../renderer/usePageContext";

const pageContext = usePageContext();
const phrases = langauges.getPhrases(pageContext.data.lng);
</script>
<template>
  <div class="container pt-4">
    <h1 class="text-center mb-4">{{ phrases.pages.privacy.title }}</h1>

    <p class="text-center mb-5">
      At Qurana, your privacy is our priority. This
      Privacy Policy outlines how we collect, use, and protect your personal
      information when you visit our online shop or purchase our products.
    </p>

    <h2>1. {{ phrases.pages.privacy.titles.first }}</h2>
    <p>
      {{ phrases.pages.privacy.descriptions.first }}
    </p>
    <ul>
      <li>
        <strong>{{ phrases.pages.privacy.lists.firstListItems.first.title }}</strong> {{ phrases.pages.privacy.lists.firstListItems.first.text }}
      </li>
      <li>
        <strong>{{ phrases.pages.privacy.lists.firstListItems.second.title }}</strong> {{ phrases.pages.privacy.lists.firstListItems.second.text }}
      </li>
    </ul>

    <h2>2. {{ phrases.pages.privacy.titles.second }}</h2>
    <p>{{ phrases.pages.privacy.descriptions.second }}</p>
    <ul>
      <li>
        <strong>{{ phrases.pages.privacy.lists.secondListItems.first.title }}</strong> {{ phrases.pages.privacy.lists.secondListItems.first.text }}
      </li>
      <li>
        <strong>{{ phrases.pages.privacy.lists.secondListItems.second.title }}</strong> {{ phrases.pages.privacy.lists.secondListItems.second.text }}
      </li>
      <li>
        <strong>{{ phrases.pages.privacy.lists.secondListItems.third.title }}</strong> {{ phrases.pages.privacy.lists.secondListItems.third.text }}
      </li>
      <li>
        <strong>{{ phrases.pages.privacy.lists.secondListItems.forth.title }}</strong> {{ phrases.pages.privacy.lists.secondListItems.forth.text }}
      </li>
    </ul>

    <h2>3. {{ phrases.pages.privacy.titles.third }}</h2>
    <p>
      {{ phrases.pages.privacy.descriptions.third }}
    </p>
    <ul>
      <li>
        <strong>{{ phrases.pages.privacy.lists.thirdListItems.first.title }}</strong> {{ phrases.pages.privacy.lists.thirdListItems.first.text }}
      </li>
      <li>
        <strong>{{ phrases.pages.privacy.lists.thirdListItems.second.title }}</strong> {{ phrases.pages.privacy.lists.thirdListItems.second.text }}
      </li>
      <li>
        <strong>{{ phrases.pages.privacy.lists.thirdListItems.third.title }}</strong> {{ phrases.pages.privacy.lists.thirdListItems.third.text }}
      </li>
    </ul>

    <h2>4. {{ phrases.pages.privacy.titles.forth }}</h2>
    <p>
      {{ phrases.pages.privacy.descriptions.forth }}
    </p>
    <p>
      {{ phrases.pages.privacy.lists.forthListItems.first }}
    </p>

    <h2>5. {{ phrases.pages.privacy.titles.fifth }}</h2>
    <p>
      {{ phrases.pages.privacy.descriptions.fifth }}
    </p>

    <h2>6. {{ phrases.pages.privacy.titles.sixth }}</h2>
    <p>{{ phrases.pages.privacy.descriptions.sixth }}</p>
    <ul>
      <li>
        <strong>{{ phrases.pages.privacy.lists.sixthListItems.first.title }}</strong> {{ phrases.pages.privacy.lists.sixthListItems.first.text }}
      </li>
      <li>
        <strong>{{ phrases.pages.privacy.lists.sixthListItems.second.title }}</strong> {{ phrases.pages.privacy.lists.sixthListItems.second.text }}
      </li>
      <li>
        <strong>{{ phrases.pages.privacy.lists.sixthListItems.third.title }}</strong> {{ phrases.pages.privacy.lists.sixthListItems.third.text }}
      </li>
      <li>
        <strong>{{ phrases.pages.privacy.lists.sixthListItems.forth.title }}</strong> {{ phrases.pages.privacy.lists.sixthListItems.forth.text }}
      </li>
    </ul>

    <h2>7. {{ phrases.pages.privacy.titles.seventh }}</h2>
    <p>
      {{ phrases.pages.privacy.descriptions.seventh }}
    </p>

    <h2>8. {{ phrases.pages.privacy.titles.eighth }}</h2>
    <p>
      {{ phrases.pages.privacy.descriptions.eighth }}
    </p>

    <h2>9. {{ phrases.pages.privacy.titles.ninth }}</h2>
    <p class="contact">
      {{ phrases.pages.privacy.descriptions.ninth }}
    </p>
    <p>{{ phrases.pages.privacy.emailTitle }} <a href="mailto:info@trendytrades.io">info@trendytrades.io</a></p>
    <p>{{ phrases.pages.privacy.callTitle }} +971-504-059262</p>
    <p>{{ phrases.pages.privacy.addressTitle }} {{ phrases.pages.privacy.address }}</p>
  </div>
</template>

<style lang="scss" scoped>
h1,
h2 {
  color: var(--text-primary-color);
}

h1 {
  font-size: 2em;
  margin-bottom: 20px;
}

h2 {
  margin-top: 20px;
}

p {
  margin-bottom: 15px;
  line-height: 1.7;
}

ul {
  margin: 10px 0;
  padding-left: 20px;
}

li {
  list-style: bullets;
  margin-bottom: 10px;
  line-height: 1.7;
}

footer {
  text-align: center;
  margin-top: 20px;
  padding: 10px;
  font-size: 0.9em;
  color: #777;
}

a {
  color: var(--primary-color);
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>
