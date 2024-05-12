import React, { useState, useEffect } from "react";
import Details from "./Details";
import image from '../film-reel.png'

export default function List({ movies, onMovieClick }) {
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [isHidden, setHidden] = useState(true);

  const closePopup = () => {
    setSelectedMovieId(null); // Reset the selected movie ID
    setHidden(true); // Hide the Details component
  };
  
  const toggleDetails = (id) => {
    setSelectedMovieId(id); // Set the selected movie ID
    setHidden(false);
  };

  const [loading, setLoading] = useState(true);
  const [imageSrc, setImageSrc] = useState(null);
  const [gridTransform, setGridTransform] = useState('translateY(0)');

  useEffect(() => {
    // Calculate the translateY value based on the number of movies
    const translateY = Math.min(200, Math.max(-200, -50 * movies.length));
    setGridTransform(`translateY(${translateY}px)`);
  }, [movies]);

  const handleImageLoad = () => {
    setLoading(false);
  };

  const handleImageError = () => {
    setLoading(false);
    setImageSrc("../default_poster.png");
    console.log("Error loading image");
  };

  return (
    <div id="container">
      <div className="App-list" style={{ transform: gridTransform }}>
        {movies.length > 0 ? (
          movies.map((mov) => (
            <div
              className="mov"
              key={mov.id}
            >
              {mov.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w500/${mov.poster_path}`}
                  width="175"
                  onClick={() => toggleDetails(mov.id)}
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                  alt={mov.title}
                />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 300" onClick={() => toggleDetails(mov.id)} >
                <path d="M10 10 L190 10 Q200 10, 200 20 L200 280 Q200 290, 190 290 L10 290 Q0 290, 0 280 L0 20 Q0 10, 10 10" fill="#fbefbe" stroke="#000000" stroke-width="2"/>
                <text x="100" y="40" textAnchor="middle" fontFamily="Arial" fontSize="20" fontWeight="bold" fill="black" textLength="160" lengthAdjust="spacingAndGlyphs">{mov.title}</text>
                <text x="100" y="55" textAnchor="middle" fontFamily="Arial" fontSize="14" fill="#000000">{mov.release_date}</text>
                <g transform="translate(20,70)" text-align="center">
                  <image width="141.75" href={image} align-content="bottom"/>
                </g>
                
              </svg>
              )}
              {selectedMovieId === mov.id && (
                <Details movie={mov} hidden={isHidden} onClose={closePopup} />
              )}
            </div>
          ))
        ) : (
          <div className="none">No movies found.</div>
        )}
      </div>
    </div>
  );
} // List
