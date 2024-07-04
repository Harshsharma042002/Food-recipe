import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { userRouter } from "./routes/users.js";
import { recipesRouter } from "./routes/recipes.js";

mongoose.connect("mongodb://localhost:27017/recipes", { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();

app.use(express.json());
app.use(cors());
app.use("/auth", userRouter);
app.use("/recipes", recipesRouter);
app.use('/images', express.static('images')); 

app.listen(3001, () => {
  console.log("Server running on port 3001");
});

