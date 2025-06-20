import React from 'react';
import VideoCard from './VideoCard';
import { VideoInfo } from '../types';

interface VideoListProps {
  videos: VideoInfo[];
  onRemove: (videoId: string) => void;
}

const VideoList: React.FC<VideoListProps> = ({ videos, onRemove }) => {
  if (videos.length === 0) return null;

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Videos ({videos.length})</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {videos.map((video, index) => (
          <VideoCard 
            key={`${video.id}-${index}`} 
            video={video} 
            onRemove={() => onRemove(video.id)} 
          />
        ))}
      </div>
    </div>
  );
};

export default VideoList;