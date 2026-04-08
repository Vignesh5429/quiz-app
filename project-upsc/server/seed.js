const mongoose = require("mongoose");
const Question = require("./models/question");
require("dotenv").config();

const questions = require("./questions.json");

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Connected");

  // clears old data
//await Question.deleteMany({});//use only if u want to clear old data

await Question.insertMany(questions);

    console.log("Data inserted");
    process.exit();
  })
  .catch(err => console.log(err));