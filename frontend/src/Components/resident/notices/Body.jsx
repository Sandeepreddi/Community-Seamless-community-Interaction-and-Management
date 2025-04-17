import React, { useState, useEffect } from 'react';
import './DisplayNotice.css'; // We'll create this CSS file

function DisplayNotice() {
  const [notices, setNotices] = useState([]);

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
      console.error("Error fetching notices:", error);
    }
  };

  return (
    <div className="resident-notice-container">
      <h3 >Notices</h3>
      <div className=" resident-notices-grid">
        {notices.length > 0 ? (
          notices.map((notice) => (
            <div key={notice.id} className="resident-notice-card">
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
            </div>
          ))
        ) : (
          <p>No notices available.</p>
        )}
      </div>
    </div>
  );
}

export default DisplayNotice;