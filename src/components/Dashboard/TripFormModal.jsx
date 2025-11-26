import React from 'react';
import "../styles/TripFormModal.css";

export default function TripFormModal({ 
  isEdit, 
  form, 
  onChange, 
  onSubmit, 
  onCancel,
  calculateDays 
}) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <form onSubmit={onSubmit} className="trip-form">
          <h2 className="form-title">
            {isEdit ? 'Edit Trip' : 'Create New Trip'}
          </h2>

          <div className="form-group">
            <label htmlFor="destination">Destination</label>
            <input
              id="destination"
              name="destination"
              type="text"
              placeholder="e.g., Goa, Manali, Kerala"
              value={form.destination}
              onChange={onChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="budget">Budget per person (₹)</label>
            <input
              id="budget"
              name="budget"
              type="number"
              min="0"
              placeholder="5000"
              value={form.budget}
              onChange={onChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startDate">Start Date</label>
              <input
                id="startDate"
                name="startDate"
                type="date"
                value={form.startDate}
                onChange={onChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="endDate">End Date</label>
              <input
                id="endDate"
                name="endDate"
                type="date"
                value={form.endDate}
                onChange={onChange}
                required
              />
            </div>
          </div>

          {form.startDate && form.endDate && (
            <p className="duration-display">
              Tour Duration: <strong>{calculateDays()} days</strong>
            </p>
          )}

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="femaleAllowed"
                checked={form.femaleAllowed}
                onChange={onChange}
              />
              <span>Female participants allowed</span>
            </label>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="maleCount">Male Count</label>
              <input
                id="maleCount"
                name="maleCount"
                type="number"
                min="0"
                placeholder="0"
                value={form.maleCount}
                onChange={onChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="femaleCount">Female Count</label>
              <input
                id="femaleCount"
                name="femaleCount"
                type="number"
                min="0"
                placeholder="0"
                value={form.femaleCount}
                onChange={onChange}
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-submit">
              {isEdit ? 'Save Changes' : 'Create Trip'}
            </button>
            <button type="button" onClick={onCancel} className="btn-cancel">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
