import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Dashboard() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [trips, setTrips] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({
        destination: "",
        budget: "",
        startDate: "",
        endDate: "",
        femaleAllowed: true,
        maleCount: 0,
        femaleCount: 0
    });

    useEffect(() => {
        axios.get('http://localhost:8080/api/user', { withCredentials: true })
            .then((res) => {
                setUser(res.data);
                setLoading(false);
            })
            .catch((err) => {
                setLoading(false);
                window.location.href = '/';
            });
        axios.get('http://localhost:8080/api/trips/my', { withCredentials: true })
            .then((res) => setTrips(res.data));
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
        setForm(f => ({
            ...f,
            [name]: type === "checkbox" ? checked : value
        }));
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
        axios.post("http://localhost:8080/api/trips/create", { ...form }, { withCredentials: true })
            .then(() => {
                setShowForm(false);
                axios.get("http://localhost:8080/api/trips/my", { withCredentials: true })
                    .then(res => setTrips(res.data));
            });
    };

    // Approve or deny trip method
    const approveOrDenyTrip = (id, action) => {
        axios.post(`http://localhost:8080/api/trips/${id}/status?action=${action}`, {}, { withCredentials: true })
            .then(() => {
                axios.get("http://localhost:8080/api/trips/my", { withCredentials: true })
                    .then(res => setTrips(res.data));
            });
    };

    if (loading) {
        return <div className="dashboard-container"><div className="loading-spinner"></div></div>;
    }
    if (!user) {
        return null;
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>Dashboard</h1>
                <button onClick={handleLogout}>Logout</button>
            </div>
            <button onClick={() => setShowForm(true)}>Create Trip</button>

            {showForm &&
                <div className="trip-form-modal">
                    <form onSubmit={handleCreateTrip}>
                        <input name="destination" value={form.destination} onChange={handleFormChange} placeholder="Destination" required />
                        <input name="budget" type="number" value={form.budget} onChange={handleFormChange} placeholder="Budget" required />
                        <input name="startDate" type="date" value={form.startDate} onChange={handleFormChange} required />
                        <input name="endDate" type="date" value={form.endDate} onChange={handleFormChange} required />
                        <input name="maleCount" type="number" value={form.maleCount} onChange={handleFormChange} placeholder="Number of Males" min="0" required />
                        <input name="femaleCount" type="number" value={form.femaleCount} onChange={handleFormChange} placeholder="Number of Females" min="0" required />
                        <label>
                            Female Allowed
                            <input name="femaleAllowed" type="checkbox" checked={form.femaleAllowed} onChange={handleFormChange} />
                        </label>
                        <div>Tour Days: {calculateDays()}</div>
                        <button type="submit">Create</button>
                        <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
                    </form>
                </div>
            }

            <h2>My Trips</h2>
            <ul>
                {trips.map(trip => (
                    <li key={trip.id}>
                        {trip.destination} | Status: {trip.status}
                        {(trip.status === "Pending" && trip.creator && trip.creator.email === user.email) && (
                            <>
                                <button onClick={() => approveOrDenyTrip(trip.id, "approve")}>Approve</button>
                                <button onClick={() => approveOrDenyTrip(trip.id, "deny")}>Deny</button>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}
