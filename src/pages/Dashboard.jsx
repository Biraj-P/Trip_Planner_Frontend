import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Dashboard() {
    // State for editing a trip
    const [editTripId, setEditTripId] = useState(null);
    const [editForm, setEditForm] = useState({
      destination: "",
      budget: "",
      startDate: "",
      endDate: "",
      femaleAllowed: true,
      maleCount: 0,
      femaleCount: 0
    });
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trips, setTrips] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false); // NEW: Profile modal state
  const [profile, setProfile] = useState(null); // NEW: Profile data
  const [form, setForm] = useState({
    destination: "",
    budget: "",
    startDate: "",
    endDate: "",
    femaleAllowed: true,
    maleCount: 0,
    femaleCount: 0
  });

  // NEW: Profile form state
  const [profileForm, setProfileForm] = useState({
    age: "",
    gender: "",
    phoneNumber: "",
    college: "",
    course: "",
    graduationYear: "",
    bio: ""
  });

  useEffect(() => {
    // Fetch basic user info
    axios.get('http://localhost:8080/api/user', { withCredentials: true })
      .then((res) => {
        setUser(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        window.location.href = '/';
      });

    // Fetch user trips
    axios.get('http://localhost:8080/api/trips/my', { withCredentials: true })
      .then((res) => setTrips(res.data));

    // NEW: Fetch full user profile
    axios.get('http://localhost:8080/api/user/profile', { withCredentials: true })
      .then((res) => {
        setProfile(res.data);
        setProfileForm({
          age: res.data.age || "",
          gender: res.data.gender || "",
          phoneNumber: res.data.phoneNumber || "",
          college: res.data.college || "",
          course: res.data.course || "",
          graduationYear: res.data.graduationYear || "",
          bio: res.data.bio || ""
        });
      })
      .catch((err) => console.error('Error fetching profile:', err));
  }, []);

  const handleLogout = () => {
    axios.post('http://localhost:8080/logout', {}, {
      withCredentials: true,
      headers: { 'Content-Type': 'application/json' }
    })
      .then(() => {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = '/';
      })
      .catch(() => {
        window.location.href = '/';
      });
  };

  const handleFormChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  // NEW: Handle profile form changes
  const handleProfileFormChange = e => {
    const { name, value } = e.target;
    setProfileForm(f => ({ ...f, [name]: value }));
  };

  // NEW: Submit profile update
  const handleProfileSubmit = e => {
    e.preventDefault();
    axios.put('http://localhost:8080/api/user/profile', profileForm, {
      withCredentials: true
    })
      .then((res) => {
        setProfile(res.data);
        setShowProfileModal(false);
        alert('Profile updated successfully!');
      })
      .catch((err) => {
        console.error('Error updating profile:', err);
        alert('Failed to update profile');
      });
  };

  const calculateDays = () => {
    if (form.startDate && form.endDate) {
      const start = new Date(form.startDate);
      const end = new Date(form.endDate);
      return Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
    }
    return 0;
  };

  const handleCreateTrip = e => {
    e.preventDefault();
    // Validation for maleCount and femaleCount
    if (form.maleCount < 0 || form.femaleCount < 0) {
      alert("Male Count and Female Count cannot be negative.");
      return;
    }
    axios.post("http://localhost:8080/api/trips/create", { ...form }, { withCredentials: true })
      .then(() => {
        setShowForm(false);
        axios.get("http://localhost:8080/api/trips/my", { withCredentials: true })
          .then(res => setTrips(res.data));
      });
  };

  const approveOrDenyTrip = (id, action) => {
    axios.post(`http://localhost:8080/api/trips/${id}/status?action=${action}`, {}, { withCredentials: true })
      .then(() => {
        axios.get("http://localhost:8080/api/trips/my", { withCredentials: true })
          .then(res => setTrips(res.data));
      });
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header with Profile Picture in Top Right */}
      <div className="dashboard-header">
        <h1>Welcome, {user?.name}</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* NEW: Profile Picture - Clickable */}
          {/* Profile Picture - Clickable with Fallback */}
<div 
  className="profile-avatar-small" 
  onClick={() => setShowProfileModal(true)}
  title="View Profile"
