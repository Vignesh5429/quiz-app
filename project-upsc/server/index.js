const express = require("express");
const mongoose = require("mongoose");
const Question = require("./models/question");
const cors = require("cors");
require("dotenv").config();


const app = express();

app.use(cors());   // ✅ ADD THIS
app.use(express.json());

// 🔍 Debug: check if ENV is loading
console.log("ENV CHECK:", process.env.MONGO_URI);

// 🔥 MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => {
    console.error("MongoDB Connection Error ❌");
    console.error(err.message);
    require("dotenv").config({ path: "./.env" });
  });

// Routes

app.get("/questions", async (req, res) => {
  try {
    const { topic, search } = req.query;

    let filter = {};

    if (topic) {
      filter.topic = topic;
    }

    if (search) {
      filter.question = { $regex: search, $options: "i" };
    }

    const questions = await Question.find(filter);
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get("/quiz", async (req, res) => {
  try {
    const { topic } = req.query;

    const total = await Question.countDocuments({ topic });

    const size = total >= 10 ? 10 : total;

    const questions = await Question.aggregate([
      { $match: { topic } },
      { $sample: { size } }
    ]);

    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.post("/submit", async (req, res) => {
  try {
    const { answers } = req.body;

    let score = 0;

    for (let item of answers) {
      const question = await Question.findById(item.questionId);

      if (question && question.correctAnswer === item.selectedAnswer) {
        score++;
      }
    }

    res.json({
      score,
      total: answers.length
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.post("/add-question", async (req, res) => {
  try {
    const newQuestion = new Question(req.body);
    await newQuestion.save();
    res.json({ message: "Question saved ✅" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Server start
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});