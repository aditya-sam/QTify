import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, IconButton, Button } from "@mui/material";
import { useAlbums } from "../../contexts/AlbumsContext";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { usePlayer } from "../../contexts/PlayerContext";
import styles from "./Album.module.css";

const PAGE_SIZE = 13;

export default function Album() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { playTrack } = usePlayer();

  const [album, setAlbum] = useState(null);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);

  const { ready, getAlbumBySlug } = useAlbums();

  useEffect(() => {
    setLoading(true);
    // when albums are ready (fetched by Home), find the album locally
    if (ready) {
      const found = getAlbumBySlug(slug);
      setAlbum(found || null);
      setPage(0);
      setLoading(false);
    } else {
      // not ready yet — keep loading
      setAlbum(null);
    }
  }, [slug, ready, getAlbumBySlug]);

  if (loading) return <div style={{ color: "white" }}>Loading...</div>;
  if (!album) return <div style={{ color: "white" }}>Album not found</div>;

  const songs = album.songs || [];
  const pageCount = Math.max(1, Math.ceil(songs.length / PAGE_SIZE));
  const start = page * PAGE_SIZE;
  const paged = songs.slice(start, start + PAGE_SIZE);

  function formatDuration(ms) {
    if (!ms && ms !== 0) return "-";
    const total = Math.floor(ms / 1000);
    const minutes = Math.floor(total / 60);
    const seconds = total % 60;
    return `${minutes}:${String(seconds).padStart(2, "0")}`;
  }

  return (
    <div className={styles.albumPage}>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box display="flex" alignItems="center">
          <IconButton
            onClick={() => navigate("/")}
            sx={{ color: "white", mr: 1 }}
            aria-label="back"
          >
            <ArrowBackIcon />
          </IconButton>
          <Box sx={{ width: 120, height: 120, mr: 2 }}>
            <img
              src={album.image}
              alt={album.title}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </Box>
          <div>
            <Typography variant="h5" sx={{ color: "white", fontWeight: 700 }}>
              {album.title}
            </Typography>
            <Typography sx={{ color: "#aaa" }}>{album.description}</Typography>
          </div>
        </Box>
      </Box>

      <Box mt={4}>
        <Typography sx={{ color: "white", fontWeight: 600, mb: 2 }}>
          Songs
        </Typography>
        <div className={styles.songList}>
          <div className={styles.songHeader}>
            <div></div>
            <div>Title</div>
            <div>Artist</div>
            <div>Duration</div>
          </div>

          {paged.length === 0 ? (
            <div style={{ color: "#ccc", padding: 12 }}>
              No songs in this album.
            </div>
          ) : (
            paged.map((song, idx) => (
              <div
                key={song.id || idx}
                className={styles.songRow}
                onClick={() => playTrack(songs, start + idx)}
              >
                <div className={styles.thumb}>
                  <img src={song.image} alt={song.title} />
                </div>
                <div className={styles.songTitle}>{song.title}</div>
                <div className={styles.songArtist}>
                  {(song.artists || []).join(", ")}
                </div>
                <div className={styles.songDuration}>
                  {formatDuration(song.durationInMs || song.duration)}
                </div>
              </div>
            ))
          )}
        </div>

        <Box
          mt={2}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <div style={{ color: "white" }}>
            Page {page + 1} of {pageCount}
          </div>
          <div>
            <Button
              disabled={page <= 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              sx={{
                mr: 1,
                color: "white",
                fontFamily: "Poppins",
                fontWeight: 600,
              }}
            >
              Previous
            </Button>
            <Button
              sx={{
                mr: 1,
                color: "white",
                fontFamily: "Poppins",
                fontWeight: 600,
              }}
              disabled={page >= pageCount - 1}
              onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
            >
              Next
            </Button>
          </div>
        </Box>
      </Box>
    </div>
  );
}
