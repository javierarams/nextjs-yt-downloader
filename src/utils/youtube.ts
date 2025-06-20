import axios from 'axios';
import { VideoInfo } from '../types';

export function extractYouTubeUrls(input: string): string[] {
  const urlRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)(?:\S+)?/g;
  const matches = [...input.matchAll(urlRegex)];
  
  return matches.map(match => {
    const videoId = match[1];
    // Normalize to standard YouTube URL format
    return `https://www.youtube.com/watch?v=${videoId}`;
  });
}

export function getVideoIdFromUrl(url: string): string | null {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
  const match = url.match(regex);
  return match ? match[1] : null;
}

export async function fetchVideoInfo(url: string): Promise<VideoInfo> {
  const videoId = getVideoIdFromUrl(url);
  if (!videoId) {
    throw new Error(`Invalid YouTube URL: ${url}`);
  }

  try {
    const response = await axios.get(`/api/video-info`, {
      params: { videoId }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching video info:', error);
    throw new Error('Failed to fetch video information');
  }
}

export async function downloadVideo(
  videoId: string, 
  quality: string,
  title: string, 
  onProgress: (progress: number) => void
): Promise<void> {
  try {
    // Start the download
    const response = await axios.get(`/api/download`, {
      params: { videoId, quality },
      responseType: 'blob',
      onDownloadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted);
        }
      }
    });

    // Create a download link and trigger it
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    
    // Get the filename from the Content-Disposition header or use a default name
    const contentDisposition = response.headers['content-disposition'];
    console.log("contentDisposition", contentDisposition)
    let filename = `${title}.mp4`;
    //attachment; filename="Taylor Swift You Belong With Me.mp4"
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="(.+)"/);
      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1];
      }
    }
    
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading video:', error);
    throw new Error('Failed to download video');
  }
}

// Mock implementation for simulating progress in development
export async function mockDownloadVideo(
  videoId: string, 
  quality: string, 
  onProgress: (progress: number) => void
): Promise<void> {
  return new Promise((resolve) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      onProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        resolve();
      }
    }, 300);
  });
}
