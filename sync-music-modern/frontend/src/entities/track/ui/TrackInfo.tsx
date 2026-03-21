import React from 'react';
import { Track } from '../model/types';

interface TrackInfoProps {
  track: Track;
}

export const TrackInfo: React.FC<TrackInfoProps> = ({ track }) => {
  return (
    <div className="flex flex-col items-center mb-6">
      <div className="w-48 h-48 bg-gray-800 rounded-lg shadow-xl mb-4 overflow-hidden flex items-center justify-center">
        {track.cover ? (
          <img src={track.cover} alt={track.title} className="w-full h-full object-cover" />
        ) : (
          <span className="text-gray-500 text-6xl">🎵</span>
        )}
      </div>
      <h2 className="text-2xl font-bold text-white mb-1">{track.title}</h2>
      <p className="text-gray-400">{track.artist}</p>
    </div>
  );
};