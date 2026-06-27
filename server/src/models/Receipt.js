import mongoose from 'mongoose';

const receiptSchema = new mongoose.Schema(
  {
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
      required: true,
      unique: true,
    },
    receiptNo: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    pdfPath: {
      type: String,
      default: null,
    },
    qrToken: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

const Receipt = mongoose.model('Receipt', receiptSchema);

export default Receipt;
