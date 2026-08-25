import { createApp } from "vue";
import "./style.scss";
import App from "./App.vue";
import { router } from "@/router.js";
import { createPinia } from "pinia";
import i18next from "i18next";
import I18NextVue from "i18next-vue";
import { createI18nContentHelpers } from "@/utils/utils.js";

const app = createApp(App);

const { tContent } = createI18nContentHelpers(i18next);

app.use(router).use(createPinia()).use(I18NextVue, { i18next });
app.provide("tContent", tContent);
app.mount("#app");
