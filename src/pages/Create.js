import React, { useState } from 'react';
import axios from 'axios';
import { useGetUserId } from '../hooks/useGetUserId';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import '../Styles/Create.css'
const Create = () => {
  const userID = useGetUserId();
  const [Cookies, _] = useCookies(["access_token"]);
  const [recipe, setRecipe] = useState({
    name: "",
    ingredients: [],
    instructions: "",
    cookingTime: 0,
    userOwner: userID,
  });
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setRecipe({ ...recipe, [name]: value });
  };

  const handleIngredientChange = (event, idx) => {
    const { value } = event.target;
    const ingredients = [...recipe.ingredients];
    ingredients[idx] = value;
    setRecipe({ ...recipe, ingredients });
  };

  const addIngredient = () => {
    setRecipe({ ...recipe, ingredients: [...recipe.ingredients, ""] });
  };

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("name", recipe.name);
    formData.append("ingredients", JSON.stringify(recipe.ingredients));
    formData.append("instructions", recipe.instructions);
    formData.append("cookingTime", recipe.cookingTime);
    formData.append("userOwner", recipe.userOwner);
    formData.append("image", image);

    try {
      await axios.post("http://localhost:3001/recipes", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: Cookies.access_token,
        },
      });
      alert("Recipe created");
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className='create-recipe'>
      <h2>Create Recipe</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor='name'>Name</label>
        <input type='text' id='name' name='name' onChange={handleChange} />

        <label htmlFor='ingredients'>Ingredients</label>
        {recipe.ingredients.map((ingredient, idx) => (
          <input
            key={idx}
            type='text'
            name='ingredients'
            value={ingredient}
            onChange={(event) => handleIngredientChange(event, idx)}
          />
        ))}
        <button type='button' onClick={addIngredient}>Add Ingredient</button>

        <label htmlFor='instructions'>Instructions</label>
        <textarea id='instructions' name='instructions' onChange={handleChange}></textarea>

        <label htmlFor='cookingTime'>Cooking Time (minutes)</label>
        <input type='number' id='cookingTime' name='cookingTime' onChange={handleChange} />

        <label htmlFor='image'>Upload Image</label>
        <input type='file' id='image' name='image' onChange={handleImageChange} />

        <button type='submit'>Create Recipe</button>
      </form>
    </div>
  );
};

export default Create;

