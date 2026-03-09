import type { CompressionOptions } from "~/entities/audio-file/model/types";

let lamejs: any = null;

async function getLame() {
  if (!lamejs) {
    const lame = await import("lamejs");

    lamejs = lame.default || lame;

    if (typeof lamejs === "object" && lamejs.Mp3Encoder) {
      console.log("lamejs успешно загружен");
    } else {
      console.error("Структура lamejs:", Object.keys(lamejs));
    }
  }
  return lamejs;
}

export async function compressMP3(
  audioFile: File,
  options: CompressionOptions,
  onProgress?: (progress: number) => void,
): Promise<Blob> {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("Начинаем сжатие MP3...", options);

      const lame = await getLame();

      const Mp3Encoder = lame.Mp3Encoder;

      if (!Mp3Encoder) {
        throw new Error("Mp3Encoder не найден в lamejs");
      }

      const AudioContextClass =
        window.AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioContextClass();

      const arrayBuffer = await audioFile.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

      const channels = options.mono
        ? 1
        : Math.min(2, audioBuffer.numberOfChannels);
      const sampleRate = audioBuffer.sampleRate;
      const bitrate = options.bitrate;

      console.log("Параметры сжатия:", { channels, sampleRate, bitrate });

      const encoder = new Mp3Encoder(channels, sampleRate, bitrate);

      const samples = [];
      for (let i = 0; i < channels; i++) {
        samples.push(
          audioBuffer.getChannelData(
            Math.min(i, audioBuffer.numberOfChannels - 1),
          ),
        );
      }

      const blockSize = 1152;
      const totalSamples = samples[0].length;
      const mp3Chunks: Int8Array[] = [];

      for (let i = 0; i < totalSamples; i += blockSize) {
        const remaining = Math.min(blockSize, totalSamples - i);
        const channelBuffers = [];

        for (let channel = 0; channel < channels; channel++) {
          const sampleBlock = samples[channel].slice(i, i + remaining);

          const int16Buffer = new Int16Array(remaining);
          for (let j = 0; j < remaining; j++) {
            let sample = Math.max(-1, Math.min(1, sampleBlock[j]));
            int16Buffer[j] = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
          }
          channelBuffers.push(int16Buffer);
        }

        let mp3Chunk: Int8Array;
        if (channels === 2) {
          mp3Chunk = encoder.encodeBuffer(channelBuffers[0], channelBuffers[1]);
        } else {
          mp3Chunk = encoder.encodeBuffer(channelBuffers[0]);
        }

        if (mp3Chunk && mp3Chunk.length > 0) {
          mp3Chunks.push(mp3Chunk);
        }

        if (onProgress) {
          const progress = Math.floor((i / totalSamples) * 100);
          onProgress(progress);
        }
      }

      const lastChunk = encoder.flush();
      if (lastChunk && lastChunk.length > 0) {
        mp3Chunks.push(lastChunk);
      }

      const totalLength = mp3Chunks.reduce(
        (acc, chunk) => acc + chunk.length,
        0,
      );
      const resultBuffer = new Int8Array(totalLength);
      let offset = 0;

      for (const chunk of mp3Chunks) {
        resultBuffer.set(chunk, offset);
        offset += chunk.length;
      }

      const blob = new Blob([resultBuffer], { type: "audio/mp3" });

      await audioContext.close();

      console.log("Сжатие завершено:", {
        originalSize: audioFile.size,
        compressedSize: blob.size,
        ratio: ((1 - blob.size / audioFile.size) * 100).toFixed(1) + "%",
      });

      resolve(blob);
    } catch (error) {
      console.error("Ошибка при сжатии MP3:", error);
      reject(error);
    }
  });
}

export async function compressMP3WithCDN(
  audioFile: File,
  options: CompressionOptions,
  onProgress?: (progress: number) => void,
): Promise<Blob> {
  return new Promise(async (resolve, reject) => {
    try {
      if (!(window as any).lamejs) {
        await new Promise<void>((resolveScript, rejectScript) => {
          const script = document.createElement("script");
          script.src = "https://cdn.jsdelivr.net/npm/lamejs@1.2.1/lame.min.js";
          script.onload = () => resolveScript();
          script.onerror = rejectScript;
          document.head.appendChild(script);
        });
      }

      const lame = (window as any).lamejs;
    } catch (error) {
      reject(error);
    }
  });
}
