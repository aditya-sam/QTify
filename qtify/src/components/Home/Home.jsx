import React, { useEffect, useState } from "react";
import { Box, Typography, Tab } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";

import axios from "axios";
import { useSnackbar } from "notistack";
import "swiper/css";
import "swiper/css/navigation";

import Hero from "../Hero/Hero";
import Section from "../Section/Section";
import ActionAreaCard from "../Card/Card";
import Button from "../Button/Button";
import Faq from "../Faq/Faq";
import SongPlayer from "../SongPlayer/SongPlayer";

import styles from "./Home.module.css";

export default function Home() {
  const { enqueueSnackbar } = useSnackbar();
  const [expandedTop, setExpandedTop] = useState(false);
  const [expandedNew, setExpandedNew] = useState(false);
  const [topAlbums, setTopAlbums] = useState([]);
  const [newAlbums, setNewAlbums] = useState([]);
  const [songs, setSongs] = useState([]);
  const [value, setValue] = useState("all");
  const [genres, setGenres] = useState([]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    (async () => {
      const results = await Promise.allSettled([
        axios.get("https://qtify-backend.labs.crio.do/albums/top"),
        axios.get("https://qtify-backend.labs.crio.do/albums/new"),
        axios.get("https://qtify-backend.labs.crio.do/songs"),
        axios.get("https://qtify-backend.labs.crio.do/genres"),
      ]);

      const [topRes, newRes, songsRes, genresRes] = results;

      if (topRes.status === "fulfilled") {
        setTopAlbums(topRes.value.data);
      } else {
        enqueueSnackbar("Failed to fetch top albums", { variant: "error" });
      }

      if (newRes.status === "fulfilled") {
        setNewAlbums(newRes.value.data);
      } else {
        enqueueSnackbar("Failed to fetch new albums", { variant: "error" });
      }

      if (songsRes.status === "fulfilled") {
        setSongs(songsRes.value.data);
      } else {
        enqueueSnackbar("Failed to fetch songs", { variant: "error" });
      }

      if (genresRes.status === "fulfilled") {
        setGenres(genresRes.value.data.data);
      } else {
        enqueueSnackbar("Failed to fetch genres", { variant: "error" });
      }
    })();
  }, [enqueueSnackbar]);

  // Render function for albums as cards
  const renderAlbumCard = (album) => <ActionAreaCard album={album} />;

  // Render function for songs as cards
  const renderSongCard = (song) => <ActionAreaCard album={song} />;

  return (
    <div className={styles.home}>
      <Hero />

      {/* Top Albums */}
      <Box padding="24px 32px">
        <Box display="flex" justifyContent="space-between">
          <Typography
            style={{
              textAlign: "left",
              color: "white",
              fontFamily: "Poppins",
              fontWeight: "600",
              fontSize: "20px",
            }}
            variant="h5"
            gutterBottom
          >
            Top Albums
          </Typography>
          <Button
            className={styles.toggleBtn}
            onClick={() => setExpandedTop(!expandedTop)}
          >
            {expandedTop ? "Collapse" : "Show All"}
          </Button>
        </Box>

        <Section
          items={topAlbums}
          renderItem={renderAlbumCard}
          expanded={expandedTop}
        />
      </Box>

      {/* New Albums */}
      <Box padding="24px 32px">
        <Box display="flex" justifyContent="space-between">
          <Typography
            style={{
              textAlign: "left",
              color: "white",
              fontFamily: "Poppins",
              fontWeight: "600",
              fontSize: "20px",
            }}
            variant="h5"
            gutterBottom
          >
            New Albums
          </Typography>
          <Button
            className={styles.toggleBtn}
            onClick={() => setExpandedNew(!expandedNew)}
          >
            {expandedNew ? "Collapse" : "Show All"}
          </Button>
        </Box>

        <Section
          items={newAlbums}
          renderItem={renderAlbumCard}
          expanded={expandedNew}
        />
      </Box>

      {/* Songs */}
      <Box
        padding="24px 32px"
        sx={{
          borderTop: "1px solid #34C94B",
          borderBottom: "1px solid #34C94B",
        }}
      >
        <Box display="flex" justifyContent="space-between">
          <Typography
            style={{
              textAlign: "left",
              color: "white",
              fontFamily: "Poppins",
              fontWeight: "600",
              fontSize: "20px",
            }}
            variant="h5"
            gutterBottom
          >
            Songs
          </Typography>
        </Box>

        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList
              onChange={handleChange}
              aria-label="genre tabs"
              sx={{
                "& .MuiTab-root": {
                  color: "white",
                },
                "& .MuiTab-root.Mui-selected": {
                  color: "white",
                },
                "& .MuiTabs-indicator": {
                  backgroundColor: "#34C94B",
                  height: "4px",
                  borderRadius: "2px",
                },
              }}
            >
              <Tab
                label="All"
                value="all"
                sx={{
                  fontFamily: "Poppins",
                  fontWeight: 600,
                  fontSize: 16,
                }}
              />
              {genres.map((genre) => (
                <Tab
                  key={genre.key}
                  label={genre.label}
                  value={genre.key}
                  sx={{
                    fontFamily: "Poppins",
                    fontWeight: 600,
                    fontSize: 16,
                  }}
                />
              ))}
            </TabList>
          </Box>
          {/* All songs */}
          <TabPanel value="all">
            <Section
              items={songs}
              renderItem={renderSongCard}
              expanded={expandedNew}
            />
          </TabPanel>
          {/* Songs by genre */}
          {genres.map((genre) => (
            <TabPanel key={genre.key} value={genre.key}>
              <Section
                items={songs.filter((song) => song.genre.key === genre.key)}
                renderItem={renderSongCard}
                expanded={expandedNew}
              />
            </TabPanel>
          ))}
        </TabContext>

        {/* FAQs */}
        <Box mt={4}>
          <Typography sx={{ fontWeight: 600, color: "white", mb: 2 }}>
            FAQs
          </Typography>
          <Faq />
        </Box>

        {/* Song player */}
        <Box mt={4}>
          <SongPlayer playlist={songs} />
        </Box>
      </Box>
    </div>
  );
}
