import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";

import axios from "axios";
import { useSnackbar } from "notistack";
import "swiper/css";
import "swiper/css/navigation";

import Hero from "../Hero/Hero";
import Section from "../Section/Section";
import ActionAreaCard from "../Card/Card";
import Button from "../Button/Button";

import styles from "./Home.module.css";

export default function Home() {
  const [topAlbums, setTopAlbums] = useState([]);
  const [newAlbums, setNewAlbums] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  const [expandedTop, setExpandedTop] = useState(false);
  const [expandedNew, setExpandedNew] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [topRes, newRes] = await Promise.all([
          axios.get("https://qtify-backend.labs.crio.do/albums/top"),
          axios.get("https://qtify-backend.labs.crio.do/albums/new"),
        ]);
        setTopAlbums(topRes.data);
        setNewAlbums(newRes.data);
      } catch (e) {
        enqueueSnackbar(e?.response?.message || "Failed to fetch albums", {
          variant: "error",
        });
      }
    })();
  }, [enqueueSnackbar]);

  // Render function for albums as cards
  const renderAlbumCard = (album) => <ActionAreaCard album={album} />;

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
    </div>
  );
}
