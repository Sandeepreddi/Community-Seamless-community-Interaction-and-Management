import React, { useState } from "react";
import "./Complaints.css";
import DisplayComplaints from "./DisplayComplaints";

function Body() {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async () => {
    if (!title || !description) {
      alert("Please fill all fields.");
      return;
    }

    const complaintData = { title, description };

    try {
      const response = await fetch("http://localhost:8080/complaints/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(complaintData),
      });

      if (!response.ok) throw new Error("Failed to create complaint");

      alert("Complaint created successfully!");
      setShowModal(false);
      setTitle("");
      setDescription("");
    } catch (error) {
      console.error(error);
      alert("Error submitting complaint.");
    }
  };

  return (
    <div className="resident-complaints-body">
      <h3>Resident Complaints</h3>
      <button className="resident-complaint-create-button" onClick={() => setShowModal(true)}>
        Create Complaint
      </button>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Create Complaint</h3>

            <label>Title:</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />

            <label>Description:</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} />

            <div className="button-group">
              <button className="req-submit-button" onClick={handleSubmit}>Submit</button>
              <button className="req-cancel-button" onClick={() => setShowModal(false)}>Cancel</button>
            </div>

          </div>
        </div>
      )}
      <DisplayComplaints></DisplayComplaints>
    </div>
  );
}

export default Body;
