import { useState } from "react";
import "../styles/App.css";

function Details(title, overview, original_Language, release_date,popularity ) {
    return(

        <div class="movie-details">
          <h3>{title}</h3>
        </div>
    );
}
export default Details;