import React, { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../Button/Button";
import Logo from "../Logo/Logo";
import Search from "../Search/Search";
import FeedbackModal from "../FeedbackModal/FeedbackModal";
import styles from "./Navbar.module.css";

function Navbar({ searchData }) {
  const [openFeedback, setOpenFeedback] = useState(false);

  return (
    <>
      <nav className={styles.navbar}>
        <Link to="/">
          <Logo />
        </Link>
        <Search
          placeholder="Search a song of your choice"
          searchData={searchData}
        />
        <Button
          className={styles.feedbackBtn}
          onClick={() => setOpenFeedback(true)}
        >
          Give Feedback
        </Button>
      </nav>

      <FeedbackModal
        open={openFeedback}
        onClose={() => setOpenFeedback(false)}
      />
    </>
  );
}

export default Navbar;
