
import React from 'react';
import './DashboardControlsAndStats.css'; // New CSS file for this component

function DashboardControlsAndStats({
  searchQuery,
  setSearchQuery,
  selectedCuisine,
  setSelectedCuisine,
  totalRecipes,
  avgReadyTime,
  maxReadyTime,
  cuisines
}) {
  return (
    <div className="dashboard-controls-stats">
      <div className="controls">
        <input
          type="text"
          placeholder="Search recipes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-bar"
        />
        <select
          value={selectedCuisine}
          onChange={(e) => setSelectedCuisine(e.target.value)}
          className="cuisine-filter"
        >
          <option value="">All Cuisines</option>
          {cuisines.map((cuisine) => (
            <option key={cuisine} value={cuisine}>{cuisine || 'All'}</option>
          ))}
        </select>
      </div>

      <div className="summary-statistics">
        <h3>Summary Statistics</h3>
        <p>Total Recipes Displayed: {totalRecipes}</p>
        <p>Average Preparation Time: {avgReadyTime} minutes</p>
        <p>Longest Preparation Time: {maxReadyTime} minutes</p>
      </div>
    </div>
  );
}

export default DashboardControlsAndStats;