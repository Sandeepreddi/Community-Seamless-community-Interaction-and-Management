import React from 'react';
import './ResidentHome.css';
import { FiUser, FiPhone, FiMail, FiHome, FiMapPin, FiGlobe } from 'react-icons/fi';

function ResidentCard({
  name,
  flat,
  phone,
  email,
  expanded,
  onClick,
  societyName,
  postal
}) {
  return (
    <div className={`resident-card ${expanded ? 'expanded' : ''}`} onClick={onClick}>
      <div className="card-content">
        <div className="main-info">
          <h3><FiUser /> {name}</h3>
          <p>
            {expanded ? 'Flat: ' : <FiHome />} {flat}
          </p>
          <p>
            {expanded ? 'Phone: ' : <FiPhone />} {phone}
          </p>
          <p>
            {expanded ? 'Email: ' : <FiMail />} {email}
          </p>
        </div>
        
        {expanded && (
          <div className="additional-details">
            <h3>Society Details</h3>
            <p>
              Society: {societyName}
            </p>
            <p>
              Postal Code: {postal}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResidentCard;