import { useState, useEffect } from 'react'
import axios from 'axios'
import Navigation from './Navigation'

const API_URL = 'http://localhost:3001/api';

function Games({ setPage }) {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form fields - one state per field
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('RPG');
  const [rating, setRating] = useState('');
  const [multiplayer, setMultiplayer] = useState(false);

  const fetchGames = () => {
    setLoading(true);
    axios.get(`${API_URL}/games`)
      .then(function(response) {
        setGames(response.data);
        setLoading(false);
      })
      .catch(function(err) {
        setError('Error loading games: ' + err.message);
        setLoading(false);
      });
  };

  useEffect(function() {
    fetchGames();
  }, []);

  const openCreate = () => {
    setTitle('');
    setGenre('RPG');
    setRating('');
    setMultiplayer(false);
    setEditingId(null);
    setFormError(null);
    setShowForm(true);
  };

  const openEdit = (game) => {
    setTitle(game.title);
    setGenre(game.genre);
    setRating(game.rating || '');
    setMultiplayer(game.multiplayer || false);
    setEditingId(game._id);
    setFormError(null);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    const payload = {
      title: title,
      genre: genre,
      multiplayer: multiplayer
    };
    if (rating !== '') {
      payload.rating = Number(rating);
    }

    try {
      if (editingId) {
        await axios.patch(`${API_URL}/games/${editingId}`, payload);
      } else {
        await axios.post(`${API_URL}/games`, payload);
      }
      setShowForm(false);
      fetchGames();
    } catch (err) {
      setFormError(err.response?.data?.error || err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this game?')) return;
    try {
      await axios.delete(`${API_URL}/games/${id}`);
      fetchGames();
    } catch (err) {
      setError('Delete failed: ' + err.message);
    }
  };

  if (loading) return <div className="container"><div className="loading">Loading games...</div></div>;
  if (error) return <div className="container"><div className="error">{error}</div></div>;

  return (
    <div className="container">
      <Navigation setPage={setPage} />
      <h1>Games</h1>

      <div className="list-header">
        <span className="count-badge">{games.length} total</span>
        <button className="btn-primary" onClick={openCreate}>+ New Game</button>
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{editingId ? 'Edit Game' : 'Add New Game'}</h2>
            {formError && <div className="error">{formError}</div>}
            <form onSubmit={handleSubmit} className="crud-form">
              <label>Title *
                <input value={title} onChange={e => setTitle(e.target.value)} required />
              </label>
              <label>Genre *
                <select value={genre} onChange={e => setGenre(e.target.value)} required>
                  <option value="RPG">RPG</option>
                  <option value="FPS">FPS</option>
                  <option value="Puzzle">Puzzle</option>
                  <option value="Strategy">Strategy</option>
                  <option value="Simulation">Simulation</option>
                </select>
              </label>
              <label>Rating (0-10)
                <input type="number" min="0" max="10" step="0.1" value={rating} onChange={e => setRating(e.target.value)} />
              </label>
              <label className="checkbox-label">
                <input type="checkbox" checked={multiplayer} onChange={e => setMultiplayer(e.target.checked)} />
                Multiplayer
              </label>
              <div className="form-actions">
                <button type="submit" className="btn-primary">{editingId ? 'Save Changes' : 'Create Game'}</button>
                <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="items-list">
        {games.map(game => (
          <div key={game._id} className="item-card">
            <div className="card-header">
              <h3>{game.title}</h3>
              <span className="card-tag" style={{ background: '#388e3c' }}>{game.genre}</span>
            </div>
            <p>Rating: {game.rating ? game.rating + ' / 10' : 'Unrated'}</p>
            <p>{game.multiplayer ? 'Multiplayer' : 'Single Player'}</p>
            <p className="card-meta">Added: {new Date(game.createdAt).toLocaleDateString()}</p>
            <div className="card-actions">
              <button className="btn-edit" onClick={() => openEdit(game)}>Edit</button>
              <button className="btn-delete" onClick={() => handleDelete(game._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Games
