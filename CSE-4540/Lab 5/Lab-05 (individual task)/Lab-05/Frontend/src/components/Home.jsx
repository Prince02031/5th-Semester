function Home({ setPage }) {
  return (
    <div className="container">
      <h1>Game Management System</h1>
      <p style={{ textAlign: 'center', fontSize: '15px', color: '#558b2f', marginBottom: '10px', letterSpacing: '0.5px' }}>
        Manage your games, players, developers and collaborations
      </p>
      <hr style={{ border: 'none', borderTop: '1px solid #c8e6c9', marginBottom: '10px' }} />
      <div className="button-grid">
        <button className="home-button" onClick={() => setPage('games')}>
          <div>
            <div style={{ fontSize: '16px' }}>Games</div>
            <div style={{ fontSize: '12px', fontWeight: 'normal', opacity: 0.85 }}>Browse & manage games</div>
          </div>
        </button>
        <button className="home-button" onClick={() => setPage('players')}>
          <div>
            <div style={{ fontSize: '16px' }}>Players</div>
            <div style={{ fontSize: '12px', fontWeight: 'normal', opacity: 0.85 }}>Manage player accounts</div>
          </div>
        </button>
        <button className="home-button" onClick={() => setPage('developers')}>
          <div>
            <div style={{ fontSize: '16px' }}>Developers</div>
            <div style={{ fontSize: '12px', fontWeight: 'normal', opacity: 0.85 }}>View developer profiles</div>
          </div>
        </button>
        <button className="home-button" onClick={() => setPage('collaborations')}>
          <div>
            <div style={{ fontSize: '16px' }}>Collaborations</div>
            <div style={{ fontSize: '12px', fontWeight: 'normal', opacity: 0.85 }}>Track custom requests</div>
          </div>
        </button>
      </div>
    </div>
  );
}

export default Home
