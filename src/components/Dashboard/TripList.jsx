import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/TripList.css";

export default function TripList({ trips, onEdit }) {
  const navigate = useNavigate();

  const calculateDays = (startDate, endDate) => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      return Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
    }
    return 0;
  };

  const getStatusClass = (status) => {
    const baseClass = 'trip-status';
    if (status === 'Pending') return `${baseClass} status-pending`;
    if (status === 'Approved') return `${baseClass} status-approved`;
    if (status === 'Denied') return `${baseClass} status-denied`;
    return baseClass;
  };

  return (
    <div className="trip-list-container">
      {trips.length === 0 ? (
        <div className="empty-state">
          <p className="empty-icon">✈️</p>
          <h3>No trips yet</h3>
          <p>Create your first trip to get started!</p>
        </div>
      ) : (
        <ul className="trip-list">
          {trips.map(trip => (
            <li key={trip.id} className="trip-card">
              <div className="trip-header">
                <h3 className="trip-destination">{trip.destination}</h3>
                <span className={getStatusClass(trip.status)}>{trip.status}</span>
              </div>

              <div className="trip-details">
                <div className="detail-row">
                  <span className="detail-icon">💰</span>
                  <span className="detail-text">₹{trip.budget}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-icon">📅</span>
                  <span className="detail-text">
                    {trip.startDate} to {trip.endDate} ({calculateDays(trip.startDate, trip.endDate)} days)
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-icon">👥</span>
                  <span className="detail-text">
                    {trip.maleCount} Male{trip.maleCount !== 1 ? 's' : ''}, {trip.femaleCount} Female{trip.femaleCount !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              <div className="trip-actions">
                <button 
                  className="btn-edit"
                  onClick={() => onEdit(trip)}
                >
                  Edit
                </button>
                <button
                  className="btn-view-details"
                  onClick={() => navigate(`/trip/${trip.id}`)}
                >
                  View Details & Itinerary
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
