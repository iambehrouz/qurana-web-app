import axios from "axios";
// const config = require("../config.json");
import config from "../config.json";

axios.defaults.timeout = 20000;
axios.defaults.baseURL = config.apiUrl;
axios.defaults.withCredentials = true;

axios.interceptors.request.use((config) => {
  return config;
});

export default axios;
