import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './TripDetails.css';

export default function TripDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [trip, setTrip] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showItineraryBox, setShowItineraryBox] = useState(false);
    const [userPreferences, setUserPreferences] = useState('');
    const [generating, setGenerating] = useState(false);

    useEffect(() => {
        axios.get(`http://localhost:8080/api/trips/${id}`, { withCredentials: true })
            .then(res => {
                setTrip(res.data);
                setLoading(false);
            })
            .catch(err => {
                alert('Error loading trip');
                navigate('/dashboard');
            });
    }, [id, navigate]);

    const handleGenerateItinerary = () => {
        setGenerating(true);
        axios.post(
            `http://localhost:8080/api/trips/${id}/generate-itinerary`,
            userPreferences,
            {
                withCredentials: true,
                headers: { 'Content-Type': 'text/plain' }
            }
        )
        .then(res => {
            setTrip(prev => ({ ...prev, itinerary: res.data }));
            setShowItineraryBox(false);
            setUserPreferences('');
            setGenerating(false);
        })
        .catch(err => {
            alert('Failed to generate itinerary');
            setGenerating(false);
        });
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
            </div>
        );
    }

    const formatDate = (date) => new Date(date).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });

    const getStatusClass = (status) => {
        if (status === 'Pending') return 'status-badge status-pending';
        if (status === 'Approved') return 'status-badge status-approved';
        if (status === 'Denied') return 'status-badge status-denied';
        return 'status-badge';
    };

    return (
        <div className="trip-details-container">
            <div className="trip-details-wrapper">
                <button onClick={() => navigate('/dashboard')} className="back-button">
                    ← Back to Dashboard
                </button>

                {/* Trip Details Card */}
                <div className="trip-card">
                    <h1 className="trip-title">{trip.destination}</h1>
                    
                    <div className="details-grid">
                        <div className="detail-item">
                            <p className="detail-label">Dates</p>
                            <p className="detail-value">
                                {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                            </p>
                        </div>
                        <div className="detail-item">
                            <p className="detail-label">Budget</p>
                            <p className="detail-value">₹{trip.budget} per person</p>
                        </div>
                        <div className="detail-item">
                            <p className="detail-label">👥 Group Size</p>
                            <p className="detail-value">
                                {trip.maleCount} Male{trip.maleCount !== 1 ? 's' : ''}, {trip.femaleCount} Female{trip.femaleCount !== 1 ? 's' : ''}
                            </p>
                        </div>
                        <div className="detail-item">
                            <p className="detail-label">Status</p>
                            <span className={getStatusClass(trip.status)}>{trip.status}</span>
                        </div>
                    </div>

                    <div className="creator-info">
                        <p className="detail-label">Created by</p>
                        <p className="detail-value">{trip.creator.name} ({trip.creator.email})</p>
                    </div>
                </div>

                {/* Generate Itinerary Section */}
                <div className="itinerary-card">
                    <h2 className="itinerary-title">Trip Itinerary</h2>
                    
                    {!trip.itinerary && !showItineraryBox && (
                        <button onClick={() => setShowItineraryBox(true)} className="generate-button">
                            ✨ Generate Itinerary with AI
                        </button>
                    )}

                    {showItineraryBox && (
                        <div className="preferences-section">
                            <textarea
                                value={userPreferences}
                                onChange={e => setUserPreferences(e.target.value)}
                                placeholder="Add your preferences (optional): e.g., 'Focus on historical sites', 'Include adventure activities', 'Vegetarian food options'..."
                                className="preferences-textarea"
                            />
                            <div className="action-buttons">
                                <button
                                    onClick={handleGenerateItinerary}
                                    disabled={generating}
                                    className="btn-generate"
                                >
                                    {generating ? 'Generating...' : '✓ Generate'}
                                </button>
                                <button onClick={() => setShowItineraryBox(false)} className="btn-cancel">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}

                    {trip.itinerary && (
                        <div>
                            <div className="itinerary-display">{trip.itinerary}</div>
                            <button onClick={() => setShowItineraryBox(true)} className="btn-regenerate">
                                Regenerate Itinerary
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
