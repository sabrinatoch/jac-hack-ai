import { useEffect, useState } from "react";
import "../styles/App.css";

import Search from "./Search";
import SearchVibe from "./SearchVibe";
import List from "./List";

function App() {
  // const [count, setCount] = useState(0)
  const [selectedMovie, setSelectedMovie] = useState({});
  const [movies, setMovies] = useState([]);

  const searchMovies = (title) => {
    if (title.length > 0) {
      async function fetchTitleMovies() {
        setMovies(
          await fetch("/movies/" + title)
            .then((res) => res.json())
            .then((data) => data)
        );
      }
      fetchTitleMovies();
    }
  }; // searchMovies()

  const searchByPlot = (plot) => {
    if (plot.length > 0) {
      async function fetchMoviesByPlot() {
        setMovies(
          await fetch("/prompt/" + plot)
            .then((res) => res.json())
            .then((data) => data)
        );
      }
      fetchMoviesByPlot();
    }
  }; // searchByPlot

  return (
    <div>
{/* <h1>Movie Wormz</h1> */}
      <div className="search-inputs">
      {/* <div class="search-inputs"> */}
      

        <Search search={searchMovies}></Search>
        <SearchVibe search={searchByPlot}></SearchVibe>
      </div>
      <List movies={movies}></List>
      
    </div>
  );
}

export default App;