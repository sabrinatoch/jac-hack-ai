import { useEffect, useState } from 'react'
import '../styles/App.css'

import { HfInference } from "@huggingface/inference";
import { HfAgent } from "@huggingface/agents";
import { createRepo, commit, deleteRepo, listFiles } from "@huggingface/hub";
import Search from './Search'
import List from './List';

function App() {
  // const [count, setCount] = useState(0)
  const [selectedMovie, setSelectedMovie] = useState({});
  const [movies, setMovies] = useState([]);
  const [isHidden, setHidden] = useState(true);

  const searchMovies = (title) => {
    console.log(title);
    if (title.length > 0) {
      async function fetchTitleMovies() {
        setMovies(
          await fetch("/movies/" + title)
          .then((res) => res.json())
          .then((data) => data)
        );
      }
      fetchTitleMovies().then(() => {
        console.log(movies);
      });
    }
  } // searchMovies()

  const movieDetails = (id) => {
    async function fetchMov() {
      setSelectedMovie(
        await fetch("/movie/" + id)
        .then((res) => res.json())
        .then((data) => data)
      );
      fetchMov();
      setHidden(false);
    }
  } // movieDetails()

  const closePopup = () => {
    setHidden(true);
  } // closePopup()

  return <div>
    <Search search={searchMovies}></Search>
    <List movies={movies} onMovieClick={movieDetails}></List>
    </div>
}

export default App
