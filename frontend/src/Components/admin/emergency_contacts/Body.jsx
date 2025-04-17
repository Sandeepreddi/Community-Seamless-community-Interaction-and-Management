import React, { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import "./AdminEmergency.css"; // Import external CSS


function Body() {
  const [contacts, setContacts] = useState([]);
  const [name, setName] = useState("");
  const [phoneNumber, setPhone] = useState("");
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch contacts when the component mounts
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

  const addContact = async () => {
    if (!name.trim() || !phoneNumber.trim()) {
      setError("Both fields are required!");
      return;
    }

    const newContact = { name, phoneNumber };

    try {
      setIsSubmitting(true);
      setError(null);

      const response = await fetch("http://localhost:8080/emergency", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newContact),
      });

      if (!response.ok) {
        throw new Error("Failed to add contact");
      }

      const savedContact = await response.json();
      setContacts([...contacts, savedContact]); // Add new contact to the list
      setName("");
      setPhone("");
    } catch (err) {
      setError(err.message || "Something went wrong!");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete contact function
  const deleteContact = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/emergency/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete contact");
      }

      // Remove contact from state after successful deletion
      setContacts(contacts.filter(contact => contact.id !== id));
    } catch (err) {
      setError(err.message || "Failed to delete contact");
    }
  };

  return (
    <div className="body-container">
      <h2>Admin Emergency</h2>

      {error && <p className="error-message">{error}</p>}

      <div className="input-container">
        <input
          type="text"
          placeholder="Enter Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input-field"
        />
        <input
          type="text"
          placeholder="Enter Phone No"
          value={phoneNumber}
          onChange={(e) => setPhone(e.target.value)}
          className="input-field"
        />
        <button onClick={addContact} className="add-button" disabled={isSubmitting}>
          {isSubmitting ? "Adding..." : "Add Contact"}
        </button>
      </div>

      <h3>Emergency Contacts</h3>
      <ul className="contact-list">
        {contacts.length > 0 ? (
          contacts.map((contact) => (
            <li key={contact.id} className="contact-item">
              <strong>{contact.name}</strong> - {contact.phoneNumber}
              <FaTrash className="delete-button" onClick={() => deleteContact(contact.id)}/>
              
            </li>
          ))
        ) : (
          <p>No contacts available</p>
        )}
      </ul>
    </div>
  );
}

export default Body;
