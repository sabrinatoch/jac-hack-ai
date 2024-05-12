import React, { useState } from "react";
import Details from "./Details";

export default function List({ movies, onMovieClick }) {
  const [selectedMovieId, setSelectedMovieId] = React.useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const toggleDetails = (id) => {
    if(selectedMovieId === id) {
      setSelectedMovieId(null);}
      else{
        setSelectedMovieId(id);
        setIsVisible(true);
      }
    };
  const [loading, setLoading] = useState(true);
  const [imageSrc, setImageSrc] = useState(null);

  const handleImageLoad = () => {
    setLoading(false);
  };

  const handleImageError = () => {
    setLoading(false);
    setImageSrc('../default_poster.png');
    console.log('Error loading image');
  };

  return (
    <div id="container">
      <div className="App-list">
        {movies.length > 0 ? (
          // movies.map((movie) =>
          movies.map((mov) => (
            <div
              className="mov"
              key={mov.id}
              onClick={() => onMovieClick(mov.id)}
            >
              {/* {console.log(isVisible)} */}
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
              {selectedMovieId === mov.id && <Details mov={mov} />}
            </div>
          ))
        ) : (
          // )
          <div className="none">No movies found.</div>
        )}
      </div>
    </div>
  );
} // List
