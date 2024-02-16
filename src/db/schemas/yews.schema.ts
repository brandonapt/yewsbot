import mongoose, { Schema } from "mongoose";

const articleSchema = new Schema({
    title: String,
    contents: String,
});

const yewsSchema = new Schema({
    date: String,
    articles: [articleSchema]
});

export default mongoose.model("YewsArticles", yewsSchema);