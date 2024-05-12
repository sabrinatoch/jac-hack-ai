import { useState, useEffect } from "react";
import "../styles/App.css";

function Details({ movie, hidden, onClose }) {

  const [streamingServices, setStreamingServices] = useState([]);
  const [rottenScore, setRottenScore] = useState(0);

  useEffect(() => {
    const fetchStreamingServices = async () => {
      try {
        const response = await fetch(`/movieStreams/${encodeURIComponent(movie.title)}`);
        if (response.ok) {
          const data = await response.text();
          const servicesArray = data.split("~"); // Assuming your response is tilda-separated
          setStreamingServices(servicesArray);
        } else {
          console.error("Failed to fetch streaming services");
        }
      } catch (error) {
        console.error("Error fetching streaming services:", error);
      }
    };

    fetchStreamingServices();
  }, [movie.title]);


  useEffect(() => {
    const fetchRottenScore = async () => {
      try {
        const response = await fetch(`/movieTomatoes/${encodeURIComponent(movie.title)}`);
        if (response.ok) {
          const data = await response.text();
          setRottenScore(data);
        } else {
          console.error("Failed to fetch rotten tomatoes score");
        }
      } catch (error) {
        console.error("Error fetching rotten tomatoes score:", error);
      }
    };

    fetchRottenScore();
  }, [movie.title]);

  return (
    <div className={hidden ? "hidden" : "popup"}>
      <a href="#" className="close" onClick={onClose}></a>
      <h3>{movie.title}</h3>
      <p>{movie.release_date}</p>
      <p>🍅 {rottenScore} %</p>
      <p>{movie.overview}</p>
      <p>Where you can watch it:</p>
      <ul>
        {streamingServices.map((service, index) => (
          <li key={index}>{service}</li>
        ))}
      </ul>
    </div>
  );
}
export default Details;