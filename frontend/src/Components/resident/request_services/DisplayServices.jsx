import React, { useEffect, useState } from "react";
import "./ResidentServices.css";

function DisplayServices() {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch("http://localhost:8080/service/all");
      if (!response.ok) throw new Error("Failed to fetch services");
      const data = await response.json();
      setServices(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/service/delete/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete service");
      setServices(services.filter((service) => service.id !== id));
      alert("Service deleted successfully!");
      if (selectedService?.id === id) {
        setSelectedService(null);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="resident-service-list">
      <h3>Service Requests</h3>

      {services.length === 0 ? (
        <p>No services found.</p>
      ) : (
        <ul style={{ padding: "0px" }}>
          {services.map((service) => (
            <li key={service.id} className="resident-service-item">
              <div>
                <strong>{service.name}</strong> - {service.service}
              </div>
              <div className="resident-service-buttons">
                <button
                  className="resident-services-view-button"
                  onClick={() => setSelectedService(service)}
                >
                  View
                </button>
                <button
                  className="resident-services-delete-button"
                  onClick={() => handleDelete(service.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Popup Modal */}
      {selectedService && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h4>{selectedService.name}</h4>
            <p><strong>Flat No:</strong> {selectedService.address}</p>
            <p><strong>Service:</strong> {selectedService.service}</p>
            <p><strong>Phone NO:</strong> {selectedService.phoneNumber}</p>
            <p><strong>Additional Notes:</strong> {selectedService.additionalNotes}</p>

            <button
              onClick={() => setSelectedService(null)}
              className="close-card-button"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DisplayServices;
