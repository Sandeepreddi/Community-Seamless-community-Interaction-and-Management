import React, { useEffect, useState } from "react";
import './AdminParking.css';

const Body = () => {
  const [parkingLots, setParkingLots] = useState(0);
  const [cards, setCards] = useState([]);
  const [assignCard, setAssignCard] = useState(null);
  const [flatNo, setFlatNo] = useState("");
  const [block, setBlock] = useState("");
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

  const openCardForm = (card) => {
    setAssignCard(card);
    setFlatNo("");
    setBlock("");
  };

  const handleAssign = (e) => {
    e.preventDefault();
    const updatedCard = {
      ...assignCard,
      flatNo,
      block,
      status: "Occupied",
    };

    fetch(`http://localhost:8080/parking/update/${assignCard.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedCard),
    })
      .then((res) => res.json())
      .then((data) => {
        const updatedList = cards.map((c) => (c.parkingid === assignCard.parkingid ? data : c));
        setCards(updatedList.sort((a, b) => a.parkingid - b.parkingid));
        setAssignCard(null);
      });
  };

  const handleReset = (id) => {
    const card = cards.find((c) => c.parkingid === id);
    const resetCard = { ...card, flatNo: "", block: "", status: "Available" };

    fetch(`http://localhost:8080/parking/update/${card.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(resetCard),
    })
      .then((res) => res.json())
      .then((data) => {
        const updatedList = cards.map((c) => (c.parkingid === id ? data : c));
        setCards(updatedList.sort((a, b) => a.parkingid - b.parkingid));
      });
  };

  return (
    <div className="parking-table-container">
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

      <table className="parking-table">
        <thead>
          <tr>
            <th>Parking ID</th>
            <th>Status</th>
            <th>Flat No</th>
            <th>Block</th>
            <th>Actions</th>
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
                <td>{card.flatNo || "-"}</td>
                <td>{card.block || "-"}</td>
                <td>
                  {card.status === "Available" ? (
                    <button className="btn btn-assign" onClick={() => openCardForm(card)}>
                      Assign
                    </button>
                  ) : (
                    <>
                      <button className="btn btn-disabled" disabled>Assigned</button>
                      <button className="btn btn-reset" onClick={() => handleReset(card.parkingid)}>Reset</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {assignCard && (
        <div className="card-form-overlay">
          <div className="card-form">
            <h3>Assign Slot: {assignCard.parkingid}</h3>
            <form onSubmit={handleAssign}>
              <input
                type="text"
                placeholder="Flat No"
                value={flatNo}
                onChange={(e) => setFlatNo(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Block"
                value={block}
                onChange={(e) => setBlock(e.target.value)}
                required
              />
              <div className="form-buttons">
                <button type="submit" className="btn btn-assign">Submit</button>
                <button type="button" className="btn btn-reset" onClick={() => setAssignCard(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Body;
