const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'StockItems', required: true },  
  itemName: { type: String, required: true },
  quantityRequested: { type: Number, required: true },
  price: { type: Number, required: true },
  totalAmount: { type: Number, required: true }
});

const LogisticItemRejectedSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  supplierName: { type: String, required: true },
  items: [ItemSchema],
  logisticSignature: { type: String }
});

const LogisticItemRejected = mongoose.model('LogisticItemRejected', LogisticItemRejectedSchema);

module.exports = LogisticItemRejected;
