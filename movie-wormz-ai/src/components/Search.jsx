import { useState } from 'react'
import '../styles/App.css'

function Search({ search }){
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
            <input id="search" name="search" type="text" onChange={handleChange} value={inputTitle} onKeyDown={handleKeyDown} placeholder='Search for movies like...'/>
        </div>
    );
}

export default Search;