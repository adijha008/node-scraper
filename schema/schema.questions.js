const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
     questionLink: { type: String },
     count: { type: Number, required: true },
     upvotes: { type: Number, required: true },
     answers: { type: Number, defaut: "" },
});


module.exports = mongoose.model("Question", questionSchema);