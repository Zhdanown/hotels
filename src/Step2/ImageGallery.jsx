import React, { useState } from "react";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";

function ImageGallery({ images, open, toggle }) {
  const [index, setIndex] = useState(0);

  if (!images.length) return null;

  return open ? (
    <Lightbox
      mainSrc={images[index]}
      nextSrc={images[(index + 1) % images.length]}
      prevSrc={images[(index + images.length - 1) % images.length]}
      onCloseRequest={() => toggle(false)}
      onMoveNextRequest={() => setIndex(i => (i + 1) % images.length)}
      onMovePrevRequest={() =>
        setIndex(i => (i + images.length - 1) % images.length)
      }
    />
  ) : null;
}

export default ImageGallery;
