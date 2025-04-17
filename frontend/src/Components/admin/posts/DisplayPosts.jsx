import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import './Adminposts.css'

function DisplayPosts() {
  const [posts, setPosts] = useState([]);

  // Fetch posts from the backend
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch("http://localhost:8080/posts/all");
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      } else {
        console.error("Failed to fetch posts");
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  // Delete post
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      const response = await fetch(`http://localhost:8080/posts/delete/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setPosts(posts.filter((post) => post.id !== id)); // Remove from state
      } else {
        console.error("Failed to delete post");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <div>
          <h3 className="admin-posts-body-h4">Posts</h3>
          
          <div className="admin-posts-grid">
  {posts.length === 0 ? (
    <p className="no-posts-text">No posts available.</p>
  ) : (
    posts.map((post) => (
      <div key={post.id} className="post-card">
        <div className="post-image-wrapper">
          <img
            src={`data:image/jpeg;base64,${post.image}`}
            alt="Post"
            className="post-image"
          />
          <FaTrash
            className="delete-icon"
            onClick={() => handleDelete(post.id)}
            title="Delete Post"
          />
        </div>
        <div className="post-content">
          <h3 className="post-title">{post.name}</h3>
          <p className="post-date">{post.date}</p>
          <p className="post-description">{post.description}</p>
        </div>
      </div>
    ))
  )}
</div>

        
    </div>
  );
}

export default DisplayPosts;
