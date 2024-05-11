import React, { useState, useEffect } from "react";

export default function Movie({ mov, onClose, hidden }) {
  return (
    <div className={hidden ? "hidden" : "popup"}>
      <a href="#" className="close" onClick={onClose}></a>
      <p className="title">{mov.title}</p>
    </div>
  );
} // Movie
