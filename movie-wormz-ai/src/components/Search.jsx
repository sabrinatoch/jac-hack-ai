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
          console.log('Enter key pressed, input value:', inputValue);
        }
      };
    const clear = () => {
        setInputTitle("");
    }
    return(
        <div className="search">
            <label htmlFor="search">Search: </label>
            <input id="search" name="search" type="text" onChange={handleChange} value={inputTitle} onKeyDown={handleKeyDown}/>
        </div>
    );
}

export default Search;