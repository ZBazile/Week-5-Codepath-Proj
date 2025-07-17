import React from 'react';  
import './RecipeCard.css';

function RecipeCard({ recipe }) {
  const { title, image, readyInMinutes, servings } = recipe;

  return (
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
      </div>
    </div>
  );
}

export default RecipeCard;