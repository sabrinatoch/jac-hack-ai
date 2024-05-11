const { MovieDb } = require('moviedb-promise')
const express = require("express");
const app = express();
const port = 8888;
const moviedb = new MovieDb('39b66e8f6eab8dade70c8ec1356a75c3');

moviedb.searchMovie({ query: 'Alien Island' })
.then((res) => {
  console.log(res)
})
.catch(console.error);

app.use(express.static(__dirname + "../movie-wormz-ai/public"));

app.get("/movies/:title", async (req, res) => {
    let title = req.params.title;
    let movies = [];
    console.log(title);
    await moviedb.searchMovie({ query: title}).then((res) => movies.push(res));
    console.log(movies);
    res.json(movies);
})

app.listen(port, () => {
    console.log("Listening on port 8888");
})