import React from "react";
import Details from "./Details";

export default function List({ movies, onMovieClick }) {
  const [selectedMovieId, setSelectedMovieId] = React.useState(null);

  const toggleDetails = (id) => {
    if(selectedMovieId === id) {
      setSelectedMovieId(null);}
      else{
        setSelectedMovieId(id);
      }
    };
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
                {console.log(mov)}
                <p className="title" onClick={() => toggleDetails(mov.id)}>{mov.title}</p>
                <img src={`https://image.tmdb.org/t/p/w500/${mov.poster_path}? `} width="81" height="120" />
                {selectedMovieId === mov.id && <Details mov={mov} />}
                {/* <div className="details">
                  
                </div> */}
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
