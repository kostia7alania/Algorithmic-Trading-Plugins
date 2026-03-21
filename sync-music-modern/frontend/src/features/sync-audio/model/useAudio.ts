import { useEffect, useRef, useState, useCallback } from 'react';
import { PlaybackState } from './types';

interface UseAudioOptions {
  globalState: PlaybackState | null;
  getSynchronizedTime: () => number;
}

export const useAudio = ({ globalState, getSynchronizedTime }: UseAudioOptions) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [isPausedByUser, setIsPausedByUser] = useState(true);
  const [isAutoplayBlocked, setIsAutoplayBlocked] = useState(false);

  // Обновление состояния плеера на основе глобального состояния от сервера
  const applyState = useCallback(() => {
    if (!audioRef.current || !globalState || !audioRef.current.duration) return;

    const audio = audioRef.current;
    const now = getSynchronizedTime();
    let targetAudioTime = globalState.currentTime;

    if (globalState.isPlaying) {
      const timeSinceUpdate = (now - globalState.lastUpdateTimestamp) / 1000;
      targetAudioTime += timeSinceUpdate;
    }

    if (!isSeeking) {
      setCurrentTime(targetAudioTime);
    }

    const timeDiff = Math.abs(audio.currentTime - targetAudioTime);

    if (globalState.isPlaying) {
      if (audio.paused) {
        audio.currentTime = targetAudioTime;
        setIsPausedByUser(false);
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            console.warn("Autoplay blocked");
            setIsAutoplayBlocked(true);
          });
        }
      } else if (timeDiff > 0.5) {
        audio.currentTime = targetAudioTime;
      }
    } else {
      if (!audio.paused) {
        audio.pause();
        setIsPausedByUser(true);
      }
      if (timeDiff > 0.5) {
        audio.currentTime = targetAudioTime;
      }
    }
  }, [globalState, getSynchronizedTime, isSeeking]);

  // Следим за изменениями глобального стейта
  useEffect(() => {
    applyState();
  }, [globalState, applyState]);

  // Периодическая проверка синхронизации
  useEffect(() => {
    const checkSyncInterval = setInterval(() => {
      if (globalState?.isPlaying && !isSeeking && audioRef.current && !audioRef.current.paused) {
        const now = getSynchronizedTime();
        const expectedTime = globalState.currentTime + (now - globalState.lastUpdateTimestamp) / 1000;
        const diff = Math.abs(audioRef.current.currentTime - expectedTime);

        // Жесткая синхронизация, если разошлись больше чем на 1 секунду
        if (diff > 1.0) {
           console.log(`Hard sync: Diff was ${diff}s`);
           audioRef.current.currentTime = expectedTime;
        }
      }
    }, 2000);
    return () => clearInterval(checkSyncInterval);
  }, [globalState, isSeeking, getSynchronizedTime]);

  const handleTimeUpdate = () => {
    if (!isSeeking && audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      applyState();
    }
  };

  const attemptUnblock = useCallback(() => {
    if (isAutoplayBlocked && globalState?.isPlaying && audioRef.current) {
      audioRef.current.play().then(() => {
        setIsAutoplayBlocked(false);
        setIsPausedByUser(false);
      }).catch(() => {});
    }
  }, [isAutoplayBlocked, globalState]);

  // Глобальный слушатель для разблокировки аудио (первое взаимодействие)
  useEffect(() => {
    if (!isAutoplayBlocked) return;
    const unlock = () => attemptUnblock();
    document.addEventListener('click', unlock, { once: true });
    document.addEventListener('touchstart', unlock, { once: true });
    return () => {
      document.removeEventListener('click', unlock);
      document.removeEventListener('touchstart', unlock);
    };
  }, [isAutoplayBlocked, attemptUnblock]);


  return {
    audioRef,
    currentTime,
    duration,
    isSeeking,
    setIsSeeking,
    isPausedByUser,
    isAutoplayBlocked,
    handleTimeUpdate,
    handleLoadedMetadata,
  };
};