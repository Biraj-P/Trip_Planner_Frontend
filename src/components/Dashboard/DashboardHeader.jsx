import React from 'react';
import "../styles/DashboardHeader.css";

export default function DashboardHeader({ user, onLogout, onProfileClick }) {
  return (
    <header className="dashboard-header">
      <h1 className="dashboard-title">Welcome, {user?.name}</h1>
      <div className="header-actions">
        <div 
          className="profile-avatar-small" 
          onClick={onProfileClick}
          title="View Profile"
        >
          {user?.picture ? (
            <img 
              src={user.picture} 
              alt="Profile"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=1a1a1a&color=fff&bold=true&size=128`;
              }}
            />
          ) : (
            <img 
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=1a1a1a&color=fff&bold=true&size=128`}
              alt="Profile"
            />
          )}
        </div>
        <button className="logout-btn" onClick={onLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}
