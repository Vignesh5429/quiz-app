const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  question: { 
    type: String,
    required: true,
  },
  options: {
    type: [String],
    required: true,
  },
  correctAnswer: {
    type: String,
    required: true,
  },
  explanation: {
    type: String,
  },
  topic: {
    type: String,
  },
  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
  }
}, { timestamps: true });

module.exports = mongoose.model("Question", questionSchema);