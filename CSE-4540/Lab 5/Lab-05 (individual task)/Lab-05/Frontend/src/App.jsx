import { useState } from 'react'
import Home from './components/Home'
import Games from './components/Games'
import Players from './components/Players'
import Developers from './components/Developers'
import Collaborations from './components/Collaborations'

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch(currentPage) {
      case 'games': return <Games setPage={setCurrentPage} />;
      case 'players': return <Players setPage={setCurrentPage} />;
      case 'developers': return <Developers setPage={setCurrentPage} />;
      case 'collaborations': return <Collaborations setPage={setCurrentPage} />;
      default: return <Home setPage={setCurrentPage} />;
    }
  };

  return renderPage();
}

export default App
