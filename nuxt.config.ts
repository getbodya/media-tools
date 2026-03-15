export default defineNuxtConfig({
  target: "static",
  srcDir: "src/",
  modules: ["vuetify-nuxt-module", "@nuxtjs/sitemap"],
  // @ts-ignore
  vuetify: {
    moduleOptions: {
      styles: true,
      // @ts-ignore
      autoImport: true,
    },
    vuetifyOptions: {
      theme: {
        defaultTheme: "light",
        themes: {
          light: {
            dark: false,
            colors: {
              primary: "#3f51b5",
              secondary: "#ff4081",
              accent: "#7c4dff",
              error: "#f44336",
              warning: "#ff9800",
              info: "#2196f3",
              success: "#4caf50",
            },
          },
        },
      },
      defaults: {
        VBtn: {
          variant: "flat",
          rounded: "lg",
        },
        VCard: {
          rounded: "lg",
          elevation: 2,
        },
      },
    },
  },
  css: [
    "@mdi/font/css/materialdesignicons.min.css",
    "./src/app/styles/global.css",
  ],
  sitemap: {
    hostname: "https://mp3slim.com",
    path: "/sitemap.xml",
    gzip: true,
    exclude: ["/admin/**", "/_nuxt/**", "/server/**"],
  },
  ssr: true,
  vite: {
    optimizeDeps: {
      include: ["lamejs"],
    },
  },
  compatibilityDate: "2025-03-09",
  // build: {
  //   transpile: ["file-saver"],
  // },
  app: {
    head: {
      meta: [{ name: "yandex-verification", content: "94274c217da521f9" }],
    },
  },
});
