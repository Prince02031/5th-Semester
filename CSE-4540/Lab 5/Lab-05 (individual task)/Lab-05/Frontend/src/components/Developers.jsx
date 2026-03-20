import { useState, useEffect } from 'react'
import axios from 'axios'
import Navigation from './Navigation'

const API_URL = 'http://localhost:3001/api';

function Developers({ setPage }) {
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filterSpec, setFilterSpec] = useState('');
  const [filterAvailable, setFilterAvailable] = useState('');

  // Form fields - one state per field
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [specializations, setSpecializations] = useState([]);
  const [experienceYears, setExperienceYears] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [available, setAvailable] = useState(true);
  const [cert1, setCert1] = useState('');
  const [cert2, setCert2] = useState('');
  const [cert3, setCert3] = useState('');

  const fetchDevelopers = () => {
    setLoading(true);
    let url = `${API_URL}/developers?`;
    if (filterSpec) {
      url = url + 'specialization=' + filterSpec + '&';
    }
    if (filterAvailable !== '') {
      url = url + 'available=' + filterAvailable;
    }
    axios.get(url)
      .then(function(response) {
        setDevelopers(response.data);
        setLoading(false);
      })
      .catch(function(err) {
        setError('Error loading developers: ' + err.message);
        setLoading(false);
      });
  };

  useEffect(function() {
    fetchDevelopers();
  }, [filterSpec, filterAvailable]);

  // Add or remove a specialization from the list
  const toggleSpecialization = (spec) => {
    if (specializations.includes(spec)) {
      setSpecializations(specializations.filter(s => s !== spec));
    } else {
      setSpecializations([...specializations, spec]);
    }
  };

  const openCreate = () => {
    setName('');
    setEmail('');
    setSpecializations([]);
    setExperienceYears('');
    setHourlyRate('');
    setAvailable(true);
    setCert1('');
    setCert2('');
    setCert3('');
    setEditingId(null);
    setFormError(null);
    setShowForm(true);
  };

  const openEdit = (dev) => {
    setName(dev.name);
    setEmail(dev.email);
    setSpecializations(dev.specializations || []);
    setExperienceYears(dev.experienceYears || '');
    setHourlyRate(dev.hourlyRate || '');
    setAvailable(dev.available);
    setCert1((dev.certifications && dev.certifications[0]) || '');
    setCert2((dev.certifications && dev.certifications[1]) || '');
    setCert3((dev.certifications && dev.certifications[2]) || '');
    setEditingId(dev._id);
    setFormError(null);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    const certList = [];
    if (cert1 !== '') certList.push(cert1);
    if (cert2 !== '') certList.push(cert2);
    if (cert3 !== '') certList.push(cert3);

    const payload = {
      name: name,
      email: email,
      specializations: specializations,
      available: available,
      certifications: certList
    };
    if (experienceYears !== '') {
      payload.experienceYears = Number(experienceYears);
    }
    if (hourlyRate !== '') {
      payload.hourlyRate = Number(hourlyRate);
    }

    try {
      if (editingId) {
        await axios.patch(`${API_URL}/developers/${editingId}`, payload);
      } else {
        await axios.post(`${API_URL}/developers`, payload);
      }
      setShowForm(false);
      fetchDevelopers();
    } catch (err) {
      setFormError(err.response?.data?.error || err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this developer?')) return;
    try {
      await axios.delete(`${API_URL}/developers/${id}`);
      fetchDevelopers();
    } catch (err) {
      setError('Delete failed: ' + err.message);
    }
  };

  if (loading) return <div className="container"><div className="loading">Loading developers...</div></div>;
  if (error) return <div className="container"><div className="error">{error}</div></div>;

  return (
    <div className="container">
      <Navigation setPage={setPage} />
      <h1>Developers</h1>

      <div className="filter-bar">
        <label>Specialization:
          <select value={filterSpec} onChange={e => setFilterSpec(e.target.value)}>
            <option value="">All</option>
            <option value="RPG">RPG</option>
            <option value="FPS">FPS</option>
            <option value="Puzzle">Puzzle</option>
            <option value="Strategy">Strategy</option>
            <option value="Simulation">Simulation</option>
          </select>
        </label>
        <label>Availability:
          <select value={filterAvailable} onChange={e => setFilterAvailable(e.target.value)}>
            <option value="">All</option>
            <option value="true">Available</option>
            <option value="false">Not Available</option>
          </select>
        </label>
      </div>

      <div className="list-header">
        <span className="count-badge">{developers.length} total</span>
        <button className="btn-primary" onClick={openCreate}>+ New Developer</button>
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{editingId ? 'Edit Developer' : 'Add New Developer'}</h2>
            {formError && <div className="error">{formError}</div>}
            <form onSubmit={handleSubmit} className="crud-form">
              <label>Name *
                <input value={name} onChange={e => setName(e.target.value)} required />
              </label>
              <label>Email *
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
              </label>
              <label>Specializations
                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input type="checkbox" checked={specializations.includes('RPG')} onChange={() => toggleSpecialization('RPG')} />
                    RPG
                  </label>
                  <label className="checkbox-label">
                    <input type="checkbox" checked={specializations.includes('FPS')} onChange={() => toggleSpecialization('FPS')} />
                    FPS
                  </label>
                  <label className="checkbox-label">
                    <input type="checkbox" checked={specializations.includes('Puzzle')} onChange={() => toggleSpecialization('Puzzle')} />
                    Puzzle
                  </label>
                  <label className="checkbox-label">
                    <input type="checkbox" checked={specializations.includes('Strategy')} onChange={() => toggleSpecialization('Strategy')} />
                    Strategy
                  </label>
                  <label className="checkbox-label">
                    <input type="checkbox" checked={specializations.includes('Simulation')} onChange={() => toggleSpecialization('Simulation')} />
                    Simulation
                  </label>
                </div>
              </label>
              <label>Experience (years, min 1)
                <input type="number" min="1" value={experienceYears} onChange={e => setExperienceYears(e.target.value)} />
              </label>
              <label>Hourly Rate ($, min 10) *
                <input type="number" min="10" value={hourlyRate} onChange={e => setHourlyRate(e.target.value)} required />
              </label>
              <label className="checkbox-label">
                <input type="checkbox" checked={available} onChange={e => setAvailable(e.target.checked)} />
                Available
              </label>
              <label>Certification 1
                <input value={cert1} onChange={e => setCert1(e.target.value)} placeholder="e.g. Unity Certified" />
              </label>
              <label>Certification 2
                <input value={cert2} onChange={e => setCert2(e.target.value)} placeholder="e.g. AWS Developer" />
              </label>
              <label>Certification 3
                <input value={cert3} onChange={e => setCert3(e.target.value)} placeholder="e.g. Unreal Engine Dev" />
              </label>
              <div className="form-actions">
                <button type="submit" className="btn-primary">{editingId ? 'Save Changes' : 'Create Developer'}</button>
                <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="items-list">
        {developers.map(dev => (
          <div key={dev._id} className="item-card">
            <div className="card-header">
              <h3>{dev.name}</h3>
              <span className={dev.available ? 'avail-yes' : 'avail-no'}>{dev.available ? 'Available' : 'Unavailable'}</span>
            </div>
            <p>Email: {dev.email}</p>
            <p>${dev.hourlyRate}/hr &nbsp;·&nbsp; {dev.experienceYears || 'N/A'} yrs exp</p>
            {dev.specializations && dev.specializations.length > 0 && (
              <div className="tag-list">
                {dev.specializations.map(s => (
                  <span key={s} className="tag">{s}</span>
                ))}
              </div>
            )}
            <p className="card-meta">Certs: {dev.certifications && dev.certifications.length > 0 ? dev.certifications.join(', ') : 'None'}</p>
            <div className="card-actions">
              <button className="btn-edit" onClick={() => openEdit(dev)}>Edit</button>
              <button className="btn-delete" onClick={() => handleDelete(dev._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Developers
