import React from "react";

export default function List({ movies, onMovieClick }) {
  return (
    <div id="container">
      <div className="App-list">
        {movies.length > 0 ? (
          movies.map((movie) =>
            movie.map((mov) => (
              <div
                className="mov"
                key={mov.id}
                onClick={() => onMovieClick(mov.id)}
              >
                <p className="title">{mov.title}</p>
                <img src={m.poster_path}/>
              </div>
            ))
          )
        ) : (
          <div className="none">No movies found.</div>
        )}
      </div>
    </div>
  );
} // List
