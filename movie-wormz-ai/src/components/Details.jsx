import { useState } from "react";
import "../styles/App.css";

function Details(title, overview, original_Language, release_date,popularity ) {
    return(

        <div class="movie-details">
          <h3>{title}</h3>
            <p>{overview}</p>
            <p>{release_date}</p>
            {original_Language === "en"? <p>Original Language: English</p>: <p>Original Language: unknown</p>}
        </div>
    );
}
export default Details;