
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'; // Import useParams and Link
import axios from 'axios';
import './RecipeDetail.css'; // New CSS for detail view

function RecipeDetail({ API_KEY, BASE_URL }) {
  const { id } = useParams(); // Extract recipe ID from the URL
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!API_KEY) {
          throw new Error("Spoonacular API Key is not set. Please check your .env file.");
        }
        // Fetch full recipe information using the ID
        const response = await axios.get(`${BASE_URL}${id}/information?apiKey=${API_KEY}`);
        setRecipe(response.data);
      } catch (err) {
        console.error("Error fetching recipe details:", err);
        setError("Failed to load recipe details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipeDetails();
  }, [id, API_KEY, BASE_URL]); // Re-fetch when ID or API details change

  if (loading) return <p>Loading recipe details...</p>;
  if (error) return <p className="error-message">{error}</p>;
  if (!recipe) return <p>Recipe not found.</p>; // Should ideally not happen if ID is valid

  return (
    <div className="recipe-detail-view">
      <Link to="/" className="back-button">← Back to Dashboard</Link>
      <h2>{recipe.title}</h2>
      <img src={recipe.image} alt={recipe.title} className="detail-image" />
      
      <div className="detail-facts">
        <p><strong>Preparation Time:</strong> {recipe.readyInMinutes} minutes</p>
        <p><strong>Servings:</strong> {recipe.servings}</p>
        {recipe.diets && recipe.diets.length > 0 && <p><strong>Diets:</strong> {recipe.diets.join(', ')}</p>}
        {recipe.cuisines && recipe.cuisines.length > 0 && <p><strong>Cuisines:</strong> {recipe.cuisines.join(', ')}</p>}
        {recipe.dishTypes && recipe.dishTypes.length > 0 && <p><strong>Dish Types:</strong> {recipe.dishTypes.join(', ')}</p>}
        {recipe.sourceUrl && <p><strong>Source:</strong> <a href={recipe.sourceUrl} target="_blank" rel="noopener noreferrer">View Full Recipe</a></p>}
      </div>

      <div className="ingredients">
        <h3>Ingredients:</h3>
        <ul>
          {recipe.extendedIngredients && recipe.extendedIngredients.map(ingredient => (
            <li key={ingredient.id || ingredient.name}>{ingredient.original}</li>
          ))}
        </ul>
      </div>

      <div className="instructions">
        <h3>Instructions:</h3>
        {recipe.instructions ? (
          <div dangerouslySetInnerHTML={{ __html: recipe.instructions }} />
        ) : (
          <p>Instructions not available.</p>
        )}
      </div>

      {/* You can add more detailed info here, e.g., nutrition, summary, etc. */}
      {recipe.summary && (
        <div className="summary">
          <h3>Summary:</h3>
          <div dangerouslySetInnerHTML={{ __html: recipe.summary }} />
        </div>
      )}
    </div>
  );
}

export default RecipeDetail;