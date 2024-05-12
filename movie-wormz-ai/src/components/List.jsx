import React from "react";

export default function List({ movies, onMovieClick }) {
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
              {mov.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w500/${mov.poster_path}`}
                  width="175"
                />
              ) : (
                <p className="title">{mov.title}</p>
              )}
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
