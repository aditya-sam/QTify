import React, { createContext, useContext, useState, useMemo } from "react";

const AlbumsContext = createContext(null);

export function AlbumsProvider({ children }) {
  const [topAlbums, setTopAlbums] = useState(null); // null = not yet loaded
  const [newAlbums, setNewAlbums] = useState(null);

  const ready = topAlbums !== null && newAlbums !== null;

  const allAlbums = useMemo(() => {
    return [...(topAlbums || []), ...(newAlbums || [])];
  }, [topAlbums, newAlbums]);

  const getAlbumBySlug = (slug) => {
    if (!slug) return null;
    return (
      allAlbums.find((a) => a.slug === slug || String(a.id) === String(slug)) ||
      null
    );
  };

  const value = {
    topAlbums,
    newAlbums,
    setTopAlbums,
    setNewAlbums,
    ready,
    allAlbums,
    getAlbumBySlug,
  };

  return (
    <AlbumsContext.Provider value={value}>{children}</AlbumsContext.Provider>
  );
}

export function useAlbums() {
  return useContext(AlbumsContext);
}
