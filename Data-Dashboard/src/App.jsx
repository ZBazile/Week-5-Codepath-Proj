import { useState, useEffect, useCallback } from 'react';
import { Routes, Route } from 'react-router-dom'; // Import Routes +  Route
import axios from 'axios';
import RecipeDashboard from './components/RecipeDashboard';
import RecipeDetail from './components/RecipeDetail'; // create this component later 
import DashboardControlsAndStats from './components/DashboardControlsAndStats'; // Import new component
import './App.css'

const API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY;
const BASE_URL = 'https://api.spoonacular.com/recipes/';


// Define my available cuisines from part 1
const cuisines = [
  '', 'African', 'Asian', 'American', 'British', 'Cajun', 'Caribbean',
  'Chinese', 'Eastern European', 'European', 'French', 'German',
  'Greek', 'Indian', 'Irish', 'Italian', 'Japanese', 'Jewish',
  'Korean', 'Latin American', 'Mediterranean', 'Mexican', 'Middle Eastern',
  'Nordic', 'Southern', 'Spanish', 'Thai', 'Vietnamese'
];




function App() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [totalRecipes, setTotalRecipes] = useState(0);
  const [avgReadyTime, setAvgReadyTime] = useState(0);
  const [maxReadyTime, setMaxReadyTime] = useState(0);

  const fetchRecipes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (!API_KEY) {
        throw new Error("Spoonacular API Key is not set. Please check your .env file.");
      }

      let url = `${BASE_URL}complexSearch?apiKey=${API_KEY}&number=20`; // Fetch more recipes to ensure variety for charts/filters
      if (searchQuery) {
        url += `&query=${searchQuery}`;
      }
      if (selectedCuisine) {
        url += `&cuisine=${selectedCuisine}`;
      }
      url += `&addRecipeInformation=true`; // Get more details like readyInMinutes, servings immediately

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
    <div className="App">
      <header className="App-header">
        <h1> International Recipes Dashboard</h1>
      </header>

      {/* Render controls and stats consistently */}
      <DashboardControlsAndStats
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCuisine={selectedCuisine}
        setSelectedCuisine={setSelectedCuisine}
        totalRecipes={totalRecipes}
        avgReadyTime={avgReadyTime}
        maxReadyTime={maxReadyTime}
        cuisines={cuisines}
      />

      <main>
        {/* Conditionals  for loading/error messages if API hits the lmit */}
        {loading && <p>Loading recipes...</p>}
        {error && <p className="error-message">{error}</p>}
        {!loading && recipes.length === 0 && !error && (
          <p>No recipes found matching your criteria.</p>
        )}
        
        {/* Defining routes */}
        <Routes>
          {/* Dashboards View */}
          <Route path="/" element={<RecipeDashboard recipes={recipes} searchQuery={searchQuery} />} />
          {/* Detail View - :id is a URL parameter */}
          <Route path="/recipe/:id" element={<RecipeDetail API_KEY={API_KEY} BASE_URL={BASE_URL} />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
