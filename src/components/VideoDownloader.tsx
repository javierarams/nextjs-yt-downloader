"use client";
import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import VideoUrlInput from './VideoUrlInput';
import VideoList from './VideoList';
import { VideoInfo } from '../types';
import { extractYouTubeUrls, fetchVideoInfo } from '../utils/youtube';

const VideoDownloader: React.FC = () => {
  const [urlInput, setUrlInput] = useState('');
  const [videos, setVideos] = useState<VideoInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (value: string) => {
    setUrlInput(value);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    const urls = extractYouTubeUrls(urlInput);
    if (urls.length === 0) {
      setError('No valid YouTube URLs found. Please enter valid YouTube video URLs.');
      return;
    }

    setLoading(true);
    try {
      const videoInfoPromises = urls.map(url => fetchVideoInfo(url));
      const videoInfoResults = await Promise.allSettled(videoInfoPromises);
      
      const validVideos: VideoInfo[] = [];
      videoInfoResults.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          validVideos.push(result.value);
        } else {
          console.error(`Failed to fetch info for ${urls[index]}: ${result.reason}`);
        }
      });

      if (validVideos.length === 0) {
        setError('Failed to fetch video information. Please check your URLs and try again.');
      } else {
        setVideos(prevVideos => [...validVideos, ...prevVideos]);
        setUrlInput('');
      }
    } catch (err) {
      console.error('Error fetching video information:', err);
      setError('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const removeVideo = (videoId: string) => {
    setVideos(videos.filter(video => video.id !== videoId));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Download YouTube Videos</h2>
        <p className="text-gray-400 mb-6">
          Enter YouTube video URLs separated by spaces to download videos with audio.
        </p>
        
        <VideoUrlInput
          value={urlInput}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
          loading={loading}
        />
        
        {error && (
          <div className="mt-4 p-4 bg-red-900/30 border border-red-500 rounded-md flex items-start">
            <AlertCircle className="text-red-500 mr-2 flex-shrink-0 mt-0.5\" size={18} />
            <p className="text-red-200 text-sm">{error}</p>
          </div>
        )}
      </div>

      {videos.length > 0 && (
        <VideoList videos={videos} onRemove={removeVideo} />
      )}
    </div>
  );
};

export default VideoDownloader;