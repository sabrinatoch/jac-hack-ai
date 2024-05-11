import React from "react";

export default function List({ movies, onMovieClick }) {
  return (
    <div id="container">
      <div className="App-list">
        
        {movies.length > 0 ? (
          movies.map((movie) => (
            movie.map((mov)=>(
              <div
              className="mov"
              key={mov.id}
              onClick={() => onMovieClick(mov.id)}
            >
              {console.log(m)}
              <p className="title">{m.title}</p>
            </div>
            ))
            
          ))
        ) : (
          <div className="none">No movies found.</div>
        )}
      </div>
    </div>
  );
} // List
