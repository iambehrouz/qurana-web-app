<script setup>
import * as langauges from "../../languages/index";
import { usePageContext } from "../../renderer/usePageContext";

const pageContext = usePageContext();
const phrases = langauges.getPhrases(pageContext.data.lng);
</script>
<template>
  <div class="container pt-4">
    <h1 class="text-center mb-4">{{ phrases.pages.refund.title }}</h1>

    <p class="text-center mb-5">
      {{ phrases.pages.refund.description }}
    </p>

    <h2>{{ phrases.pages.refund.titles.first }}</h2>
    <ul>
      <li>
        {{ phrases.pages.refund.lists.firstListItems.first }}
      </li>
      <li>
        {{ phrases.pages.refund.lists.firstListItems.second }}
      </li>
    </ul>

    <h2>{{ phrases.pages.refund.titles.second }}</h2>
    <ul>
      <li>
        {{ phrases.pages.refund.lists.secondListItems.first }}
      </li>
      <li>
        {{ phrases.pages.refund.lists.secondListItems.second }}
      </li>
    </ul>

    <h2>{{ phrases.pages.refund.titles.third }}</h2>
    <ul>
      <li>
        {{ phrases.pages.refund.lists.thirdListItems.first }}
      </li>
      <li>
        {{ phrases.pages.refund.lists.thirdListItems.second }}
      </li>
    </ul>

    <h2>{{ phrases.pages.refund.titles.forth }}</h2>
    <p class="contact">
      {{ phrases.pages.refund.contactDescription }}
    </p>
    <p>{{ phrases.pages.refund.emailTitle }} <a href="mailto:info@trendytrades.io">info@trendytrades.io</a></p>
    <p>{{ phrases.pages.refund.callTitle }} +971-504-059262</p>
    <p>{{ phrases.pages.refund.addressTitle }} {{ phrases.pages.refund.address }}</p>
  </div>
</template>

<style lang="scss" scoped>
h1,
h2 {
  color: var(--text-primary-color);
}

h1 {
  font-size: 2rem;
  margin-bottom: 10px;
}

h2 {
  font-size: 1.5rem;
  margin-top: 20px;
}

p {
  margin: 10px 0;
}

ul {
  margin: 10px 0;
  padding-left: 20px;
}

li {
  margin-bottom: 5px;
}

a {
  color: var(--primary-color);
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

.contact {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #ddd;
}
</style>
