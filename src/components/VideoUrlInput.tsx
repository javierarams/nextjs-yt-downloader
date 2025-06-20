import React from 'react';
import { Search, Loader } from 'lucide-react';

interface VideoUrlInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
}

const VideoUrlInput: React.FC<VideoUrlInputProps> = ({ 
  value, 
  onChange, 
  onSubmit,
  loading 
}) => {
  return (
    <form onSubmit={onSubmit} className="w-full">
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste YouTube URLs separated by spaces..."
          className="w-full px-4 py-3 pr-12 bg-gray-800 border border-gray-700 rounded-md 
                    focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                    placeholder-gray-500 text-gray-200"
          disabled={loading}
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-indigo-600 
                    text-white rounded-md hover:bg-indigo-700 transition-colors focus:outline-none
                    focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800
                    disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading || !value.trim()}
        >
          {loading ? <Loader className="animate-spin\" size={18} /> : <Search size={18} />}
        </button>
      </div>
      <p className="text-xs text-gray-500 mt-2">
        Example: https://www.youtube.com/watch?v=VIDEO_ID1 https://youtu.be/VIDEO_ID2
      </p>
    </form>
  );
};

export default VideoUrlInput;