>
  {user?.picture ? (
    <img 
      src={user.picture} 
      alt="Profile"
      onError={(e) => {
        // If Google image fails to load, use UI Avatars fallback
        e.target.onerror = null; // Prevent infinite loop
        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=1a1a1a&color=fff&bold=true&size=128`;
      }}
    />
  ) : (
    // No picture at all - use UI Avatars API
    <img 
      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=1a1a1a&color=fff&bold=true&size=128`}
      alt="Profile"
    />
  )}
</div>

          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div className="dashboard-content">
        <button onClick={() => setShowForm(true)} style={{ marginBottom: '20px' }}>
          Create Trip
        </button>

        {/* Trip List */}
        <ul>
          {trips.map(trip => (
            <li key={trip.id}>
              <strong>{trip.destination}</strong> - Budget: ₹{trip.budget} <br />
              {trip.startDate} to {trip.endDate} ({calculateDays()} days) <br />
              Male: {trip.maleCount}, Female: {trip.femaleCount} <br />
              Status: {trip.status}
              <button style={{marginLeft: '10px'}} onClick={() => {
                setEditTripId(trip.id);
                setEditForm({
                  destination: trip.destination || "",
                  budget: trip.budget || "",
                  startDate: trip.startDate || "",
                  endDate: trip.endDate || "",
                  femaleAllowed: trip.femaleAllowed ?? true,
                  maleCount: trip.maleCount || 0,
                  femaleCount: trip.femaleCount || 0
                });
              }}>Edit</button>
            </li>
          ))}
        </ul>
            {/* Edit Trip Modal */}
            {editTripId && (
              <div className="trip-form-modal">
                <form onSubmit={e => {
                  e.preventDefault();
                  // Validation for maleCount and femaleCount
                  if (editForm.maleCount < 0 || editForm.femaleCount < 0) {
                    alert("Male Count and Female Count cannot be negative.");
                    return;
                  }
                  axios.put(`http://localhost:8080/api/trips/${editTripId}/update`, editForm, { withCredentials: true })
                    .then(() => {
                      setEditTripId(null);
                      axios.get("http://localhost:8080/api/trips/my", { withCredentials: true })
                        .then(res => setTrips(res.data));
                    });
                }}>
                  <h2>Edit Trip</h2>
                  <input name="destination" placeholder="Destination" value={editForm.destination} onChange={e => setEditForm(f => ({ ...f, destination: e.target.value }))} required />
                  <input name="budget" type="number" min="0" placeholder="Budget (₹)" value={editForm.budget} onChange={e => setEditForm(f => ({ ...f, budget: e.target.value }))} required />
                  <label>Start Date:
                    <input name="startDate" type="date" value={editForm.startDate} onChange={e => setEditForm(f => ({ ...f, startDate: e.target.value }))} required />
                  </label>
                  <label>End Date:
                    <input name="endDate" type="date" value={editForm.endDate} onChange={e => setEditForm(f => ({ ...f, endDate: e.target.value }))} required />
                  </label>
                  <label>
                    <input type="checkbox" name="femaleAllowed" checked={editForm.femaleAllowed} onChange={e => setEditForm(f => ({ ...f, femaleAllowed: e.target.checked }))} />
                    Female Allowed
                  </label>
                  <input name="maleCount" type="number" min="0" placeholder="Male Count" value={editForm.maleCount} onChange={e => setEditForm(f => ({ ...f, maleCount: e.target.value }))} />
                  <input name="femaleCount" type="number" min="0" placeholder="Female Count" value={editForm.femaleCount} onChange={e => setEditForm(f => ({ ...f, femaleCount: e.target.value }))} />
                  <button type="submit">Save</button>
                  <button type="button" onClick={() => setEditTripId(null)}>Cancel</button>
                </form>
              </div>
            )}
      </div>

      {/* Create Trip Modal */}
      {showForm && (
        <div className="trip-form-modal">
          <form onSubmit={handleCreateTrip}>
            <h2>Create New Trip</h2>
            <input name="destination" placeholder="Destination" value={form.destination} onChange={handleFormChange} required />
            <input name="budget" type="number" placeholder="Budget (₹)" value={form.budget} onChange={handleFormChange} required />
            <label>Start Date:
              <input name="startDate" type="date" value={form.startDate} onChange={handleFormChange} required />
            </label>
            <label>End Date:
              <input name="endDate" type="date" value={form.endDate} onChange={handleFormChange} required />
            </label>
            <p>Tour Duration: {calculateDays()} days</p>
            <label>
              <input type="checkbox" name="femaleAllowed" checked={form.femaleAllowed} onChange={handleFormChange} />
              Female Allowed
            </label>
            <input name="maleCount" type="number" min="0" placeholder="Male Count" value={form.maleCount} onChange={handleFormChange} />
            <input name="femaleCount" type="number" min="0" placeholder="Female Count" value={form.femaleCount} onChange={handleFormChange} />
            <button type="submit">Create</button>
            <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
          </form>
        </div>
      )}

      {/* NEW: Profile Modal */}
      {showProfileModal && (
        <div className="trip-form-modal profile-modal">
          <form onSubmit={handleProfileSubmit} className="profile-form">
            <h2>Personal Details</h2>
            
            {/* Profile Picture Display */}
            <div className="profile-picture-display">
              {user?.picture ? (
                <img src={user.picture} alt="Profile" />
              ) : (
                <div className="profile-placeholder">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Non-editable fields */}
            <div className="profile-info-static">
              <p><strong>Name:</strong> {profile?.name}</p>
              <p><strong>Email:</strong> {profile?.email}</p>
            </div>

            {/* Editable fields */}
            <input
              name="age"
              type="number"
              placeholder="Age"
              value={profileForm.age}
              onChange={handleProfileFormChange}
            />

            <select
              name="gender"
              value={profileForm.gender}
              onChange={handleProfileFormChange}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>

            <input
              name="phoneNumber"
              type="tel"
              placeholder="Phone Number"
              value={profileForm.phoneNumber}
              onChange={handleProfileFormChange}
            />

            <input
              name="college"
              placeholder="College Name"
              value={profileForm.college}
              onChange={handleProfileFormChange}
            />

            <input
              name="course"
              placeholder="Course (e.g., B.Tech CS)"
              value={profileForm.course}
              onChange={handleProfileFormChange}
            />

            <input
              name="graduationYear"
              type="number"
              placeholder="Graduation Year"
              value={profileForm.graduationYear}
              onChange={handleProfileFormChange}
            />

            <textarea
              name="bio"
              placeholder="Bio (optional)"
              value={profileForm.bio}
              onChange={handleProfileFormChange}
              rows="3"
            />

            <div className="profile-form-buttons">
              <button type="submit">Save Profile</button>
              <button type="button" onClick={() => setShowProfileModal(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
