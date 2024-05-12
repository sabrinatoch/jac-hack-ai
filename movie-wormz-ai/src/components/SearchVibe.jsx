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
    const clear = () => {
        setInputTitle("");
    }
    return(
        <div className='search'>
            <label htmlFor="search">Search by Vibe: </label>
            <input id="search" name="search" type="text" onChange={handleChange} value={inputTitle}/>
            <button name ="submit" id="submit" onClick={handleClick}>Submit</button>
        </div>
    );
}

export default SearchVibe;