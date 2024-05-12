import React, { useState, useEffect } from "react";
import Details from "./Details";


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
                <p className="title">{mov.title}</p>
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
