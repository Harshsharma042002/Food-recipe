import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useGetUserId } from '../hooks/useGetUserId';
import '../Styles/Saved.css'; 

const Saved = () => {
  const userID = useGetUserId();
  const [savedRecipes, setSavedRecipes] = useState([]);

  useEffect(() => {
    const fetchSavedRecipes = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/recipes/savedRecipes/${userID}`
        );
        setSavedRecipes(response.data.savedRecipes);
      } catch (err) {
        console.log(err);
      }
    };
    fetchSavedRecipes();
  }, [userID]);

  return (
    <div className='saved-recipes'> 
      <h1 className='saved-recipes-title'>Saved Recipes</h1> 
      <ul className='saved-recipes-list'> 
        {savedRecipes.map((recipe) => (
          <li key={recipe._id} className='saved-recipe-item'>
            <div>
              <h2 className='recipe-name'>{recipe.name}</h2> 
            </div>
            {recipe.image && <img src={`http://localhost:3001${recipe.image}`} alt={recipe.name} className='recipe-image' />} {/* Apply image class */}
            <div className='recipe-instructions'>
              <p>{recipe.instructions}</p> 
            </div>
            <div>
              <p className='recipe-cooking-time'>Cooking Time: {recipe.cookingTime} minutes</p> 
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Saved;

