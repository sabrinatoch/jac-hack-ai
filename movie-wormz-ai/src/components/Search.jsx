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
    const clear = () => {
        setInputTitle("");
    }
    return(
        <div>
            <label htmlFor="search">Search: </label>
            <input id="search" name="search" type="text" onChange={handleChange} value={inputTitle}/>
            <button name ="submit" id="submit" onClick={handleClick}>Submit</button>
        </div>
    );
}

export default Search;