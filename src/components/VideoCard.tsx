"use client";
import React, { useState } from 'react';
import { Download, X, Clock, Check, AlertTriangle } from 'lucide-react';
import { VideoInfo, DownloadStatus } from '../types';
import { downloadVideo } from '../utils/youtube';

interface VideoCardProps {
  video: VideoInfo;
  onRemove: () => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onRemove }) => {
  const [downloadStatus, setDownloadStatus] = useState<DownloadStatus>('idle');
  const [selectedQuality, setSelectedQuality] = useState<string>(video.qualities[0] || 'highest');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    setDownloadStatus('downloading');
    setProgress(0);
    setError(null);
    
    try {
      await downloadVideo(video.id, selectedQuality, video.title, (progressPercent) => {
        setProgress(progressPercent);
      });
      setDownloadStatus('completed');
    } catch (err) {
      console.error('Download error:', err);
      setError(err instanceof Error ? err.message : 'Failed to download video');
      setDownloadStatus('error');
    }
  };

  const getStatusIcon = () => {
    switch (downloadStatus) {
      case 'downloading':
        return <Clock className="animate-pulse text-yellow-500\" size={18} />;
      case 'completed':
        return <Check className="text-green-500" size={18} />;
      case 'error':
        return <AlertTriangle className="text-red-500" size={18} />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-all hover:shadow-xl">
      <div className="relative">
        <img 
          src={video.thumbnail} 
          alt={video.title} 
          className="w-full h-40 object-cover" 
        />
        <button 
          onClick={onRemove}
          className="absolute top-2 right-2 p-1 bg-black/70 rounded-full hover:bg-black transition-colors"
          aria-label="Remove video"
        >
          <X size={16} />
        </button>
        <div className="absolute bottom-0 right-0 bg-black/70 px-2 py-1 text-xs">
          {video.duration}
        </div>
      </div>

      <div className="p-4">
        <h4 className="font-medium text-lg mb-2 line-clamp-2" title={video.title}>
          {video.title}
        </h4>
        <p className="text-gray-400 text-sm mb-4">
          {video.channel}
        </p>

        <div className="mb-4">
          <label className="block text-sm text-gray-400 mb-1" htmlFor={`quality-${video.id}`}>
            Quality:
          </label>
          <select
            id={`quality-${video.id}`}
            value={selectedQuality}
            onChange={(e) => setSelectedQuality(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-sm"
            disabled={downloadStatus === 'downloading'}
          >
            {video.qualities.map(quality => (
              <option key={quality} value={quality}>{quality}</option>
            ))}
          </select>
        </div>

        {downloadStatus === 'downloading' && (
          <div className="mb-4">
            <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-600 transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-400 mt-1 text-right">{progress}%</p>
          </div>
        )}

        {error && (
          <p className="text-red-400 text-sm mb-3">{error}</p>
        )}

        <div className="flex items-center justify-between">
          <button
            onClick={handleDownload}
            disabled={downloadStatus === 'downloading'}
            className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-md
                      hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 
                      focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800
                      disabled:opacity-50 disabled:cursor-not-allowed w-full"
          >
            {downloadStatus === 'downloading' ? 'Downloading...' : 'Download'}
            {downloadStatus !== 'downloading' && <Download className="ml-2\" size={16} />}
          </button>

          {getStatusIcon() && (
            <div className="ml-2">
              {getStatusIcon()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoCard;