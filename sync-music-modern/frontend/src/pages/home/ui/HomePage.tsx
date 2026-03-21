import React from 'react';
import { MusicPlayer } from '@/widgets/music-player/ui/MusicPlayer';
import { Track } from '@/entities/track/model/types';

const currentTrack: Track = {
  id: '1',
  title: 'Night Owl',
  artist: 'Broke For Free',
  src: '/track.mp3',
  cover: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60' // Dummy beautiful cover
};

export const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#121212] p-4 font-sans text-white">
      <h1 className="text-4xl font-extrabold mb-8 tracking-tighter bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
        SyncMusic
      </h1>
      <MusicPlayer track={currentTrack} />
      <p className="mt-8 text-gray-500 text-sm">
        PWA Audio Player powered by React & WebSockets
      </p>
    </div>
  );
};