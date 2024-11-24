// models/Car.js
const mongoose = require('mongoose');

const carDataSchema = new mongoose.Schema({
  registerNumber: { type: String, required: true },
  kilometersCovered: { type: Number, required: true },
  remainingLiters:{type: Number,required:true }
});

const CarData = mongoose.model('CarData', carDataSchema);

module.exports = CarData;