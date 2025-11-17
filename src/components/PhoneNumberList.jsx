import React, { useState, useEffect } from 'react';
import { getPhoneNumbers, updatePhoneNumber, deletePhoneNumber } from '../services/api';
import '../styles/PhoneNumberList.css';

function PhoneNumberList({ refreshKey, onUpdate }) {
  const [phoneNumbers, setPhoneNumbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ phoneNumber: '', label: '' });

  useEffect(() => {
    loadPhoneNumbers();
  }, [refreshKey]);

  const loadPhoneNumbers = async () => {
    try {
      setLoading(true);
      const data = await getPhoneNumbers();
      setPhoneNumbers(data.phoneNumbers || []);
    } catch (err) {
      console.error('Failed to load:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatPhone = (number) => {
    const cleaned = String(number).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    return match ? `(${match[1]}) ${match[2]}-${match[3]}` : number;
  };

  const handleEdit = (pn) => {
    setEditingId(pn._id);
    setEditForm({
      phoneNumber: formatPhone(pn.phoneNumber),
      label: pn.label || ''
    });
  };

  const handleSaveEdit = async (id) => {
    try {
      const cleanedNumber = editForm.phoneNumber.replace(/\D/g, '');
      await updatePhoneNumber(id, {
        phoneNumber: cleanedNumber,
        label: editForm.label
      });
      setEditingId(null);
      loadPhoneNumbers();
      if (onUpdate) onUpdate();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update');
    }
  };

  const handleToggleActive = async (id, currentStatus) => {
    try {
      await updatePhoneNumber(id, { active: !currentStatus });
      loadPhoneNumbers();
      if (onUpdate) onUpdate();
    } catch (err) {
      alert('Failed to toggle status');
    }
  };

  const handleDelete = async (id, phoneNumber) => {
    if (window.confirm(`Delete ${formatPhone(phoneNumber)}?`)) {
      try {
        await deletePhoneNumber(id);
        loadPhoneNumbers();
        if (onUpdate) onUpdate();
      } catch (err) {
        alert('Failed to delete');
      }
    }
  };

  if (loading) {
    return (
      <div className="phone-number-list">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="phone-number-list">
      <div className="list-header">
        <h2>Phone Numbers ({phoneNumbers.length})</h2>
        <div className="badges">
          <span className="badge badge-success">
            Active: {phoneNumbers.filter(p => p.active).length}
          </span>
          <span className="badge badge-inactive">
            Inactive: {phoneNumbers.filter(p => !p.active).length}
          </span>
        </div>
      </div>
      
      {phoneNumbers.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📱</div>
          <h3>No phone numbers yet</h3>
          <p>Add your first number above to start receiving SMS notifications</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Phone Number</th>
                <th>Label</th>
                <th>Status</th>
                <th>Added</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {phoneNumbers.map((pn) => (
                <tr key={pn._id} className={!pn.active ? 'row-inactive' : ''}>
                  <td>
                    {editingId === pn._id ? (
                      <input
                        type="tel"
                        value={editForm.phoneNumber}
                        onChange={(e) => setEditForm({ ...editForm, phoneNumber: e.target.value })}
                        maxLength={14}
                      />
                    ) : (
                      <strong>{formatPhone(pn.phoneNumber)}</strong>
                    )}
                  </td>
                  <td>
                    {editingId === pn._id ? (
                      <input
                        type="text"
                        value={editForm.label}
                        onChange={(e) => setEditForm({ ...editForm, label: e.target.value })}
                        placeholder="Label"
                      />
                    ) : (
                      <span className="label-text">{pn.label || '—'}</span>
                    )}
                  </td>
                  <td>
                    <span className={`status ${pn.active ? 'active' : 'inactive'}`}>
                      {pn.active ? '✓ Active' : '✗ Inactive'}
                    </span>
                  </td>
                  <td className="date-cell">
                    {new Date(pn.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <div className="actions">
                      {editingId === pn._id ? (
                        <>
                          <button
                            onClick={() => handleSaveEdit(pn._id)}
                            className="btn-action btn-save"
                            title="Save"
                          >
                            💾
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="btn-action btn-cancel"
                            title="Cancel"
                          >
                            ✕
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEdit(pn)}
                            className="btn-action btn-edit"
                            title="Edit"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleToggleActive(pn._id, pn.active)}
                            className={`btn-action ${pn.active ? 'btn-pause' : 'btn-play'}`}
                            title={pn.active ? 'Disable' : 'Enable'}
                          >
                            {pn.active ? '⏸' : '▶️'}
                          </button>
                          <button
                            onClick={() => handleDelete(pn._id, pn.phoneNumber)}
                            className="btn-action btn-delete"
                            title="Delete"
                          >
                            🗑️
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default PhoneNumberList;