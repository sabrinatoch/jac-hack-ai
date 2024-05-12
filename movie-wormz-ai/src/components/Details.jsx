import { useState } from "react";
import "../styles/App.css";

function Details({ movie, hidden, onClose }) {

  return (
    <div className={hidden ? "hidden" : "popup"}>
      <a href="#" className="close" onClick={onClose}></a>
      <h3>{movie.title}</h3>
      <p>{movie.release_date}</p>
      <p>{movie.overview}</p>
      <p>Where you can watch it:</p>
    </div>
  );
}
export default Details;
