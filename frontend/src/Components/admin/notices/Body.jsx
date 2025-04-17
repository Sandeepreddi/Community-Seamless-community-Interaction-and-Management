import React, { useState } from "react";
import "./AdminNotice.css";

import DisplayNotice from './DisplayNotice'

function Body() {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!name || !description) {
      alert("Please fill all fields.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("date", date);
    formData.append("time", time);
    formData.append("description", description);
    if (image) formData.append("image", image);

    try {
      const response = await fetch("http://localhost:8080/notice/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to save notice");

      alert("Notice created successfully!");
      setShowModal(false);
      setName("");
      setDescription("");
      setImage(null);
      setPreview(null);
    } catch (error) {
      console.error(error);
      alert("Error submitting notice.");
    }
  };

  return (
    <div className="admin-notice-body">
      <h4>Admin Notice</h4>
      <button className="add-event-btn" onClick={() => setShowModal(true)}>
        Create Notice
      </button>
      
      <DisplayNotice />

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Create Notice</h3>

            <label>Name:</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />

            <label>Date:</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />

            <label>Time:</label>
            <input type="text" value={time} onChange={(e) => setTime(e.target.value)} />

            <label>Description:</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} />

            <label>Upload Image:</label>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            {preview && <img src={preview} alt="Preview" className="preview-img" />}

            <button className="admin-notice-submit-button" onClick={handleSubmit}>
              Submit
            </button>
            <button className="admin-notice-cancel-button" onClick={() => setShowModal(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Body;