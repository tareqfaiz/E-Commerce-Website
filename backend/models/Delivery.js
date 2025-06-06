const mongoose = require('mongoose');

const deliverySchema = mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Order',
    },
    deliveryStatus: {
      type: String,
      required: true,
      default: 'Pending',
    },
    deliveryDate: {
      type: Date,
    },
    deliveryAddress: {
      type: String,
      required: true,
    },
    deliveryPerson: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Delivery = mongoose.model('Delivery', deliverySchema);

module.exports = Delivery;
