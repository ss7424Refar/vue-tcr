/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Components
import App from "./App.vue";

// Composables
import { createApp } from "vue";

// Plugins
import { registerPlugins } from "@/plugins";

const app = createApp(App);

registerPlugins(app);

import axios from "axios";

// axios.defaults.baseURL = 'http://192.168.100.162:7081/api'
axios.defaults.baseURL = 'http://192.168.11.222:7081/api'
app.config.globalProperties.$http = axios

app.mount("#app");
