import React, { useEffect, useRef, useState } from "react";
import { Box, IconButton, Typography, Slider } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";

import styles from "./SongPlayer.module.css";
import { usePlayer } from "../../contexts/PlayerContext";

// Fallback audio when song has no url
const FALLBACK_AUDIO =
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

function formatTime(ms) {
  if (!ms) return "0:00";
  const total = Math.floor(ms / 1000);
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export default function SongPlayer() {
  const { playlist, index, playing, setIndex, setPlaying } = usePlayer();
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    if (!audioRef.current) audioRef.current = new Audio();
    const audio = audioRef.current;

    const onLoaded = () => {
      setDuration(Math.floor(audio.duration * 1000));
    };
    const onTime = () => {
      setCurrentTime(Math.floor(audio.currentTime * 1000));
    };
    const onEnded = () => {
      // advance to next track when current ends
      setIndex((i) => (i < playlist.length - 1 ? i + 1 : 0));
      setPlaying(true);
    };

    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("ended", onEnded);
    };
  }, [playlist.length, setIndex, setPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    const song = playlist[index];
    if (song) {
      audio.src = song.audioUrl || song.url || song.streamUrl || FALLBACK_AUDIO;
      audio.load();
      if (playing) audio.play().catch(() => setPlaying(false));
    } else {
      // if nothing to play, pause
      audio.pause();
    }
  }, [index, playlist, playing, setPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) audio.play().catch(() => setPlaying(false));
    else audio.pause();
  }, [playing, setPlaying]);

  const handlePlayPause = () => setPlaying((p) => !p);

  const handlePrev = () => {
    setIndex((i) => (i > 0 ? i - 1 : playlist.length - 1));
    setPlaying(true);
  };

  const handleNext = () => {
    setIndex((i) => (i < playlist.length - 1 ? i + 1 : 0));
    setPlaying(true);
  };

  const handleSeek = (ev, value) => {
    const audio = audioRef.current;
    if (!audio) return;
    const seconds = value / 1000;
    audio.currentTime = seconds;
    setCurrentTime(value);
  };

  const song = playlist[index] || {};

  return (
    <Box className={styles.player}>
      <Box display="flex" alignItems="center" width="100%" padding="8px 16px">
        <Box sx={{ width: 100, height: 100, mr: 4 }}>
          <img
            src={song.image}
            alt={song.title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: 8,
            }}
          />
        </Box>
        <Box sx={{ pt: 2, pb: 2, flexGrow: 1 }}>
          <Typography
            sx={{
              fontWeight: 600,
            }}
          >
            {song.title || "No song selected"}
          </Typography>
          <Typography
            sx={{
              color: "#fff",
              fontSize: 12,
            }}
          >
            {(song.artists || []).join(", ")}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              onClick={handlePrev}
              sx={{ color: "white" }}
              aria-label="previous"
            >
              <SkipPreviousIcon />
            </IconButton>
            <IconButton
              onClick={handlePlayPause}
              sx={{ color: "white" }}
              aria-label="play-pause"
            >
              {playing ? <PauseIcon /> : <PlayArrowIcon />}
            </IconButton>
            <IconButton
              onClick={handleNext}
              sx={{ color: "white" }}
              aria-label="next"
            >
              <SkipNextIcon />
            </IconButton>
            <Typography sx={{ ml: 2, color: "#ccc", fontSize: 12 }}>
              {formatTime(currentTime)} / {formatTime(duration)}
            </Typography>
          </Box>
          <Box sx={{ width: "100%" }}>
            <Slider
              value={currentTime}
              min={0}
              max={duration || 100}
              onChange={handleSeek}
              sx={{ color: "#34C94B" }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
