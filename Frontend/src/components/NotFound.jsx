import React, { useMemo } from "react";
import { Link } from "react-router-dom";

// Import your images
import monalisa from "../assets/images/Monalisa.jpg";
import shon from "../assets/images/Shon.png";
import spongebob from "../assets/images/Spongebob.jpg";
import tea from "../assets/images/Tea.jpg";
import tom from "../assets/images/Tom.jpg";

const images = [monalisa, shon, spongebob, tea, tom];

const NotFound = () => {
  // Randomly select one image on mount
  const randomImage = useMemo(() => {
    const idx = Math.floor(Math.random() * images.length);
    return images[idx];
  }, []);

  return (
    <div className="not-found-container">
      <div className="images-column">
        <img src={randomImage} alt="Random Display" className="side-image" />
      </div>
      <div className="message-container">
        <h1>404</h1>
        <p>Uh-oh! The page you're looking for doesn't exist.</p>
        <Link to="/" className="home-btn">
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
