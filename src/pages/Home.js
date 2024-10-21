import React, { useEffect, useState } from 'react';
import '../Styles/Home.css';
import axios from 'axios';
import { useGetUserId } from '../hooks/useGetUserId';
import { useCookies } from 'react-cookie';

const Home = () => {
  const userID = useGetUserId();
  const [recipes, setRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [Cookies, _] = useCookies(["access_token"]);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get("http://localhost:3001/recipes");
        setRecipes(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchSavedRecipes = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/recipes/savedRecipes/ids/${userID}`);
        setSavedRecipes(response.data.savedRecipes);
      } catch (err) {
        console.log(err);
      }
    };

    fetchRecipes();
    fetchSavedRecipes();
  }, [userID, Cookies.access_token]); 

  const saveRecipe = async (recipeID) => {
    try {
      const response = await axios.put("http://localhost:3001/recipes", {
        recipeID,
        userID,
      }, { headers: { authorization: Cookies.access_token } });
      setSavedRecipes(response.data.savedRecipes);
    } catch (err) {
      console.log(err);
    }
  };

  const isRecipeSaved = (id) => savedRecipes.includes(id);

  return (
    <div className='home-container'>
      <h1 className='home-title'>Recipes</h1>
      <ul className='recipe-list'>
        {recipes.map((recipe) => (
          <li key={recipe._id} className='recipe-item'>
            <div className='recipe-header'>
              <h2 className='recipe-name'>{recipe.name}</h2>
              <button
                onClick={() => saveRecipe(recipe._id)}
                disabled={isRecipeSaved(recipe._id)}
                className={`save-button ${isRecipeSaved(recipe._id) ? 'saved' : ''}`}
              >
                {isRecipeSaved(recipe._id) ? "Saved" : "Save"}
              </button>
            </div>
            <div className='recipe-details'>
              <p className='recipe-instructions'>{recipe.instructions}</p>
            </div>
            <div className='recipe-details'>
              <p className='recipe-time'>Cooking Time: {recipe.cookingTime} minutes</p>
            </div>
            {recipe.image && (
              <div>
                <img src={`http://localhost:3001${recipe.image}`} alt={recipe.name} className="recipe-image" />
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
