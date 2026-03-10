<template>
  <v-card class="compressor-widget" elevation="4" rounded="xl">
    <v-card-text class="pa-6">
      <v-row>
        <v-col cols="12">
          <div
            class="upload-area"
            :class="{ dragover: isDragover }"
            @dragenter.prevent="isDragover = true"
            @dragleave.prevent="isDragover = false"
            @dragover.prevent
            @drop.prevent="onDrop"
          >
            <input
              ref="fileInput"
              type="file"
              accept=".mp3,audio/mpeg"
              class="d-none"
              @change="onFileSelected"
            />

            <v-icon
              :icon="currentFile ? 'mdi-file-music' : 'mdi-cloud-upload'"
              size="64"
              :color="currentFile ? 'primary' : 'grey'"
              class="mb-3"
            />

            <div v-if="!currentFile" class="text-center">
              <p class="text-h6 mb-2">Перетащите MP3 файл сюда</p>
              <p class="text-body-2 text-grey mb-4">или</p>
              <v-btn
                color="primary"
                variant="tonal"
                @click="triggerFileUpload"
                prepend-icon="mdi-file"
              >
                Выбрать файл
              </v-btn>
              <p class="text-caption text-grey mt-4">
                Максимальный размер: 100 МБ
              </p>
            </div>

            <div v-else class="selected-file">
              <v-list-item>
                <template v-slot:prepend>
                  <v-avatar color="primary" rounded>
                    <v-icon color="white">mdi-file-music</v-icon>
                  </v-avatar>
                </template>

                <v-list-item-title class="font-weight-bold">
                  {{ currentFile.name }}
                </v-list-item-title>

                <v-list-item-subtitle>
                  {{ formatFileSize(currentFile.size) }}
                </v-list-item-subtitle>

                <template v-slot:append>
                  <v-btn
                    icon="mdi-close"
                    size="small"
                    variant="text"
                    @click="reset"
                  />
                </template>
              </v-list-item>
            </div>
          </div>
        </v-col>
      </v-row>

      <v-slide-y-transition>
        <v-row v-if="currentFile && currentFile.status !== 'done'" class="mt-6">
          <v-col cols="12">
            <v-card variant="outlined" class="pa-4">
              <h3 class="text-h6 mb-4">
                <v-icon start color="primary">mdi-tune</v-icon>
                Настройки сжатия
              </h3>

              <v-row>
                <v-col cols="12">
                  <v-label class="text-body-2 mb-2">
                    Битрейт: {{ compressionOptions.bitrate }} kbps
                  </v-label>
                  <v-slider
                    v-model="compressionOptions.bitrate"
                    :min="32"
                    :max="320"
                    :step="32"
                    thumb-label
                    :thumb-size="24"
                    show-ticks="always"
                    tick-size="4"
                    color="primary"
                  >
                    <template v-slot:append>
                      <v-text-field
                        v-model.number="compressionOptions.bitrate"
                        type="number"
                        style="width: 100px"
                        density="compact"
                        hide-details
                        :min="32"
                        :max="320"
                        :step="32"
                        variant="outlined"
                      />
                    </template>
                  </v-slider>
                  <div
                    class="d-flex justify-space-between text-caption text-grey mt-1"
                  >
                    <span>Меньше размер</span>
                    <span>Лучше качество</span>
                  </div>
                </v-col>
              </v-row>

              <v-row class="mt-2">
                <v-col cols="12">
                  <v-checkbox
                    v-model="compressionOptions.mono"
                    label="Моно (уменьшает размер в 2 раза)"
                    color="primary"
                    hide-details
                  />
                </v-col>
              </v-row>

              <v-row v-if="showAdvanced" class="mt-2">
                <v-col cols="12">
                  <v-label class="text-body-2 mb-2">
                    Качество (VBR): {{ compressionOptions.quality || 5 }}
                  </v-label>
                  <v-slider
                    v-model="compressionOptions.quality"
                    :min="0"
                    :max="9"
                    :step="1"
                    thumb-label
                    show-ticks="always"
                    color="primary"
                  />
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12">
                  <v-btn
                    variant="text"
                    color="primary"
                    size="small"
                    @click="showAdvanced = !showAdvanced"
                  >
                    <v-icon start>
                      {{ showAdvanced ? "mdi-chevron-up" : "mdi-chevron-down" }}
                    </v-icon>
                    {{ showAdvanced ? "Скрыть" : "Показать" }} расширенные
                    настройки
                  </v-btn>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </v-slide-y-transition>

      <v-slide-y-transition>
        <v-row v-if="currentFile && currentFile.status === 'idle'" class="mt-4">
          <v-col cols="12">
            <v-btn
              color="success"
              size="x-large"
              block
              @click="compress"
              :disabled="isCompressing"
              prepend-icon="mdi-compress"
              elevation="2"
            >
              Сжать MP3
            </v-btn>
          </v-col>
        </v-row>
      </v-slide-y-transition>

      <v-slide-y-transition>
        <v-row v-if="currentFile?.status === 'compressing'" class="mt-4">
          <v-col cols="12">
            <v-card color="primary" variant="tonal" class="pa-4">
              <v-row align="center">
                <v-col cols="12" class="text-center mb-2">
                  <v-progress-circular
                    :model-value="compressionProgress"
                    :size="60"
                    :width="6"
                    color="primary"
                    indeterminate
                  >
                    {{ compressionProgress }}%
                  </v-progress-circular>
                </v-col>
                <v-col cols="12" class="text-center">
                  <p class="text-body-1 font-weight-bold">Сжатие...</p>
                  <p class="text-caption">Это может занять несколько секунд</p>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </v-slide-y-transition>

      <v-slide-y-transition>
        <v-row v-if="currentFile?.status === 'done'" class="mt-4">
          <v-col cols="12">
            <v-alert type="success" variant="tonal" class="mb-4">
              <div class="d-flex align-center">
                <v-icon size="32" class="mr-3">mdi-check-circle</v-icon>
                <div>
                  <div class="font-weight-bold text-h6">Готово!</div>
                  <div class="text-body-2">Сжатие завершено успешно</div>
                </div>
              </div>
            </v-alert>

            <v-card variant="outlined" class="pa-4">
              <v-row>
                <v-col cols="6" class="text-center">
                  <div class="text-caption text-grey">Исходный размер</div>
                  <div class="text-h6 font-weight-bold">
                    {{ formatFileSize(currentFile.size) }}
                  </div>
                </v-col>
                <v-col cols="6" class="text-center">
                  <div class="text-caption text-grey">Сжатый размер</div>
                  <div class="text-h6 font-weight-bold text-primary">
                    {{ formatFileSize(currentFile.compressedSize || 0) }}
                  </div>
                </v-col>
                <v-col cols="12" class="text-center mt-2">
                  <v-chip color="success" text-color="white">
                    Сжатие: {{ compressionRatio }}%
                  </v-chip>
                </v-col>
              </v-row>
            </v-card>

            <div class="d-flex flex-column gap-4 mt-4">
              <v-btn
                color="primary"
                block
                size="large"
                @click="downloadCompressed"
                prepend-icon="mdi-download"
              >
                Скачать
              </v-btn>
              <v-btn
                color="secondary"
                block
                size="large"
                variant="outlined"
                @click="reset"
                prepend-icon="mdi-refresh"
              >
                Новый файл
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-slide-y-transition>

      <v-slide-y-transition>
        <v-row v-if="currentFile?.status === 'error'" class="mt-4">
          <v-col cols="12">
            <v-alert type="error" variant="tonal" class="mb-4">
              <div class="d-flex align-center">
                <v-icon size="32" class="mr-3">mdi-alert-circle</v-icon>
                <div>
                  <div class="font-weight-bold text-h6">Ошибка</div>
                  <div class="text-body-2">{{ currentFile.error }}</div>
                </div>
              </div>
            </v-alert>

            <v-btn
              color="primary"
              block
              size="large"
              @click="reset"
              prepend-icon="mdi-refresh"
            >
              Попробовать снова
            </v-btn>
          </v-col>
        </v-row>
      </v-slide-y-transition>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { saveFile } from "modern-file-saver";

