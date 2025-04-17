import React, { useState } from "react";
import './Adminposts.css'
import DisplayPosts from "./DisplayPosts";

function Body() {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append("name", name);
    formData.append("date", date);
    formData.append("description", description);
    formData.append("image", image);

    try {
      const response = await fetch("http://localhost:8080/posts/create", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Post created successfully!");
        setName("");
        setDate("");
        setDescription("");
        setImage(null);
        setShowForm(false); // Hide form after submission
      } else {
        alert("Failed to create post");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Error creating post");
    }
  };

  return (
    <div className="admin-posts-body">
      <h4>Admin Posts</h4>
      <button className="add-event-btn" onClick={() => setShowForm(true)}>
        Create Post
      </button>
      
      

      {showForm && (
  <div className="admin-post-overlay">
    <form className="admin-post-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      ></textarea>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        required
      />
      <button type="submit">Submit</button>
      <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
    </form>
  </div>
)}

      <DisplayPosts></DisplayPosts>
    </div>
  );
}

export default Body;
