import React, { useEffect, useState } from "react";
import './Residentposts.css'

function Body() {
  const [posts, setPosts] = useState([]);

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
  return (
    <div className="resident-posts-container">
          <h3 className="resident-posts-body-h4">Posts</h3>
          
          <div className="resident-posts-grid">
              {posts.length === 0 ? (
                <p className="no-posts-text">No posts available.</p>
              ) : (
                posts.map((post) => (
                  <div key={post.id} className="resident-post-card">
                    <div className="resident-post-image-wrapper">
                      <img
                        src={`data:image/jpeg;base64,${post.image}`}
                        alt="Post"
                        className="resident-post-image"
                      />
                      
                    </div>
                    <div className="resident-post-content">
                      <h3 className="resident-post-title">{post.name}</h3>
                      <p className="resident-post-date">{post.date}</p>
                      <p className="resident-post-description">{post.description}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

        
    </div>
  );
}

export default Body;