import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./components/Home/Home";
import Album from "./components/Album/Album";
import SongPlayer from "./components/SongPlayer/SongPlayer";
import { PlayerProvider } from "./contexts/PlayerContext";
import { AlbumsProvider } from "./contexts/AlbumsContext";

function App() {
  return (
    <PlayerProvider>
      <AlbumsProvider>
        <Router>
          <div className="App">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/album/:slug" element={<Album />} />
            </Routes>
            <SongPlayer />
          </div>
        </Router>
      </AlbumsProvider>
    </PlayerProvider>
  );
}

export default App;
