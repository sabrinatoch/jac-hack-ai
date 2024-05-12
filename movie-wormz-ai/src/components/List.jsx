import React, { useState } from "react";

export default function List({ movies, onMovieClick }) {
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
                {console.log(mov)}
                <p className="title">{mov.title}</p>
                <img 
                  src={`https://image.tmdb.org/t/p/w500/${mov.poster_path}`} 
                  width="81" 
                  height="120"  
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                  alt={mov.title}
                />
              </div>
            ))
          // )
        ) : (
          <div className="none">No movies found.</div>
        )}
      </div>
    </div>
  );
} // List
