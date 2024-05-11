const { MovieDb } = require('moviedb-promise')
const express = require("express");
const app = express();
const port = 8888;
const moviedb = new MovieDb('39b66e8f6eab8dade70c8ec1356a75c3');

app.use(express.static(__dirname + "../movie-wormz-ai/public"));

app.get("/movies/:title", async (req, res) => {
    let title = req.params.title;
    let movies = [];
    await moviedb.searchMovie({ query : title }).then((res) => movies.push(res.results));
    if (movies.length > 0)
        res.json(movies);
    else
        res.end("No movie found");
})

app.use(express.json());

app.listen(port, () => {
    console.log("Listening on port 8888");
})