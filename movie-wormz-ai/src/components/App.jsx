import { useState } from 'react'
import '../styles/App.css'

import { HfInference } from "@huggingface/inference";
import { HfAgent } from "@huggingface/agents";
import { createRepo, commit, deleteRepo, listFiles } from "@huggingface/hub";
import Search from './Search'
function App() {
  // const [count, setCount] = useState(0)

  return <Search></Search>
}

export default App
