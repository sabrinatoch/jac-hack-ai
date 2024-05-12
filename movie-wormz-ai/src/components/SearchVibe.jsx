import { useState } from 'react'
import '../styles/App.css'

function SearchVibe({ search }){
    const [inputVibe, setInputVibe] = useState("");
    const handleChange = (e) => {
        setInputVibe(e.target.value);
    };
    const handleClick = () => {
        if (inputVibe.length > 2) {
            search(inputVibe);
            clear();
        }
    }
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
          handleClick();
          
        }
      };
    const clear = () => {
        setInputVibe("");
    }
    return(
        <div className="search">
            <input id="vibe" name="vibe" type="text" onChange={handleChange} value={inputVibe} onKeyDown={handleKeyDown} placeholder='Search by plot/genre/vibe...'/>
        </div>
    );
}

export default SearchVibe;