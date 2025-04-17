import React, { useState } from 'react';
import './EventsLists.css';
import EventsList from './EventList';

function Body() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    description: '',
    image: null
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file.");
        return;
      }

      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        setError("File size should be less than 2MB.");
        return;
      }

      setFormData({
        ...formData,
        image: file  // ✅ Corrected field name
      });

      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("date", formData.date);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("image", formData.image);  // ✅ Corrected field name

      const response = await fetch("http://localhost:8080/api/events/upload", {
        method: "POST",
        body: formDataToSend
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || "Failed to create event");
      }

      console.log("Event added successfully");

      setFormData({ name: "", date: "", description: "", image: null }); // ✅ Reset correctly
      setPreviewImage(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding event:", error);
      setError(error.message || "Failed to create event");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div >
      <div className="admin-events-body">
        <h4>Admin Events</h4>
        <button 
          className="add-event-btn"
          onClick={() => setIsModalOpen(true)}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Processing...' : 'Add Event'}
        </button>
      </div>
      <EventsList></EventsList>

      {/* Add Event Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="admin-modal-content">
            <div className="admin-modal-header">
              <h3>Add New Event</h3>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Event Name:</label>
                <input
                  type="text"
                  name="name"  // ✅ Corrected field name
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="form-group">
                <label>Event Date:</label>
                <input
                  type="date"
                  name="date"  // ✅ Corrected field name
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="form-group">
                <label>Event Description:</label>
                <textarea
                  name="description"  // ✅ Corrected field name
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="form-group">
                <label>Event Image:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  required
                  disabled={isSubmitting}
                />
                {previewImage && (
                  <div className="image-preview">
                    <img src={previewImage} alt="Preview" />
                  </div>
                )}
              </div>
              
              {error && <div className="error-message">{error}</div>}
              
              <div className="form-actions">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Body;