import type {
  IAudioFile,
  CompressionOptions,
} from "~/entities/audio-file/model/types";
import {
  createAudioFile,
  formatFileSize,
  validateMp3File,
} from "~/entities/audio-file/lib/audio-file";

import { compressMP3 } from "~/features/compress-mp3/lib/compressor";

const fileInput = ref<HTMLInputElement | null>(null);
const currentFile = ref<IAudioFile | null>(null);
const isDragover = ref(false);
const isCompressing = ref(false);
const compressionProgress = ref(0);
const showAdvanced = ref(false);

const compressionOptions = ref<CompressionOptions>({
  bitrate: 128,
  mono: false,
  quality: 5,
});

function triggerFileUpload() {
  fileInput.value?.click();
}

async function onFileSelected(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];

  if (!file) return;

  await processFile(file);
  input.value = "";
}

async function onDrop(event: DragEvent) {
  isDragover.value = false;
  const file = event.dataTransfer?.files[0];

  if (!file) return;
  await processFile(file);
}

async function processFile(file: File) {
  const validation = validateMp3File(file);
  if (!validation.valid) {
    alert(validation.error);
    return;
  }

  currentFile.value = createAudioFile(file);
}

async function compress() {
  if (!currentFile.value) return;

  isCompressing.value = true;
  currentFile.value.status = "compressing";
  compressionProgress.value = 0;

  try {
    const compressedBlob = await compressMP3(
      currentFile.value.file,
      compressionOptions.value,
      (progress) => {
        compressionProgress.value = progress;
      },
    );

    currentFile.value.compressedFile = compressedBlob;
    currentFile.value.compressedSize = compressedBlob.size;
    currentFile.value.status = "done";
  } catch (error) {
    console.error("Compression error:", error);
    currentFile.value.status = "error";
    currentFile.value.error =
      error instanceof Error ? error.message : "Неизвестная ошибка при сжатии";
  } finally {
    isCompressing.value = false;
  }
}

async function downloadCompressed() {
  if (!currentFile.value?.compressedFile) return;

  const fileName = currentFile.value.name.replace(".mp3", "_compressed.mp3");
  await saveFile(currentFile.value.compressedFile, {
    fileName: fileName,
    mimeType: "audio/mpeg",
  });
}

function reset() {
  currentFile.value = null;
  compressionProgress.value = 0;
  isCompressing.value = false;
}

const compressionRatio = computed(() => {
  if (!currentFile.value?.compressedSize || !currentFile.value?.size)
    return "0";
  const ratio =
    (1 - currentFile.value.compressedSize / currentFile.value.size) * 100;
  return ratio.toFixed(1);
});
</script>

<style scoped>
.compressor-widget {
  max-width: 600px;
  margin: 0 auto;
  background: white;
}

.upload-area {
  border: 2px dashed #ccc;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #fafafa;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.upload-area:hover {
  border-color: #3f51b5;
  background: rgba(63, 81, 181, 0.02);
}

.upload-area.dragover {
  border-color: #3f51b5;
  background: rgba(63, 81, 181, 0.1);
  transform: scale(1.02);
}

.selected-file {
  width: 100%;
}

.gap-4 {
  gap: 1rem;
}

:deep(.v-slider__ticks) {
  color: #3f51b5;
}

:deep(.v-slider-track__fill) {
  background: #3f51b5 !important;
}
</style>
