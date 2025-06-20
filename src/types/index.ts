export interface VideoInfo {
  id: string;
  url: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  channel: string;
  qualities: string[];
}

export type DownloadStatus = 'idle' | 'downloading' | 'completed' | 'error';

export interface DownloadOptions {
  quality: string;
  format: string;
}