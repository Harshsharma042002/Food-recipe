import mongoose from "mongoose";

const RecipeSchema=new mongoose.Schema({
    name:{type:String,required:true},
    ingredients:[{type:String,required:true}],
    instructions:{type:String,required:true},
    cookingTime:{type:Number,required:true},
    userOwner:{type:mongoose.Schema.Types.ObjectId,ref:"users",required:true},
    image:{type:String}
});

export const RecipeModel=mongoose.model("recipe",RecipeSchema);