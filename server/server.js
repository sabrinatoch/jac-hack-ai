import { MovieDb } from "moviedb-promise";
const moviedb = new MovieDb("39b66e8f6eab8dade70c8ec1356a75c3");

import express from "express";
const app = express();
const port = 8888;

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: "replace with key provided",
});

import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(__dirname + "../movie-wormz-ai/public"));

app.get("/movies/:title", async (req, res) => {
  let title = req.params.title;
  let movies = [];

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "Please give me a tilda-separated list of movies like " +
          title +
          " without responding with any other text so that I can parse through the results.",
      },
    ],
    model: "gpt-3.5-turbo",
  });

  let tildaSeparatedMovies = completion.choices[0].message.content;
  let moviesArray = tildaSeparatedMovies.split("~");

  //making sure all movies only added/displayed once
  function onlyUnique(value, index, array) {
    return array.indexOf(value) === index;
  }
   moviesArray = moviesArray.filter(onlyUnique);

  await Promise.all(
    moviesArray.map(async (mov) => {
      try {
        const movieSearchResult = await moviedb.searchMovie({ query: mov });
        if (movieSearchResult.results.length > 0) {
          movies.push(movieSearchResult.results[0]); // Push the first result to the movies array
        }
      } catch (error) {
        console.error("Error fetching movie:", error);
      }
    })
  );
  // console.log(movies);
  res.json(movies);
}); // movies title

app.get("/movieStreams/:title", async (req, res) => {
  let title = req.params.title;

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "Please give me a tilda-separated list of the streaming services in Canada that are currently streaming " +
          title +
          " without responding with any other text so that I can parse through the results.",
      },
    ],
    model: "gpt-3.5-turbo",
  });

  let tildaSeparatedStreams = completion.choices[0].message.content;
  res.send(tildaSeparatedStreams);
});

app.get("/movieTomatoes/:title", async (req, res) => {
    let title = req.params.title;
  
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "Please give me the rotten tomatoes score as a single number for " +
            title +
            " without responding with any other text so that I can parse through the result.",
        },
      ],
      model: "gpt-3.5-turbo",
    });
  
    let result = completion.choices[0].message.content;
    res.send(result);
  });

app.get("/prompt/:plot", async (req, res) => {
  let plot = req.params.plot;
  let movies = [];

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "Please give me a tilda-separated list of movies that have the following plot/concept/trope without responding with any other text so that I can parse through the results: '" +
          plot +
          "'.",
      },
    ],
    model: "gpt-3.5-turbo",
  });

  let tildaSeparatedMovies = completion.choices[0].message.content;
  let moviesArray = tildaSeparatedMovies.split("~");

  await Promise.all(
    moviesArray.map(async (mov) => {
      try {
        const movieSearchResult = await moviedb.searchMovie({ query: mov });
        if (movieSearchResult.results.length > 0) {
          movies.push(movieSearchResult.results[0]); // Push the first result to the movies array
        }
      } catch (error) {
        console.error("Error fetching movie:", error);
      }
    })
  );
  res.json(movies);
}); // prompt plot

app.use(express.json());

app.listen(port, () => {
  console.log("Listening on port 8888");
});
