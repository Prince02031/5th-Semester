function Navigation({ setPage }) {
  return (
    <div className="nav-buttons">
      <button className="nav-button" onClick={() => setPage('home')}>Home</button>
      <button className="nav-button" onClick={() => setPage('games')}>Games</button>
      <button className="nav-button" onClick={() => setPage('players')}>Players</button>
      <button className="nav-button" onClick={() => setPage('developers')}>Developers</button>
      <button className="nav-button" onClick={() => setPage('collaborations')}>Collaborations</button>
    </div>
  );
}

export default Navigation
