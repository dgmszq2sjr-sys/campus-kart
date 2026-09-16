import React, { useState } from 'react';

export default function ReportModal({ isOpen, onClose, listingId, offenderEmail, reporterEmail }) {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const payload = {
      listingId: listingId,
      reporterEmail: reporterEmail,
      offenderEmail: offenderEmail,
      reason: reason
    };

    try {
      const response = await fetch('http://localhost:8080/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setMessage('Report submitted successfully. Admins will review it shortly.');
        setTimeout(() => {
          onClose();
          setMessage('');
          setReason('');
        }, 1500);
      } else {
        setMessage('Failed to submit report. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      setMessage('Server error. Make sure your Spring Boot backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-red-600">Report Equipment Misuse</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 font-bold">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Reporting Student</label>
            <input type="text" value={offenderEmail} disabled className="w-full bg-gray-100 border p-2 rounded text-sm text-gray-600 mt-1" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Reason / Damage Details</label>
            <textarea
              required
              rows="4"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g., Returned electric kettle with broken heating coil and cracked base."
              className="w-full border p-2 rounded mt-1 focus:ring-2 focus:ring-red-500 outline-none text-sm"
            />
          </div>

          {message && <p className="text-sm font-semibold text-center text-blue-600">{message}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100 text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm font-medium"
            >
              {loading ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}