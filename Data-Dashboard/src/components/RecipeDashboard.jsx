import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import RecipeCard from './RecipeCard'; // No need for .jsx extension here
import './RecipeDashboard.css';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts'; // Import Recharts components


function RecipeDashboard({ recipes, searchQuery }) { // Now receives recipes as a prop from App.jsx to make space here 
  // Prepare data for charts: Prep Time 
  const prepTimeData = recipes.reduce((acc, recipe) => {
    const time = recipe.readyInMinutes;
    if (time <= 15) acc['0-15 mins'] = (acc['0-15 mins'] || 0) + 1;
    else if (time <= 30) acc['16-30 mins'] = (acc['16-30 mins'] || 0) + 1;
    else if (time <= 45) acc['31-45 mins'] = (acc['31-45 mins'] || 0) + 1;
    else acc['45+ mins'] = (acc['45+ mins'] || 0) + 1;
    return acc;
  }, {});
  const chartPrepTimeData = Object.keys(prepTimeData).map(key => ({
    name: key,
    count: prepTimeData[key]
  }));

  // Prepare data for charts: Serving Size Distribution
  const servingsData = recipes.reduce((acc, recipe) => {
    const servings = recipe.servings;
    if (servings === 1) acc['1 serving'] = (acc['1 serving'] || 0) + 1;
    else if (servings >= 2 && servings <= 4) acc['2-4 servings'] = (acc['2-4 servings'] || 0) + 1;
    else if (servings >= 5 && servings <= 8) acc['5-8 servings'] = (acc['5-8 servings'] || 0) + 1;
    else if (servings > 8) acc['8+ servings'] = (acc['8+ servings'] || 0) + 1;
    return acc;
  }, {});
  const chartServingsData = Object.keys(servingsData).map(key => ({
    name: key,
    value: servingsData[key]
  }));

  const PIE_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']; // Colors for pie chart segments

  return (
    <div className="recipe-dashboard">
      <div className="chart-container">
        {/* for added search query  */}
        <h2>
          Recipe Insights 
          {searchQuery && <span className="search-query-display"> for "{searchQuery}"</span>}    
        </h2>
        <div className="charts-grid">
          <div className="chart-item">
            <h3>Preparation Time Distribution</h3>
            {chartPrepTimeData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartPrepTimeData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p>No data for preparation time chart.</p>
            )}
          </div>

          <div className="chart-item">
            <h3>Serving Size Distribution</h3>
            {chartServingsData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartServingsData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {chartServingsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p>No data for serving size chart.</p>
            )}
          </div>
        </div>
      </div>

      <div className="recipe-list">
        {recipes.length > 0 ? (
          recipes.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))
        ) : (
          <p>No recipes to display from dashboard.</p>
        )}
      </div>
    </div>
  );
}

export default RecipeDashboard;


