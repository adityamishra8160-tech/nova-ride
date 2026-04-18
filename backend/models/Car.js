// =============================================
// Car Model
// =============================================
const mongoose = require('mongoose');

const carSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    pricePerKm: {
      type: Number,
      required: true,
    },
    availability: {
      type: Boolean,
      default: true,
    },
    image: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      default: 'Sedan',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Car', carSchema);
