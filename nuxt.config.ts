// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-12-12",
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "@vueuse/nuxt"],
  css: ["~/assets/css/main.css"],
  app: {
    head: {
      link: [{ rel: "icon", type: "image/x-icon", href: "/logo.svg" }],
    },
  },
  ui: {
    colors: {
      primary: "blue",
      secondary: "sky",
      success: "emerald",
      warning: "amber",
      error: "red",
      neutral: "slate",
    },
  },
  vite: {
    server: {
      allowedHosts: ["institute-funky-default-mrna.trycloudflare.com"],
    },
    optimizeDeps: {
      include: ["echarts", "vue-echarts"],
    },
  },
  build: {
    transpile: ["echarts", "vue-echarts", "resize-detector"],
  },
});
