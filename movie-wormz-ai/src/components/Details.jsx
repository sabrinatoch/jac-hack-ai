import { useState, useEffect } from "react";
import ReactDOM from 'react-dom';
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

  useEffect(() => {
    if (!hidden) {
      // Append the popup to the body when it's displayed
      const popupContainer = document.createElement('div');
      popupContainer.className = 'popup-container';
      document.body.appendChild(popupContainer);
      ReactDOM.render(
        <div className="popup">
          <a href="#" className="close" onClick={onClose}></a>
          <h3>{movie.title}</h3>
          <p>📅 {movie.release_date}</p>
          <p>🍅 {rottenScore}% on RottenTomatoes</p>
          <p><b>Synopsis:</b> {movie.overview}</p>
          <p className="st">Currently streaming on:</p>
          <ul>
            {streamingServices.map((service, index) => (
              <li key={index}>{service}</li>
            ))}
          </ul>
        </div>,
        popupContainer
      );

      return () => {
        // Cleanup function to remove the popup when hidden
        document.body.removeChild(popupContainer);
      };
    }
  }, [hidden, movie, onClose, rottenScore, streamingServices]);

  return null; // Return null here as the popup is appended to the body directly
}
export default Details;
