import React, { useState, useEffect } from "react";
import "./EventsList.css";

const EventsList = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedback, setFeedback] = useState({ user: "", comment: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/events");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleFeedbackSubmit = async () => {
    if (!feedback.user || !feedback.comment) {
      alert("Please enter your name and comment.");
      return;
    }

    const feedbackData = {
      user: feedback.user,
      comment: feedback.comment,
    };

    try {
      const response = await fetch(
        `http://localhost:8080/api/events/${selectedEvent.id}/feedback`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(feedbackData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit feedback.");
      }

      alert("Feedback submitted successfully!");
      setShowFeedbackForm(false);
      setFeedback({ user: "", comment: "" });
    } catch (error) {
      alert("Error submitting feedback: " + error.message);
    }
  };

  if (loading) return <div className="loading">Loading events...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="resident-events-container">
      <h3>Event List</h3>
      {events.length > 0 ? (
      <div className="events-grid">
        {events.map((event) => (
          <div
            key={event.id}
            className="event-item"
            onClick={() => {
              setSelectedEvent(event);
              setShowFeedbackForm(false);
            }}>

            <h4  style={{ fontSize: '16px' }} className="resident-event-name" >{event.name}</h4>
            <p className="resident-event-date">{event.date}</p>
          </div>
        ))}
      </div>
      ) : (
        <p className="no-notices">No Events Yet</p>
      )}

      {selectedEvent && (
        <div className="event-card">
          <div className="event-card-content">
            <h2 className="event-card-title">{selectedEvent.name}</h2>
            <p className="event-card-date">{selectedEvent.date}</p>
            <p className="event-card-description">{selectedEvent.description}</p>

            {selectedEvent.imageBase64 ? (
              <div className="event-image-container">
                <img
                  src={`data:image/jpeg;base64,${selectedEvent.imageBase64}`}
                  alt={`Event: ${selectedEvent.name}`}
                  className="event-card-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/placeholder.jpg";
                  }}
                />
              </div>
            ) : (
              <div className="image-placeholder">No image available</div>
            )}

            <div className="parent-container">
              <button
                className="event-card-close"
                onClick={() => setSelectedEvent(null)}
              >
                Close
              </button>
              <button
                className="event-card-feedback"
                onClick={() => setShowFeedbackForm(!showFeedbackForm)}
              >
                Feedback
              </button>
            </div>

            {showFeedbackForm && (
              <div className="resident-feedback-form">
                <h3>Submit Feedback</h3>
                <input
                  type="text"
                  placeholder="Your Name"
                  value={feedback.user}
                  onChange={(e) =>
                    setFeedback({ ...feedback, user: e.target.value })
                  }
                />
                <textarea
                  placeholder="Your Comment"
                  value={feedback.comment}
                  onChange={(e) =>
                    setFeedback({ ...feedback, comment: e.target.value })
                  }
                />
                <button onClick={handleFeedbackSubmit}>Submit</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsList;
