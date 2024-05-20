import { createApp } from "vue";
import App from "./App.vue";
import PrimeVue from 'primevue/config';

import 'primevue/resources/themes/aura-light-green/theme.css'
import 'primeflex/primeflex.css';

createApp(App).use(PrimeVue).mount("#app");
