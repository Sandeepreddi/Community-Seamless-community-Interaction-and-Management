import React, { useEffect, useState } from "react";
import "./AdminHome.css"; // Import the CSS file

const Body = () => {
  const [blocks, setBlocks] = useState(0);
  const [flats, setFlats] = useState(0);
  const [occupied, setOccupied] = useState(0); // Example static value
  const [parkinglots, setParkinglots] = useState(0); // Example static value
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/static/get")
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        const fetchedBlocks = data.blocks;
        const parkingLots=data.parkinglots;
        setBlocks(fetchedBlocks);
        setFlats(fetchedBlocks * 20);
        setOccupied(residents.length);
        setParkinglots(parkingLots);
      })
      .catch(error => {
        console.error("Error fetching blocks:", error);
      });
  }, []);

  useEffect(() => {
      fetch('http://localhost:8080/residents')
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch residents');
          }
          return response.json();
        })
        .then(data => {
          setResidents(data);
          setLoading(false);
        })
        .catch(error => {
          setError(error.message);
          setLoading(false);
        });
    }, []);

  const cards = [
    { value: blocks, text: "Total no of Blocks", color: "green", icon: "🏢" },
    { value: flats, text: "Total no of Flats", color: "blue", icon: "🏠" },
    { value: occupied, text: "Total no of Flats Occupied", color: "purple", icon: "🏛️" },
    { value: parkinglots, text: "Total parking lots Available", color: "orange", icon: "👥" }
  ];

  return (
    <div className="dashboard-container">
      {cards.map((card, index) => (
        <div key={index} className={`card ${card.color}`}>
          <h1 style={{fontSize : "18px"}}>{card.value}</h1>
          <p style={{fontSize : "12px"}}>{card.text}</p>
          <span style={{fontSize : "18px"}}>{card.icon}</span>
        </div>
      ))}
    </div>
  );
};

export default Body;
