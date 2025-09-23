<script setup>
// import helpers from "../../assets/scripts/helpers";
import { onMounted } from "vue";
import { usePageContext } from "../../renderer/usePageContext";
import { useMainStore } from "../../stores/main";
import axios from "../../helpers/axios";
import * as cookies from "vue-cookies";
import config from "../../config.json";

const main = useMainStore();
const pageContext = usePageContext();
onMounted(async () => {
  const response = await axios.post("/account/logout");
  console.log(response);
  if (response.data.status) {
    pageContext.data.user = null;
    cookies.set("x-access-token", null, "365d", null, config.cookieDomain);
    window.location.href = "/";
  } else {
    main.layout.toasts.push({
      type: "danger",
      title: "  user logout",
      message: response.data.message,
      datetime: new Date(),
    });
  }
});
</script>
