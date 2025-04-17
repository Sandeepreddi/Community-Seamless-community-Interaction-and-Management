import React, { useState, useEffect } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import "./AdminNotice.css";

function DisplayNotice() {
  const [notices, setNotices] = useState([]);
  const [editingNotice, setEditingNotice] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const response = await fetch("http://localhost:8080/notice");
      if (!response.ok) throw new Error("Failed to fetch notices");
      const data = await response.json();
      setNotices(data);
    } catch (error) {
      console.error(error);
      alert("Error fetching notices.");
    }
  };

  const handleEditClick = (notice) => {
    setEditingNotice(notice);
    setName(notice.name);
    setDate(notice.date);
    setTime(notice.time);
    setDescription(notice.description);
    setPreview(notice.imageBase64 ? `data:image/png;base64,${notice.imageBase64}` : null);
    setShowModal(true);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async () => {
    if (!name || !description) {
      alert("Please fill all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("date", date);
    formData.append("time", time);
    formData.append("description", description);
    if (image) formData.append("image", image);

    try {
      const response = await fetch(`http://localhost:8080/notice/update/${editingNotice.id}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to update notice");

      alert("Notice updated successfully!");
      setShowModal(false);
      fetchNotices();
      resetForm();
    } catch (error) {
      console.error(error);
      alert("Error updating notice.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this notice?")) return;

    try {
      const response = await fetch(`http://localhost:8080/notice/delete/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete notice");

      alert("Notice deleted successfully!");
      fetchNotices();
    } catch (error) {
      console.error(error);
      alert("Error deleting notice.");
    }
  };

  const resetForm = () => {
    setEditingNotice(null);
    setName("");
    setDate("");
    setTime("");
    setDescription("");
    setImage(null);
    setPreview(null);
  };

  return (
    <div >
      <h3 className="admin-notices-body-h4">Notices</h3>
      <div className=" admin-notices-grid">
        {notices.length > 0 ? (
          notices.map((notice) => (
            <div key={notice.id} className="notice-card">
              {notice.imageBase64 && (
                <img 
                  src={`data:image/png;base64,${notice.imageBase64}`} 
                  alt="Notice" 
                  className="notice-img" 
                />
              )}
              <h4>{notice.name}</h4>
              <p><strong>Date:</strong> {notice.date}</p>
              <p><strong>Time:</strong> {notice.time}</p>
              <p>{notice.description}</p>

              <div className="icon-container">
                <FaEdit 
                  className="edit-icon" 
                  onClick={() => handleEditClick(notice)} 
                />
                <FaTrash 
                  className="delete-icon" 
                  onClick={() => handleDelete(notice.id)} 
                />
              </div>
            </div>
          ))
        ) : (
          <p>No notices available.</p>
        )}
      </div>

      {/* Edit Modal */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Edit Notice</h3>

            <label>Name:</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
            />

            <label>Date:</label>
            <input 
              type="date" 
              value={date} 
              onChange={(e) => setDate(e.target.value)} 
            />

            <label>Time:</label>
            <input 
              type="text" 
              value={time} 
              onChange={(e) => setTime(e.target.value)} 
            />

            <label>Description:</label>
            <textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
            />

            <label>Update Image:</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageUpload} 
            />
            {preview && <img src={preview} alt="Preview" className="preview-img" />}

            <button className="submit-button" onClick={handleUpdate}>
              Update
            </button>
            <button 
              className="cancel-button" 
              onClick={() => {
                setShowModal(false);
                resetForm();
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DisplayNotice;