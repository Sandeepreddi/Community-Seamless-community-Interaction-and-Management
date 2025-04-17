import React, { useEffect, useState } from 'react';
import ResidentCard from './ResidentCard';
import './ResidentHome.css';

function Body() {
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedCard, setExpandedCard] = useState(null);
  const [selectedBlock, setSelectedBlock] = useState('All');

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

  const handleCardClick = (index) => {
    setExpandedCard(expandedCard === index ? null : index);
  };

  // Get all unique blocks from flat numbers
  const getBlocks = () => {
    const blocks = new Set();
    residents.forEach(resident => {
      if (resident.flatNo && resident.flatNo.length > 0) {
        blocks.add(resident.flatNo.charAt(0).toUpperCase());
      }
    });
    return Array.from(blocks).sort();
  };

  // Filtered residents based on selected block
  const filteredResidents = selectedBlock === 'All'
    ? residents
    : residents.filter(resident =>
        resident.flatNo && resident.flatNo.charAt(0).toUpperCase() === selectedBlock
      );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="resident-card-body">
      <h4>Resident Dashboard</h4>

      {/* Filter Buttons */}
      <div className="filter-buttons">
        <button
          className={selectedBlock === 'All' ? 'active' : ''}
          onClick={() => setSelectedBlock('All')}
        >
          All
        </button>
        {getBlocks().map(block => (
          <button
            key={block}
            className={selectedBlock === block ? 'active' : ''}
            onClick={() => setSelectedBlock(block)}
          >
            Block {block}
          </button>
        ))}
      </div>

      {/* Resident Cards */}
      <div className="resident-list">
        {filteredResidents.map((resident, index) => (
          <ResidentCard
            key={index}
            name={resident.name}
            flat={resident.flatNo}
            phone={resident.phone_number}
            email={resident.email}
            expanded={expandedCard === index}
            onClick={() => handleCardClick(index)}
            societyName={resident.societyName}
            postal={resident.postal}
          />
        ))}
      </div>
    </div>
  );
}

export default Body;
