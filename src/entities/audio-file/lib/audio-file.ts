import type { IAudioFile } from "../model/types";

export function createAudioFile(file: File): IAudioFile {
  return {
    id: crypto.randomUUID(),
    file,
    name: file.name,
    size: file.size,
    status: "idle",
  };
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export function validateMp3File(file: File): {
  valid: boolean;
  error?: string;
} {
  if (
    !file.type.includes("audio/mpeg") &&
    !file.name.toLowerCase().endsWith(".mp3")
  ) {
    return { valid: false, error: "Пожалуйста, выберите MP3 файл" };
  }

  const maxSize = 100 * 1024 * 1024;
  if (file.size > maxSize) {
    return {
      valid: false,
      error: "Файл слишком большой. Максимальный размер 100 МБ",
    };
  }

  return { valid: true };
}

export async function getAudioDuration(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    audio.src = URL.createObjectURL(file);

    audio.addEventListener("loadedmetadata", () => {
      URL.revokeObjectURL(audio.src);
      resolve(audio.duration);
    });

    audio.addEventListener("error", reject);
  });
}

export function compareFileSizes(original: IAudioFile): {
  originalSize: string;
  compressedSize: string;
  ratio: number;
  savedSpace: string;
} {
  if (!original.compressedSize) {
    return {
      originalSize: formatFileSize(original.size),
      compressedSize: "0 B",
      ratio: 0,
      savedSpace: "0 B",
    };
  }

  const ratio = (1 - original.compressedSize / original.size) * 100;
  const savedSpace = original.size - original.compressedSize;

  return {
    originalSize: formatFileSize(original.size),
    compressedSize: formatFileSize(original.compressedSize),
    ratio: Math.round(ratio * 10) / 10,
    savedSpace: formatFileSize(savedSpace),
  };
}
