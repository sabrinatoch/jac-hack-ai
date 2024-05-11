import React from "react";

export default function List({ movies, onMovieClick }) {
  return (
    <div id="container">
      <div className="App-list">
        
        {movies.length > 0 ? (
          movies.map((mov) => (
            mov.map((m)=>(
              <div
              className="mov"
              
              key={m.Key}
              onClick={() => onMovieClick(m.Key)}
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
