import React from 'react';
import { useSync } from '@/features/sync-audio/model/useSync';
import { useAudio } from '@/features/sync-audio/model/useAudio';
import { TrackInfo } from '@/entities/track/ui/TrackInfo';
import { Track } from '@/entities/track/model/types';
import { Button } from '@/shared/ui/Button';
import { ProgressBar } from '@/shared/ui/ProgressBar';
import { formatTime } from '@/shared/lib/time';

interface MusicPlayerProps {
  track: Track;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ track }) => {
  const { isConnected, globalState, getSynchronizedTime, sendPlay, sendPause, sendSeek } = useSync();
  const {
    audioRef,
    currentTime,
    duration,
    setIsSeeking,
    isAutoplayBlocked,
    handleTimeUpdate,
    handleLoadedMetadata
  } = useAudio({ globalState, getSynchronizedTime });

  const handlePlay = () => {
    if (audioRef.current) sendPlay(audioRef.current.currentTime);
  };

  const handlePause = () => {
    if (audioRef.current) sendPause(audioRef.current.currentTime);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsSeeking(false);
    const time = (parseFloat(e.target.value) / 100) * duration;
    sendSeek(time);
  };

  const handleSeekInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsSeeking(true);
    const time = (parseFloat(e.target.value) / 100) * duration;
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const isCurrentlyPlaying = globalState?.isPlaying || false;

  return (
    <div className="bg-[#1e1e1e] p-8 rounded-2xl shadow-2xl w-full max-w-md text-center">
      <audio
        ref={audioRef}
        src={track.src}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
      />

      <TrackInfo track={track} />

      <div className="mb-6 flex flex-col gap-2">
        <ProgressBar
          value={progressPercent}
          onChange={handleSeek}
          onInput={(e: React.FormEvent<HTMLInputElement>) => handleSeekInput(e as unknown as React.ChangeEvent<HTMLInputElement>)}
        />
        <div className="flex justify-between text-xs text-gray-400 font-medium">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="flex justify-center gap-4 mb-4">
        {isCurrentlyPlaying ? (
          <Button onClick={handlePause} variant="secondary">
            ⏸ Pause
          </Button>
        ) : (
          <Button onClick={handlePlay} variant="primary">
            ▶ Play All
          </Button>
        )}
      </div>

      <div className="text-sm mt-4">
        <span className={isConnected ? "text-[#1db954]" : "text-red-500"}>
          {isConnected ? "● Connected (Live Sync)" : "○ Connecting..."}
        </span>
      </div>

      {isAutoplayBlocked && (
        <div className="mt-4 p-3 bg-red-900/50 text-red-200 text-xs rounded-lg animate-pulse">
          Click anywhere to enable synchronized audio playback
        </div>
      )}
    </div>
  );
};