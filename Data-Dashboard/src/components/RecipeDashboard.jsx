import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import RecipeCard from './RecipeCard'; // No need for .jsx extension here
import './RecipeDashboard.css';

// Access environment variable using import.meta.env
const API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY;
const BASE_URL = 'https://api.spoonacular.com/recipes/';

function RecipeDashboard() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [totalRecipes, setTotalRecipes] = useState(0);
  const [avgReadyTime, setAvgReadyTime] = useState(0);
  const [maxReadyTime, setMaxReadyTime] = useState(0);

  // Define available cuisines for the filter
  const cuisines = [
    '', // Empty string for "All"
    'African', 'Asian', 'American', 'British', 'Cajun', 'Caribbean',
    'Chinese', 'Eastern European', 'European', 'French', 'German',
    'Greek', 'Indian', 'Irish', 'Italian', 'Japanese', 'Jewish',
    'Korean', 'Latin American', 'Mediterranean', 'Mexican', 'Middle Eastern',
    'Nordic', 'Southern', 'Spanish', 'Thai', 'Vietnamese'
  ];

  const fetchRecipes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (!API_KEY) {
        throw new Error("Spoonacular API Key is not set. Please check your .env file.");
      }

      let url = `${BASE_URL}complexSearch?apiKey=${API_KEY}&number=20`; // Fetch more to allow for filtering
      if (searchQuery) {
        url += `&query=${searchQuery}`;
      }
      if (selectedCuisine) {
        url += `&cuisine=${selectedCuisine}`;
      }
      url += `&addRecipeInformation=true`; // Get more details like readyInMinutes, servings

      const response = await axios.get(url);
      const fetchedRecipes = response.data.results;
      setRecipes(fetchedRecipes);
      setTotalRecipes(fetchedRecipes.length);

      // Calculate summary statistics
      if (fetchedRecipes.length > 0) {
        const readyTimes = fetchedRecipes.map(recipe => recipe.readyInMinutes || 0).filter(time => time > 0);
        if (readyTimes.length > 0) {
          const sumReadyTime = readyTimes.reduce((acc, time) => acc + time, 0);
          setAvgReadyTime(Math.round(sumReadyTime / readyTimes.length));
          setMaxReadyTime(Math.max(...readyTimes));
        } else {
          setAvgReadyTime(0);
          setMaxReadyTime(0);
        }
      } else {
        setAvgReadyTime(0);
        setMaxReadyTime(0);
      }

    } catch (err) {
      console.error("Error fetching recipes:", err);
      setError(err.message || "Failed to fetch recipes. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedCuisine]);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  return (
    <div className="recipe-dashboard">
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

      {loading && <p>Loading recipes...</p>}
      {error && <p className="error-message">{error}</p>}

      {!loading && recipes.length === 0 && !error && (
        <p>No recipes found matching your criteria.</p>
      )}

      <div className="recipe-list">
        {!loading && recipes.length > 0 && recipes.map(recipe => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}

export default RecipeDashboard;