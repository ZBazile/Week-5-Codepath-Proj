import React from 'react';  
import './RecipeCard.css';
import { Link } from 'react-router-dom'; // Import Link

function RecipeCard({ recipe }) {
  const { id, title, image, readyInMinutes, servings } = recipe;

  return (
    // Link to the detail page using the recipe ID
    <Link to={`/recipe/${id}`} className="recipe-card-link">
      <div className="recipe-card">
        <img src={image} alt={title} className="recipe-image" />
        <div className="recipe-info">
          <h3 className="recipe-title">{title}</h3>
          <p className="recipe-detail">
            <span role="img" aria-label="clock">⏰</span> Prep Time: {readyInMinutes} mins
          </p>
          <p className="recipe-detail">
            <span role="img" aria-label="servings">🍽️</span> Servings: {servings}
          </p>
          {/* You can add more details here that are shown on the dashboard */}
        </div>
      </div>
    </Link>
  );
}

export default RecipeCard;

