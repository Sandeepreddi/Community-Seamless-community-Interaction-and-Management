import React, { useEffect, useState } from "react";

const Body = () => {
  const [parkingLots, setParkingLots] = useState(0);
  const [cards, setCards] = useState([]);
  const [view, setView] = useState("all"); // all | available | occupied

  useEffect(() => {
    fetch("http://localhost:8080/static/get")
      .then((res) => res.json())
      .then((data) => setParkingLots(data.parkinglots))
      .catch((err) => console.error("Failed to load static data", err));
  }, []);

  useEffect(() => {
    if (parkingLots === 0) return;

    fetch("http://localhost:8080/parking/all")
      .then((res) => res.json())
      .then((data) => {
        if (data.length === 0) {
          const newCards = Array.from({ length: parkingLots }, (_, i) => ({
            parkingid: i + 1,
            flatNo: "",
            block: "",
            status: "Available",
          }));
          newCards.forEach((card) => {
            fetch("http://localhost:8080/parking/add", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(card),
            });
          });
          setCards(newCards);
        } else {
          const sortedData = [...data].sort((a, b) => a.parkingid - b.parkingid);
          setCards(sortedData);
        }
      });
  }, [parkingLots]);

  return (
    <div className="parking-table-container" style={{ width: '50%' }}>
      <div className="parking-buttons">
        <button
          className={`admin-btn-toggle ${view === "all" ? "active" : ""}`}
          onClick={() => setView("all")}
        >
          All
        </button>
        <button
          className={`admin-btn-toggle ${view === "available" ? "active" : ""}`}
          onClick={() => setView("available")}
        >
          Available
        </button>
        <button
          className={`admin-btn-toggle ${view === "occupied" ? "active" : ""}`}
          onClick={() => setView("occupied")}
        >
          Occupied
        </button>
      </div>

      <table className="parking-table" >
        <thead>
          <tr>
            <th>Parking ID</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {cards
            .filter((card) =>
              view === "available"
                ? card.status === "Available"
                : view === "occupied"
                ? card.status === "Occupied"
                : true
            )
            .map((card) => (
              <tr key={card.parkingid}>
                <td>{card.parkingid}</td>
                <td className={card.status === "Available" ? "status-available" : "status-assigned"}>
                  {card.status}
                </td>
                
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default Body;