import React, { createContext, useContext, useState, useCallback } from "react";

const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
  const [playlist, setPlaylist] = useState([]);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);

  const playTrack = useCallback((list, idx) => {
    setPlaylist(list || []);
    setIndex(typeof idx === "number" ? idx : 0);
    setPlaying(true);
  }, []);

  const value = {
    playlist,
    index,
    playing,
    setPlaylist,
    setIndex,
    setPlaying,
    playTrack,
  };

  return (
    <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
  );
}

export function usePlayer() {
  return useContext(PlayerContext);
}
