import { useState } from 'react'
import '../styles/App.css'

function SearchVibe({ search }){
    const [inputTitle, setInputTitle] = useState("");
    const handleChange = (e) => {
        setInputTitle(e.target.value);
    };
    const handleClick = () => {
        if (inputTitle.length > 2) {
            search(inputTitle);
            clear();
        }
    }
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
          handleClick();
          
        }
      };
    const clear = () => {
        setInputTitle("");
    }
    return(
        <div className="search">
            <label htmlFor="vibe">Search by Vibes: </label>
            <input id="vibe" name="vibe" type="text" onChange={handleChange} value={inputTitle} onKeyDown={handleKeyDown}/>
        </div>
    );
}

export default SearchVibe;