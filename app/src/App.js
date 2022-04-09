import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import Header from './components/Header/Header'
import Mint from './components/Mint/Mint'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Header />
        <Mint />
      </header>
    </div>  
  )
}

export default App;