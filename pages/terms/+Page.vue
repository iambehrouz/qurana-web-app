<script setup>
import * as langauges from "../../languages/index";
import { usePageContext } from "../../renderer/usePageContext";

const pageContext = usePageContext();
const phrases = langauges.getPhrases(pageContext.data.lng);
</script>
<template>
  <div class="container pt-4">
    <h1 class="text-center mb-4">{{ phrases.pages.terms.title }}</h1>

    <p class="text-center">
      {{ phrases.pages.terms.description }}
    </p>

    <p class="text-center mb-5">
      {{ phrases.pages.terms.secondDescription }}
    </p>

    <h2>1. {{ phrases.pages.terms.titles.first }}</h2>
    <p>
      {{ phrases.pages.terms.descriptions.first }}
    </p>

    <h2>2. {{ phrases.pages.terms.titles.second }}</h2>
    <p>
      {{ phrases.pages.terms.descriptions.second }}
    </p>

    <h2>3. {{ phrases.pages.terms.titles.third }}</h2>
    <p>
      {{ phrases.pages.terms.descriptions.third }}
    </p>

    <h2>4. {{ phrases.pages.terms.titles.forth }}</h2>
    <p>
      {{ phrases.pages.terms.descriptions.forth }}
    </p>

    <h2>5. {{ phrases.pages.terms.titles.fifth }}</h2>
    <p>
      {{ phrases.pages.terms.descriptions.fifth }}
    </p>

    <h2>6. {{ phrases.pages.terms.titles.sixth }}</h2>
    <p>
      {{ phrases.pages.terms.descriptions.sixth }}
    </p>

    <h2>7. {{ phrases.pages.terms.titles.seventh }}</h2>
    <p>
      {{ phrases.pages.terms.descriptions.seventh }}
    </p>

    <h2>8. {{ phrases.pages.terms.titles.eighth }}</h2>
    <p>
      {{ phrases.pages.terms.descriptions.eighth }}
    </p>

    <h2>9. {{ phrases.pages.terms.titles.ninth }}</h2>
    <p>
      {{ phrases.pages.terms.descriptions.ninth }}
    </p>

    <h2>10. {{ phrases.pages.terms.titles.tenth }}</h2>
    <p class="contact">
      {{ phrases.pages.terms.descriptions.tenth }}
    </p>
    <p>{{ phrases.pages.terms.emailTitle }} <a href="mailto:info@trendytrades.io">info@trendytrades.io</a></p>
    <p>{{ phrases.pages.terms.callTitle }} +971-504-059262</p>
    <p>{{ phrases.pages.terms.addressTitle }} {{ phrases.pages.terms.address }}</p>
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
  line-height: 1.7;
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
