import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    billId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bill',
      required: true,
    },
    amountPaid: {
      type: Number,
      required: true,
      min: 0.01,
    },
    method: {
      type: String,
      enum: ['cash', 'bank', 'mobile_money', 'other'],
      required: true,
    },
    referenceNo: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },
    paymentDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;
