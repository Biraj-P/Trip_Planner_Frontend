import React from 'react';
import '../styles/ProfileModal.css';

export default function ProfileModal({
  user,
  profile,
  profileForm,
  isEditing,
  onChange,
  onSubmit,
  onEdit,
  onClose
}) {
  return (
    <div className="modal-overlay">
      <div className="modal-content profile-modal-content">
        {!isEditing ? (
          // View Mode
          <div className="profile-view">
            <h2 className="profile-title">Profile Details</h2>

            <div className="profile-picture-section">
              {user?.picture ? (
                <img 
                  src={user.picture} 
                  alt="Profile"
                  className="profile-picture-large"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=1a1a1a&color=fff&bold=true&size=200`;
                  }}
                />
              ) : (
                <div className="profile-placeholder-large">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div className="profile-static-info">
              <div className="info-item">
                <span className="info-label">Name</span>
                <span className="info-value">{profile?.name}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Email</span>
                <span className="info-value">{profile?.email}</span>
              </div>
            </div>

            <div className="profile-dynamic-info">
              <div className="info-item">
                <span className="info-label">Age</span>
                <span className="info-value">{profileForm.age || 'Not set'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Gender</span>
                <span className="info-value">{profileForm.gender || 'Not set'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Phone</span>
                <span className="info-value">{profileForm.phoneNumber || 'Not set'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">College</span>
                <span className="info-value">{profileForm.college || 'Not set'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Course</span>
                <span className="info-value">{profileForm.course || 'Not set'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Graduation Year</span>
                <span className="info-value">{profileForm.graduationYear || 'Not set'}</span>
              </div>
              {profileForm.bio && (
                <div className="info-item bio-item">
                  <span className="info-label">Bio</span>
                  <p className="info-value bio-text">{profileForm.bio}</p>
                </div>
              )}
            </div>

            <div className="profile-actions">
              <button type="button" onClick={onEdit} className="btn-edit-profile">
                Edit Profile
              </button>
              <button type="button" onClick={onClose} className="btn-close-profile">
                Close
              </button>
            </div>
          </div>
        ) : (
          // Edit Mode
          <form onSubmit={onSubmit} className="profile-edit-form">
            <h2 className="profile-title">Edit Profile</h2>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="age">Age</label>
                <input
                  id="age"
                  name="age"
                  type="number"
                  min="1"
                  max="120"
                  placeholder="25"
                  value={profileForm.age}
                  onChange={onChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="gender">Gender</label>
                <select
                  id="gender"
                  name="gender"
                  value={profileForm.gender}
                  onChange={onChange}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group full-width">
                <label htmlFor="phoneNumber">Phone Number</label>
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={profileForm.phoneNumber}
                  onChange={onChange}
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="college">College Name</label>
                <input
                  id="college"
                  name="college"
                  type="text"
                  placeholder="NIT Durgapur"
                  value={profileForm.college}
                  onChange={onChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="course">Course</label>
                <input
                  id="course"
                  name="course"
                  type="text"
                  placeholder="B.Tech Computer Science"
                  value={profileForm.course}
                  onChange={onChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="graduationYear">Graduation Year</label>
                <input
                  id="graduationYear"
                  name="graduationYear"
                  type="number"
                  min="1950"
                  max="2050"
                  placeholder="2026"
                  value={profileForm.graduationYear}
                  onChange={onChange}
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="bio">Bio</label>
                <textarea
                  id="bio"
                  name="bio"
                  rows="4"
                  placeholder="Tell us about yourself..."
                  value={profileForm.bio}
                  onChange={onChange}
                />
              </div>
            </div>

            <div className="profile-actions">
              <button type="submit" className="btn-save-profile">
                Save Changes
              </button>
              <button type="button" onClick={onClose} className="btn-cancel-profile">
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
