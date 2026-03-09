export interface IAudioFile {
  id: string;
  file: File;
  name: string;
  size: number;
  duration?: number;
  compressedFile?: Blob;
  compressedSize?: number;
  status: "idle" | "compressing" | "done" | "error";
  error?: string;
}

export interface CompressionOptions {
  bitrate: number;
  mono: boolean;
  quality?: number;
}

export interface CompressionResult {
  success: boolean;
  blob?: Blob;
  error?: string;
  originalSize: number;
  compressedSize?: number;
  compressionRatio?: number;
}
