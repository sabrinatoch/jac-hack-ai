import { useEffect, useState } from "react";
import "../styles/App.css";

import Search from "./Search";
import SearchVibe from "./SearchVibe";
import List from "./List";

function App() {
  // const [count, setCount] = useState(0)
  const [selectedMovie, setSelectedMovie] = useState({});
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const searchMovies = (title) => {
    if (title.length > 0) {
      setSearchTerm(title);
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
      setSearchTerm(plot);
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
      <div className="search-inputs">
        <h1>Movie Wormz 🐛</h1>
        <Search search={searchMovies}></Search>
        <SearchVibe search={searchByPlot}></SearchVibe>
      </div>
      <List movies={movies} searchTerm={searchTerm}></List>
    </div>
  );
}

export default App;
