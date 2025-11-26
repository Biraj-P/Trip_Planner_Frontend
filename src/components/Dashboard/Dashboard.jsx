import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DashboardHeader from './DashboardHeader';
import TripList from './TripList';
import TripFormModal from './TripFormModal';
import ProfileModal from './ProfileModal';
import "../styles/Dashboard.css";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trips, setTrips] = useState([]);
  
  // Modal states
  const [showTripForm, setShowTripForm] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  
  // Trip form states
  const [editTripId, setEditTripId] = useState(null);
  const [tripForm, setTripForm] = useState({
    destination: '',
    budget: '',
    startDate: '',
    endDate: '',
    femaleAllowed: true,
    maleCount: 0,
    femaleCount: 0
  });
  
  // Profile form state
  const [profileForm, setProfileForm] = useState({
    age: '',
    gender: '',
    phoneNumber: '',
    college: '',
    course: '',
    graduationYear: '',
    bio: ''
  });

  // Fetch data on mount
  useEffect(() => {
    fetchUserData();
    fetchTrips();
    fetchProfile();
  }, []);

  const fetchUserData = () => {
    axios.get('http://localhost:8080/api/user', { withCredentials: true })
      .then(res => {
        setUser(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        window.location.href = '/';
      });
  };

  const fetchTrips = () => {
    axios.get('http://localhost:8080/api/trips/my', { withCredentials: true })
      .then(res => setTrips(res.data))
      .catch(err => console.error('Error fetching trips:', err));
  };

  const fetchProfile = () => {
    axios.get('http://localhost:8080/api/user/profile', { withCredentials: true })
      .then(res => {
        setProfile(res.data);
        setProfileForm({
          age: res.data.age || '',
          gender: res.data.gender || '',
          phoneNumber: res.data.phoneNumber || '',
          college: res.data.college || '',
          course: res.data.course || '',
          graduationYear: res.data.graduationYear || '',
          bio: res.data.bio || ''
        });
      })
      .catch(err => console.error('Error fetching profile:', err));
  };

  // Handlers
  const handleLogout = () => {
    axios.post('http://localhost:8080/logout', {}, { withCredentials: true })
      .then(() => {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = '/';
      })
      .catch(() => window.location.href = '/');
  };

  const handleTripFormChange = e => {
    const { name, value, type, checked } = e.target;
    setTripForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleProfileFormChange = e => {
    const { name, value } = e.target;
    setProfileForm(f => ({ ...f, [name]: value }));
  };

  const calculateDays = () => {
    if (tripForm.startDate && tripForm.endDate) {
      const start = new Date(tripForm.startDate);
      const end = new Date(tripForm.endDate);
      return Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
    }
    return 0;
  };

  const handleCreateOrUpdateTrip = e => {
    e.preventDefault();
    
    if (tripForm.maleCount < 0 || tripForm.femaleCount < 0) {
      alert('Counts cannot be negative');
      return;
    }

    const url = editTripId 
      ? `http://localhost:8080/api/trips/${editTripId}/update`
      : 'http://localhost:8080/api/trips/create';
    
    const method = editTripId ? axios.put : axios.post;

    method(url, tripForm, { withCredentials: true })
      .then(() => {
        setShowTripForm(false);
        setEditTripId(null);
        fetchTrips();
        resetTripForm();
      })
      .catch(err => alert('Error saving trip'));
  };

  const handleEditTrip = trip => {
    setEditTripId(trip.id);
    setTripForm({
      destination: trip.destination || '',
      budget: trip.budget || '',
      startDate: trip.startDate || '',
      endDate: trip.endDate || '',
      femaleAllowed: trip.femaleAllowed ?? true,
      maleCount: trip.maleCount || 0,
      femaleCount: trip.femaleCount || 0
    });
    setShowTripForm(true);
  };

  const handleProfileSubmit = e => {
    e.preventDefault();
    axios.put('http://localhost:8080/api/user/profile', profileForm, { withCredentials: true })
      .then(res => {
        setProfile(res.data);
        setIsEditingProfile(false);
        setShowProfileModal(false);
        alert('Profile updated successfully!');
      })
      .catch(() => alert('Failed to update profile'));
  };

  const resetTripForm = () => {
    setTripForm({
      destination: '',
      budget: '',
      startDate: '',
      endDate: '',
      femaleAllowed: true,
      maleCount: 0,
      femaleCount: 0
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-wrapper">
        <DashboardHeader
          user={user}
          onLogout={handleLogout}
          onProfileClick={() => {
            setShowProfileModal(true);
            setIsEditingProfile(false);
          }}
        />

        <button 
          className="create-trip-btn"
          onClick={() => {
            setShowTripForm(true);
            setEditTripId(null);
            resetTripForm();
          }}
        >
          ✈️ Create New Trip
        </button>

        <TripList trips={trips} onEdit={handleEditTrip} />

        {showTripForm && (
          <TripFormModal
            isEdit={!!editTripId}
            form={tripForm}
            onChange={handleTripFormChange}
            onSubmit={handleCreateOrUpdateTrip}
            onCancel={() => {
              setShowTripForm(false);
              setEditTripId(null);
              resetTripForm();
            }}
            calculateDays={calculateDays}
          />
        )}

        {showProfileModal && (
          <ProfileModal
            user={user}
            profile={profile}
            profileForm={profileForm}
            isEditing={isEditingProfile}
            onChange={handleProfileFormChange}
            onSubmit={handleProfileSubmit}
            onEdit={() => setIsEditingProfile(true)}
            onClose={() => {
              setShowProfileModal(false);
              setIsEditingProfile(false);
            }}
          />
        )}
      </div>
    </div>
  );
}
