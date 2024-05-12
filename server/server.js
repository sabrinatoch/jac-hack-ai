import { MovieDb } from 'moviedb-promise';
const moviedb = new MovieDb('39b66e8f6eab8dade70c8ec1356a75c3');

import express from "express";
const app = express();
const port = 8888;

// import {config as dotenvConfig} from 'dotenv';
import OpenAI from "openai";
// dotenvConfig();
// const openaiApiKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({apiKey: 'sk-proj-eKcPtkULFLk6uU4w9YzkT3BlbkFJqFDiexYq0SxaanH5B59J'});

import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(__dirname + "../movie-wormz-ai/public"));

app.get("/movies/:title", async (req, res) => {
    let title = req.params.title;
    let movies = [];

    const completion = await openai.chat.completions.create({
        messages: [{role: "system", content: "Please give me a tilda-separated list of movies like " + title + " without responding with any other text so that I can parse through the results."}],
        model: "gpt-3.5-turbo"
    });

     let tildaSeparatedMovies = completion.choices[0].message.content;
     let moviesArray = tildaSeparatedMovies.split('~');

     await Promise.all(moviesArray.map(async (mov) => {
        try {
            const movieSearchResult = await moviedb.searchMovie({ query: mov });
            if (movieSearchResult.results.length > 0) {
                movies.push(movieSearchResult.results[0]); // Push the first result to the movies array
            }
        } catch (error) {
            console.error("Error fetching movie:", error);
        }
    }));
    // console.log(movies);
    res.json(movies);
}) // movies title

app.get("/prompt/:plot", async (req, res) => {
    let plot = req.params.plot;
    let movies = [];

    const completion = await openai.chat.completions.create({
        messages: [{role: "system", content: "Please give me a tilda-separated list of movies that have the following plot/concept/trope without responding with any other text so that I can parse through the results: '" + plot + "'."}],
        model: "gpt-3.5-turbo"
    });

     let tildaSeparatedMovies = completion.choices[0].message.content;
     let moviesArray = tildaSeparatedMovies.split('~');

     await Promise.all(moviesArray.map(async (mov) => {
        try {
            const movieSearchResult = await moviedb.searchMovie({ query: mov });
            if (movieSearchResult.results.length > 0) {
                movies.push(movieSearchResult.results[0]); // Push the first result to the movies array
            }
        } catch (error) {
            console.error("Error fetching movie:", error);
        }
    }));
    res.json(movies);
}) // prompt plot

app.use(express.json());

app.listen(port, () => {
    console.log("Listening on port 8888");
})