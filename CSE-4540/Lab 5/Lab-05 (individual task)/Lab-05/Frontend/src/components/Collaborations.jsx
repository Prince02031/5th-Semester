import { useState, useEffect } from 'react'
import axios from 'axios'
import Navigation from './Navigation'

const API_URL = 'http://localhost:3001/api';

function Collaborations({ setPage }) {
  const [collaborations, setCollaborations] = useState([]);
  const [players, setPlayers] = useState([]);
  const [developers, setDevelopers] = useState([]);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');

  // New request form 
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [reqPlayerId, setReqPlayerId] = useState('');
  const [reqGameId, setReqGameId] = useState('');
  const [reqDescription, setReqDescription] = useState('');
  const [reqHours, setReqHours] = useState('');
  const [milestone1, setMilestone1] = useState('');
  const [milestone2, setMilestone2] = useState('');
  const [milestone3, setMilestone3] = useState('');
  const [milestone4, setMilestone4] = useState('');
  const [milestone5, setMilestone5] = useState('');

  // Accept form 
  const [acceptingId, setAcceptingId] = useState(null);
  const [accDeveloperId, setAccDeveloperId] = useState('');
  const [accStartDate, setAccStartDate] = useState('');
  const [accEndDate, setAccEndDate] = useState('');

  // Status update 
  const [updatingStatusId, setUpdatingStatusId] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  useEffect(function() {
    axios.get(`${API_URL}/players`)
      .then(function(res) { setPlayers(res.data); })
      .catch(function(err) { console.log('Error loading players: ' + err.message); });

    axios.get(`${API_URL}/developers`)
      .then(function(res) { setDevelopers(res.data); })
      .catch(function(err) { console.log('Error loading developers: ' + err.message); });

    axios.get(`${API_URL}/games`)
      .then(function(res) { setGames(res.data); })
      .catch(function(err) { console.log('Error loading games: ' + err.message); });
  }, []);

  const fetchCollaborations = () => {
    setLoading(true);
    let url = `${API_URL}/collaborations`;
    if (filterStatus) {
      url = url + '?status=' + filterStatus;
    }
    axios.get(url)
      .then(function(res) {
        setCollaborations(res.data);
        setLoading(false);
      })
      .catch(function(err) {
        setError('Error loading collaborations: ' + err.message);
        setLoading(false);
      });
  };

  useEffect(function() {
    fetchCollaborations();
  }, [filterStatus]);

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    const milestoneList = [];
    if (milestone1 !== '') milestoneList.push({ description: milestone1 });
    if (milestone2 !== '') milestoneList.push({ description: milestone2 });
    if (milestone3 !== '') milestoneList.push({ description: milestone3 });
    if (milestone4 !== '') milestoneList.push({ description: milestone4 });
    if (milestone5 !== '') milestoneList.push({ description: milestone5 });

    try {
      await axios.post(`${API_URL}/collaborations`, {
        playerId: reqPlayerId,
        gameId: reqGameId,
        requestDescription: reqDescription,
        estimatedHours: Number(reqHours),
        milestones: milestoneList
      });
      setShowRequestForm(false);
      setReqPlayerId('');
      setReqGameId('');
      setReqDescription('');
      setReqHours('');
      setMilestone1('');
      setMilestone2('');
      setMilestone3('');
      setMilestone4('');
      setMilestone5('');
      fetchCollaborations();
    } catch (err) {
      setFormError(err.response?.data?.error || err.message);
    }
  };


  const handleAccept = async (e) => {
    e.preventDefault();
    setFormError(null);
    try {
      await axios.post(`${API_URL}/collaborations/${acceptingId}/accept`, {
        developerId: accDeveloperId,
        startDate: accStartDate || undefined,
        endDate: accEndDate || undefined
      });
      setAcceptingId(null);
      setAccDeveloperId('');
      setAccStartDate('');
      setAccEndDate('');
      fetchCollaborations();
    } catch (err) {
      setFormError(err.response?.data?.error || err.message);
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm('Reject this collaboration request?')) return;
    try {
      await axios.post(`${API_URL}/collaborations/${id}/reject`);
      fetchCollaborations();
    } catch (err) {
      setError('Reject failed: ' + err.message);
    }
  };

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`${API_URL}/collaborations/${updatingStatusId}/status`, { status: newStatus });
      setUpdatingStatusId(null);
      fetchCollaborations();
    } catch (err) {
      setError('Status update failed: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this collaboration request?')) return;
    try {
      await axios.delete(`${API_URL}/collaborations/${id}`);
      fetchCollaborations();
    } catch (err) {
      setError('Delete failed: ' + err.message);
    }
  };

  const openAcceptForm = (collabId, currentStatus) => {
    setAcceptingId(collabId);
    setAccDeveloperId('');
    setAccStartDate('');
    setAccEndDate('');
    setFormError(null);
  };

  if (loading) return <div className="container"><div className="loading">Loading collaborations...</div></div>;
  if (error) return <div className="container"><div className="error">{error}</div></div>;

  const eligiblePlayers = [];
  for (let i = 0; i < players.length; i++) {
    if (players[i].membershipLevel === 'premium' || players[i].membershipLevel === 'elite') {
      eligiblePlayers.push(players[i]);
    }
  }

  const availableDevelopers = [];
  for (let i = 0; i < developers.length; i++) {
    if (developers[i].available === true) {
      availableDevelopers.push(developers[i]);
    }
  }

  return (
    <div className="container">
      <Navigation setPage={setPage} />
      <h1>Collaborations</h1>

      <div className="filter-bar">
        <label>Status:
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="">All</option>
            <option value="pending">pending</option>
            <option value="accepted">accepted</option>
            <option value="in-progress">in-progress</option>
            <option value="completed">completed</option>
            <option value="cancelled">cancelled</option>
            <option value="rejected">rejected</option>
          </select>
        </label>
      </div>

      <div className="list-header">
        <span className="count-badge">{collaborations.length} total</span>
        <button className="btn-primary" onClick={() => { setShowRequestForm(true); setFormError(null); }}>
          + New Request
        </button>
      </div>

  
      {showRequestForm && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Submit Customization Request</h2>
            <p style={{ fontSize: '13px', marginBottom: '10px' }}>
              Only premium or elite members can submit requests.
            </p>
            {/* if any error */}
            {formError && <div className="error">{formError}</div>} 
            <form onSubmit={handleRequestSubmit} className="crud-form">
              <label>Player * (premium/elite only)
                <select value={reqPlayerId} onChange={e => setReqPlayerId(e.target.value)} required>
                  <option value="">Select a player</option>
                  {eligiblePlayers.map(p => (
                    <option key={p._id} value={p._id}>{p.name} ({p.membershipLevel})</option>
                  ))}
                </select>
              </label>
              <label>Game *
                <select value={reqGameId} onChange={e => setReqGameId(e.target.value)} required>
                  <option value="">Select a game</option>
                  {games.map(g => (
                    <option key={g._id} value={g._id}>{g.title} ({g.genre})</option>
                  ))}
                </select>
              </label>
              <label>Request Description *
                <textarea value={reqDescription} onChange={e => setReqDescription(e.target.value)} rows="3" required />
              </label>
              <label>Estimated Hours *
                <input type="number" min="1" value={reqHours} onChange={e => setReqHours(e.target.value)} required />
              </label>
              <label>Milestone 1
                <input value={milestone1} onChange={e => setMilestone1(e.target.value)} placeholder="e.g. Design phase" />
              </label>
              <label>Milestone 2
                <input value={milestone2} onChange={e => setMilestone2(e.target.value)} placeholder="e.g. Development phase" />
              </label>
              <label>Milestone 3
                <input value={milestone3} onChange={e => setMilestone3(e.target.value)} placeholder="e.g. Testing phase" />
              </label>
              <label>Milestone 4
                <input value={milestone4} onChange={e => setMilestone4(e.target.value)} placeholder="e.g. Review phase" />
              </label>
              <label>Milestone 5
                <input value={milestone5} onChange={e => setMilestone5(e.target.value)} placeholder="e.g. Deployment phase" />
              </label>
              <div className="form-actions">
                <button type="submit" className="btn-primary">Submit Request</button>
                <button type="button" className="btn-secondary" onClick={() => setShowRequestForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Accept Form */}
      {acceptingId && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Accept Collaboration Request</h2>
            {formError && <div className="error">{formError}</div>}
            <form onSubmit={handleAccept} className="crud-form">
              <label>Developer * (available only)
                <select value={accDeveloperId} onChange={e => setAccDeveloperId(e.target.value)} required>
                  <option value="">Select a developer</option>
                  {availableDevelopers.map(d => (
                    <option key={d._id} value={d._id}>{d.name} (${d.hourlyRate}/hr)</option>
                  ))}
                </select>
              </label>
              <label>Start Date
                <input type="date" value={accStartDate} onChange={e => setAccStartDate(e.target.value)} />
              </label>
              <label>End Date
                <input type="date" value={accEndDate} onChange={e => setAccEndDate(e.target.value)} />
              </label>
              <div className="form-actions">
                <button type="submit" className="btn-primary">Accept & Assign Developer</button>
                <button type="button" className="btn-secondary" onClick={() => { setAcceptingId(null); setFormError(null); }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Status Update Form */}
      {updatingStatusId && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Update Status</h2>
            <form onSubmit={handleStatusUpdate} className="crud-form">
              <label>New Status *
                <select value={newStatus} onChange={e => setNewStatus(e.target.value)} required>
                  <option value="">Select status</option>
                  <option value="pending">pending</option>
                  <option value="accepted">accepted</option>
                  <option value="in-progress">in-progress</option>
                  <option value="completed">completed</option>
                  <option value="cancelled">cancelled</option>
                  <option value="rejected">rejected</option>
                </select>
              </label>
              <div className="form-actions">
                <button type="submit" className="btn-primary">Update Status</button>
                <button type="button" className="btn-secondary" onClick={() => setUpdatingStatusId(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="items-list">
        {collaborations.map(collab => (
          <div key={collab._id} className="item-card">
            <div className="card-header">
              <h3>#{collab._id.slice(-6)}</h3>
              <span className={'status-badge status-' + collab.status}>{collab.status}</span>
            </div>
            <p>Player: {collab.playerId ? collab.playerId.name : 'N/A'} <span className="card-sub">({collab.playerId ? collab.playerId.membershipLevel : ''})</span></p>
            <p>Game: {collab.gameId ? collab.gameId.title : 'N/A'}</p>
            <p>Developer: {collab.developerId ? collab.developerId.name : <em className="card-unassigned">Unassigned</em>}</p>
            <p className="card-description">{collab.requestDescription}</p>
            <p>{collab.estimatedHours} hrs &nbsp;·&nbsp; <strong className="card-cost">${collab.totalCost || 0}</strong></p>
            {collab.timeline && collab.timeline.startDate && (
              <p className="card-meta">Date: {new Date(collab.timeline.startDate).toLocaleDateString()}{collab.timeline.endDate && ' → ' + new Date(collab.timeline.endDate).toLocaleDateString()}</p>
            )}
            {collab.milestones && collab.milestones.length > 0 && (
              <div className="milestones">
                <strong>Milestones:</strong>
                <ul>
                  {collab.milestones.map((m, i) => (
                    <li key={i} className={m.completed ? 'done' : ''}>
                      {m.completed ? '[x]' : '[ ]'} {m.description}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="card-actions card-actions-bordered">
              {collab.status === 'pending' && (
                <>
                  <button className="btn-primary" onClick={() => openAcceptForm(collab._id)}>Accept</button>
                  <button className="btn-delete" onClick={() => handleReject(collab._id)}>Reject</button>
                </>
              )}
              <button className="btn-edit" onClick={() => { setUpdatingStatusId(collab._id); setNewStatus(collab.status); }}>Status</button>
              <button className="btn-delete" onClick={() => handleDelete(collab._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Collaborations
