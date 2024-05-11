import React from "react";

export default function List({ movies, onMovieClick }) {
  return (
    <div id="container">
      <div className="App-list">
        {movies.length > 0 ? (
          movies.map((mov) => (
            <div
              className="mov"
              key={mov.Key}
              onClick={() => onMovieClick(mov.Key)}
            >
              <p className="title">{mov.Title}</p>
              <p>Year: {mov.Year}</p>
            </div>
          ))
        ) : (
          <div className="none">No movies found.</div>
        )}
      </div>
    </div>
  );
} // List
