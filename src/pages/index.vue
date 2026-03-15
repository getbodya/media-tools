<template>
  <v-app>
    <v-app-bar elevation="2" color="white">
      <v-container class="d-flex align-center justify-center">
        <h1 class="text-h5 text-sm-h4 font-weight-bold text-primary">
          Сжатие MP3
        </h1>
      </v-container>
    </v-app-bar>

    <v-main>
      <v-container fluid class="fill-height">
        <v-row align="center" justify="center" class="fill-height">
          <v-col cols="12" md="3" lg="3" class="d-none d-md-block">
            <!-- <v-card class="ad-container pa-4" elevation="2" height="400">
              <div class="ad-label text-caption text-grey mb-2">Реклама</div>
              <v-sheet
                class="ad-placeholder fill-height d-flex align-center justify-center"
              >
                <span class="text-grey">Рекламное место</span>
              </v-sheet>
            </v-card> -->
          </v-col>

          <v-col cols="12" md="6" lg="6">
            <h2 align="center">
              MP3 Compressor — это бесплатный онлайн-инструмент для уменьшения
              размера аудиофайлов. Мы не храним твои данные и не ставим
              ограничений на количество обработок. Сжимай музыку, аудиокниги и
              записи лекций за пару кликов.
            </h2>
            <v-slide-y-transition>
              <CompressorWidget />
            </v-slide-y-transition>
          </v-col>

          <v-col cols="12" md="3" lg="3" class="d-none d-md-block">
            <!-- <v-card class="ad-container pa-4" elevation="2" height="400">
              <div class="ad-label text-caption text-grey mb-2">Реклама</div>
              <v-sheet
                class="ad-placeholder fill-height d-flex align-center justify-center"
              >
                <span class="text-grey">Рекламное место</span>
              </v-sheet>
            </v-card> -->
          </v-col>

          <v-col cols="12" class="d-md-none mt-4">
            <!-- <v-card class="ad-container-mobile pa-2" elevation="2" height="100">
              <div class="ad-label text-caption text-grey">Реклама</div>
              <v-sheet
                class="ad-placeholder fill-height d-flex align-center justify-center"
              >
                <span class="text-grey">Рекламное место</span>
              </v-sheet>
            </v-card> -->
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <v-footer class="bg-grey-lighten-3 text-center">
      <v-container>
        <div class="text-caption text-grey-darken-1">
          © 2026 MP3 Compression. Все права защищены.
        </div>
      </v-container>
    </v-footer>
  </v-app>
</template>
<script setup lang="ts">
definePageMeta({
  layout: "default",
});

import CompressorWidget from "~/widgets/compressor-widget/ui/CompressorWidget.vue";

useHead({
  title: "Бесплатный онлайн компрессор MP3 | Сжать аудио файл",
  meta: [
    {
      name: "description",
      content:
        "Уменьшите размер MP3 файла без потери качества. Бесплатный онлайн инструмент для сжатия аудио с настройкой битрейта. Работает прямо в браузере.",
    },
  ],
});
</script>
<style scoped>
.v-app-bar {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}

.ad-container {
  background: rgba(250, 250, 250, 0.8);
  border: 1px dashed #ccc;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.ad-container:hover {
  border-color: #3f51b5;
  background: rgba(63, 81, 181, 0.02);
}

.ad-container-mobile {
  background: rgba(250, 250, 250, 0.8);
  border: 1px dashed #ccc;
  border-radius: 8px;
}

.ad-label {
  position: absolute;
  top: 4px;
  right: 8px;
  opacity: 0.7;
}

.ad-placeholder {
  min-height: 100%;
  width: 100%;
}
</style>
