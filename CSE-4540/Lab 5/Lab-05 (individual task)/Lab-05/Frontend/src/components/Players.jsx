import { useState, useEffect } from 'react'
import axios from 'axios'
import Navigation from './Navigation'

const API_URL = 'http://localhost:3001/api';

function Players({ setPage }) {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filterMembership, setFilterMembership] = useState('');
  const [filterActive, setFilterActive] = useState('');

  // Form fields 
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [membershipLevel, setMembershipLevel] = useState('free');
  const [active, setActive] = useState(true);

  const fetchPlayers = () => {
    setLoading(true);
    let url = `${API_URL}/players?`;
    if (filterMembership) {
      url = url + 'membershipLevel=' + filterMembership + '&';
    }
    if (filterActive !== '') {
      url = url + 'active=' + filterActive;
    }
    axios.get(url)
      .then(function(response) {
        setPlayers(response.data);
        setLoading(false);
      })
      .catch(function(err) {
        setError('Error loading players: ' + err.message);
        setLoading(false);
      });
  };

  useEffect(function() {
    fetchPlayers();
  }, [filterMembership, filterActive]);

  const openCreate = () => {
    setName('');
    setEmail('');
    setAge('');
    setMembershipLevel('free');
    setActive(true);
    setEditingId(null);
    setFormError(null);
    setShowForm(true);
  };

  const openEdit = (player) => {
    setName(player.name);
    setEmail(player.email);
    setAge(player.age || '');
    setMembershipLevel(player.membershipLevel);
    setActive(player.active);
    setEditingId(player._id);
    setFormError(null);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    const payload = {
      name: name,
      email: email,
      membershipLevel: membershipLevel,
      active: active
    };
    if (age !== '') {
      payload.age = Number(age);
    }

    try {
      if (editingId) {
        await axios.patch(`${API_URL}/players/${editingId}`, payload);
      } else {
        await axios.post(`${API_URL}/players`, payload);
      }
      setShowForm(false);
      fetchPlayers();
    } catch (err) {
      setFormError(err.response?.data?.error || err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this player?')) return;
    try {
      await axios.delete(`${API_URL}/players/${id}`);
      fetchPlayers();
    } catch (err) {
      setError('Delete failed: ' + err.message);
    }
  };

  if (loading) return <div className="container"><div className="loading">Loading players...</div></div>;
  if (error) return <div className="container"><div className="error">{error}</div></div>;

  return (
    <div className="container">
      <Navigation setPage={setPage} />
      <h1>Players</h1>

      <div className="filter-bar">
        <label>Membership:
          <select value={filterMembership} onChange={e => setFilterMembership(e.target.value)}>
            <option value="">All</option>
            <option value="free">free</option>
            <option value="premium">premium</option>
            <option value="elite">elite</option>
          </select>
        </label>
        <label>Status:
          <select value={filterActive} onChange={e => setFilterActive(e.target.value)}>
            <option value="">All</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </label>
      </div>

      <div className="list-header">
        <span className="count-badge">{players.length} total</span>
        <button className="btn-primary" onClick={openCreate}>+ New Player</button>
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{editingId ? 'Edit Player' : 'Add New Player'}</h2>
            {formError && <div className="error">{formError}</div>}
            <form onSubmit={handleSubmit} className="crud-form">
              <label>Name *
                <input value={name} onChange={e => setName(e.target.value)} required />
              </label>
              <label>Email *
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
              </label>
              <label>Age (12-100)
                <input type="number" min="12" max="100" value={age} onChange={e => setAge(e.target.value)} />
              </label>
              <label>Membership Level
                <select value={membershipLevel} onChange={e => setMembershipLevel(e.target.value)}>
                  <option value="free">free</option>
                  <option value="premium">premium</option>
                  <option value="elite">elite</option>
                </select>
              </label>
              <label className="checkbox-label">
                <input type="checkbox" checked={active} onChange={e => setActive(e.target.checked)} />
                Active Account
              </label>
              <div className="form-actions">
                <button type="submit" className="btn-primary">{editingId ? 'Save Changes' : 'Create Player'}</button>
                <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="items-list">
        {players.map(player => (
          <div key={player._id} className="item-card">
            <div className="card-header">
              <h3>{player.name}</h3>
              <span className="card-tag" style={{ background: player.membershipLevel === 'elite' ? '#1b5e20' : player.membershipLevel === 'premium' ? '#388e3c' : '#81c784' }}>{player.membershipLevel}</span>
            </div>
            <p>Email: {player.email}</p>
            <p>Age: {player.age || 'N/A'}</p>
            <p>{player.active ? 'Active account' : 'Inactive account'}</p>
            <p className="card-meta">Joined: {new Date(player.joinDate).toLocaleDateString()}</p>
            <div className="card-actions">
              <button className="btn-edit" onClick={() => openEdit(player)}>Edit</button>
              <button className="btn-delete" onClick={() => handleDelete(player._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Players
