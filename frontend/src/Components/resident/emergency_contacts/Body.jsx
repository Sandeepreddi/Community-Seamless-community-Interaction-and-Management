import React, { useState, useEffect } from "react";
import "./ResidentEmergency.css"; // Import CSS

function Body() {
  const [contacts, setContacts] = useState([]);
  const [error, setError] = useState(null);

  // Fetch emergency contacts when the component mounts
  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await fetch("http://localhost:8080/emergency");
      if (!response.ok) {
        throw new Error("Failed to fetch contacts");
      }
      const data = await response.json();
      setContacts(data); // Store fetched contacts
    } catch (err) {
      setError(err.message || "Failed to load contacts");
    }
  };

  return (
    <div className="resident-emergency-body-container">
      <h2 className="title">Resident Emergency Contacts</h2>

      {error && <p className="resident-emergency-error-message">{error}</p>}

      {contacts.length > 0 ? (
        <ul className="resident-emergency-contact-list">
          {contacts.map((contact, index) => (
            <li key={index} className="resident-emergency-contact-item">
              <span className="resident-emergency-contact-name">{contact.name}</span>
              <span className="resident-emergency-contact-phone">{contact.phoneNumber}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="resident-emergency-no-contacts">No emergency contacts available</p>
      )}
    </div>
  );
}

export default Body;
