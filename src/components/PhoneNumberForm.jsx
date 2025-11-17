import React, { useState } from 'react';
import { addPhoneNumber, addPhoneNumbersBulk } from '../services/api';
import '../styles/PhoneNumberForm.css';

function PhoneNumberForm({ onSuccess }) {
  const [numbers, setNumbers] = useState([{ phoneNumber: '', label: '' }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const formatPhoneNumber = (value) => {
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
    if (match) {
      return !match[2] ? match[1] : `(${match[1]}) ${match[2]}${match[3] ? `-${match[3]}` : ''}`;
    }
    return value;
  };

  const handlePhoneChange = (index, value) => {
    const formatted = formatPhoneNumber(value);
    const newNumbers = [...numbers];
    newNumbers[index].phoneNumber = formatted;
    setNumbers(newNumbers);
  };

  const handleLabelChange = (index, value) => {
    const newNumbers = [...numbers];
    newNumbers[index].label = value;
    setNumbers(newNumbers);
  };

  const addNumberField = () => {
    setNumbers([...numbers, { phoneNumber: '', label: '' }]);
  };

  const removeNumberField = (index) => {
    if (numbers.length > 1) {
      setNumbers(numbers.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const validNumbers = numbers.filter(n => n.phoneNumber.replace(/\D/g, '').length >= 10);

      if (validNumbers.length === 0) {
        setError('Please enter at least one valid phone number');
        setLoading(false);
        return;
      }

      if (validNumbers.length === 1) {
        await addPhoneNumber(validNumbers[0]);
        setSuccess('Phone number added successfully!');
      } else {
        const result = await addPhoneNumbersBulk(validNumbers);
        const { addedCount, duplicateCount, failedCount } = result.results;
        
        if (addedCount > 0) {
          setSuccess(
            `✓ Added ${addedCount} number(s)` +
            (duplicateCount > 0 ? `, ${duplicateCount} duplicate(s) skipped` : '') +
            (failedCount > 0 ? `, ${failedCount} failed` : '')
          );
        } else {
          setError('No numbers were added. Check for duplicates or invalid formats.');
        }
      }

      setNumbers([{ phoneNumber: '', label: '' }]);
      setTimeout(() => setSuccess(''), 5000);
      
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add phone number(s)');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="phone-number-form">
      <h2>Add Phone Numbers</h2>
      
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="numbers-container">
          {numbers.map((number, index) => (
            <div key={index} className="number-row">
              <div className="form-group">
                <label>Phone Number {numbers.length > 1 ? index + 1 : ''}</label>
                <input
                  type="tel"
                  value={number.phoneNumber}
                  onChange={(e) => handlePhoneChange(index, e.target.value)}
                  placeholder="(555) 123-4567"
                  required
                  maxLength={14}
                />
              </div>

              <div className="form-group">
                <label>Label (Optional)</label>
                <input
                  type="text"
                  value={number.label}
                  onChange={(e) => handleLabelChange(index, e.target.value)}
                  placeholder="e.g., John's Mobile"
                  maxLength={50}
                />
              </div>

              {numbers.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeNumberField(index)}
                  className="btn-remove"
                  title="Remove"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={addNumberField}
            className="btn btn-secondary"
            disabled={loading}
          >
            + Add Another Number
          </button>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? 'Saving...' : `Save ${numbers.length} Number${numbers.length > 1 ? 's' : ''}`}
          </button>
        </div>
      </form>
    </div>
  );
}

export default PhoneNumberForm;