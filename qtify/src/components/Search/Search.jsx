import React from "react";
import styles from "./Search.module.css";
import { ReactComponent as SearchIcon } from "../../assets/search-icon.svg";
import useAutocomplete from "@mui/material/useAutocomplete";
import { styled } from "@mui/system";
import { truncate } from "../../helpers/helpers";
import { useNavigate } from "react-router-dom";
import { useAlbums } from "../../contexts/AlbumsContext";
import { usePlayer } from "../../contexts/PlayerContext";

const Listbox = styled("ul")(({ theme }) => ({
  width: "calc(100% - 2px)",
  margin: 0,
  padding: 0,
  position: "absolute",
  borderRadius: "0px 0px 10px 10px",
  border: "1px solid var(--color-primary)",
  top: 45,
  height: "max-content",
  maxHeight: "500px",
  zIndex: 10,
  overflowY: "scroll",
  left: 0,
  bottom: 0,
  right: 0,
  listStyle: "none",
  backgroundColor: "var(--color-black)",
  overflow: "auto",
  /* hide scrollbar by default */
  scrollbarWidth: "none", // firefox
  msOverflowStyle: "none", // ie 10+
  "&::-webkit-scrollbar": {
    width: 0,
    height: 0,
  },
  /* show thin, subtle scrollbar on hover */
  "&:hover": {
    scrollbarWidth: "thin",
    scrollbarColor: "rgba(255,255,255,0.12) transparent",
  },
  "&:hover::-webkit-scrollbar": {
    width: "8px",
  },
  "&:hover::-webkit-scrollbar-thumb": {
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 4,
  },
  "& li.Mui-focused": {
    backgroundColor: "var(--color-primary)",
    color: "white",
    cursor: "pointer",
  },
  "& li:active": {
    backgroundColor: "var(--color-primary)",
    color: "white",
  },
}));

function Search({ searchData, placeholder }) {
  const navigate = useNavigate();
  const { allAlbums } = useAlbums();
  const { playTrack } = usePlayer();

  // Build search options (albums and songs) from albums context if searchData not passed
  const albumOptions = (
    searchData && Array.isArray(searchData) ? searchData : allAlbums || []
  ).map((a) => ({ ...a, __type: "album" }));
  const songOptions = (allAlbums || []).flatMap((album) =>
    (album.songs || []).map((song, idx) => ({
      ...song,
      __type: "song",
      albumSlug: album.slug,
      albumTitle: album.title,
      album,
      songIndex: idx,
    }))
  );

  const options = [...albumOptions, ...songOptions];

  const {
    getRootProps,
    value,
    inputValue,
    getInputProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
  } = useAutocomplete({
    id: "use-autocomplete-demo",
    options,
    getOptionLabel: (option) => option.title || "",
    openOnFocus: true,
    onChange: (event, newValue) => {
      if (!newValue) return;
      if (newValue.__type === "album") {
        navigate(`/album/${newValue.slug}`);
      } else if (newValue.__type === "song") {
        // navigate to album and play the selected track
        if (newValue.albumSlug) navigate(`/album/${newValue.albumSlug}`);
        if (newValue.album && typeof newValue.songIndex === "number") {
          playTrack(newValue.album.songs || [], newValue.songIndex);
        }
      }
    },
  });
  const onSubmit = (e, value) => {
    e.preventDefault();
    if (!value) return;
    navigate(`/album/${value.slug}`);
  };

  return (
    <div style={{ position: "relative" }}>
      <form
        className={styles.wrapper}
        onSubmit={(e) => {
          onSubmit(e, value);
        }}
      >
        <div {...getRootProps()}>
          <input
            name="album"
            className={styles.search}
            placeholder={placeholder}
            required
            {...getInputProps()}
          />
        </div>
        <div>
          <button className={styles.searchButton} type="submit">
            <SearchIcon />
          </button>
        </div>
      </form>
      {groupedOptions.length > 0 || (inputValue && inputValue.length > 0) ? (
        <Listbox {...getListboxProps()}>
          {groupedOptions.length > 0 ? (
            groupedOptions.map((option, index) => {
              if (option.__type === "album") {
                const artists = (option.songs || []).reduce(
                  (accumulator, currentValue) => {
                    accumulator.push(...(currentValue.artists || []));
                    return accumulator;
                  },
                  []
                );
                return (
                  <li
                    className={styles.listElement}
                    {...getOptionProps({ option, index })}
                  >
                    <div className={styles.thumb}>
                      <img src={option.image} alt={option.title} />
                    </div>
                    <div className={styles.albumMeta}>
                      <p className={styles.albumTitle}>{option.title}</p>
                      <p className={styles.albumArtists}>
                        {truncate(artists.join(", "), 70)}
                      </p>
                    </div>
                  </li>
                );
              }

              // song option
              return (
                <li
                  className={styles.listElement}
                  {...getOptionProps({ option, index })}
                >
                  <div className={styles.thumb}>
                    <img src={option.image} alt={option.title} />
                  </div>
                  <div className={styles.albumMeta}>
                    <p className={styles.albumTitle}>{option.title}</p>
                    <p className={styles.albumArtists}>
                      From: {option.albumTitle}
                    </p>
                  </div>
                </li>
              );
            })
          ) : (
            <li className={styles.listElement}>
              <div>
                <p className={styles.albumTitle}>No results</p>
                <p className={styles.albumArtists}>Try a different query</p>
              </div>
            </li>
          )}
        </Listbox>
      ) : null}
    </div>
  );
}

export default Search;
