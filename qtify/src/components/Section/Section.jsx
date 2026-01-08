import React from "react";
import { Collapse } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import styles from "./Section.module.css";

/**
 * Reusable Carousel Component
 * @param {Array} items - Array of items to render (albums, products, etc.)
 * @param {Function} renderItem - Function that renders each item: (item) => JSX
 * @param {Boolean} expanded - Whether the grid view is expanded
 * @param {Number} slidesPerView - Number of slides to show in carousel (default 7)
 */
export default function Section({
  items = [],
  renderItem,
  expanded = false,
  slidesPerView = 7,
}) {
  return (
    <>
      <Collapse in={expanded} timeout={500}>
        <div className={styles.gridContainer}>
          {items.map((item, idx) => (
            <div className={styles.gridItem} key={item.id || idx}>
              {renderItem(item)}
            </div>
          ))}
        </div>
      </Collapse>

      <Collapse in={!expanded} timeout={500}>
        <Swiper
          modules={[Navigation]}
          spaceBetween={30}
          slidesPerView={slidesPerView}
          breakpoints={{
            0: { slidesPerView: 1 },
            600: { slidesPerView: 3 },
            900: { slidesPerView: 5 },
            1200: { slidesPerView: slidesPerView },
          }}
          navigation
          pagination={{ clickable: true }}
          className={styles.swiperContainer}
        >
          {items.map((item, idx) => (
            <SwiperSlide key={item.id || idx}>{renderItem(item)}</SwiperSlide>
          ))}
        </Swiper>
      </Collapse>
    </>
  );
}
