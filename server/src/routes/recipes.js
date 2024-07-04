import express from "express";
import multer from 'multer';
import path from 'path';
import { RecipeModel } from "../models/Recipes.js";
import { UserModel } from "../models/Users.js";
import { verifyToken } from "./users.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

router.get("/", async (req, res) => {
  try {
    const recipes = await RecipeModel.find({});
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", verifyToken, upload.single('image'), async (req, res) => {
  try {
    const { name, ingredients, instructions, cookingTime, userOwner } = req.body;
    const parsedIngredients = JSON.parse(ingredients);
    const recipe = new RecipeModel({
      name,
      ingredients: parsedIngredients,
      instructions,
      cookingTime,
      userOwner,
      image: req.file ? `/images/${req.file.filename}` : null
    });
    const response = await recipe.save();
    res.json(response);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put("/", verifyToken, async (req, res) => {
  try {
    const { recipeID, userID } = req.body;
    const recipe = await RecipeModel.findById(recipeID);
    const user = await UserModel.findById(userID);

    if (!recipe || !user) {
      return res.status(404).json({ error: "Recipe or User not found" });
    }

    user.savedRecipes.push(recipe);
    await user.save();
    res.json({ savedRecipes: user.savedRecipes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/savedRecipes/ids/:userID", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userID);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ savedRecipes: user.savedRecipes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/savedRecipes/:userID", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userID);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const savedRecipes = await RecipeModel.find({
      _id: { $in: user.savedRecipes },
    });

    res.json({ savedRecipes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/upload", verifyToken, upload.single('image'), (req, res) => {
  try {
    res.json({ filePath: `/images/${req.file.filename}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export { router as recipesRouter };
