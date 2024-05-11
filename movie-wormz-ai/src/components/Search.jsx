import { useState } from 'react'
import '../styles/App.css'

function Search(){
    return(
        <form>
            <label for="search">Search: </label>
            <input id="search" name="search" type="text"/>
            <input type="submit" name ="submit" id="submit"/>
        </form>
    );
}

export default Search;