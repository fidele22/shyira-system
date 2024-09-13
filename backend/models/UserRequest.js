const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'StockItems', required: true },
  itemName: { type: String },
  quantityRequested: { type: Number, default: 0 },
  quantityReceived: { type: Number },
  observation: { type: String },
});

const UserRequestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  department: { type: String, required: true },
  items: [itemSchema],
  hodName: { type: String, required: true },
  hodSignature: { type: String },
  clicked: { type: Boolean, default: false },  //display new request word before click
  date:{type:Date},
  status: {
    type: String,
    enum: ['pending', 'verified', 'approved', 'rejected'], // Enum to limit status values
    default: 'pending', // Default status is 'pending'
  },
  createdAt: {
      type: Date,
      default: Date.now
    },

});

// Pre save middleware to set quantityReceived to quantityRequested if not provided
UserRequestSchema.pre('save', function(next) {
  this.items.forEach(item => {
    if (item.quantityReceived === undefined || item.quantityReceived === null) {
      item.quantityReceived = item.quantityRequested;
    }
  });
  next();
});

module.exports = mongoose.model('UserRequest', UserRequestSchema);
