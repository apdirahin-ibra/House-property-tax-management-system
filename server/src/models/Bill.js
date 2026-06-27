import mongoose from 'mongoose';

const billSchema = new mongoose.Schema(
  {
    assessmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assessment',
      required: true,
    },
    billNo: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    amountDue: {
      type: Number,
      required: true,
      min: 0,
    },
    amountPaid: {
      type: Number,
      default: 0,
      min: 0,
    },
    balance: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['unpaid', 'partial', 'paid', 'overdue', 'cancelled'],
      default: 'unpaid',
    },
    issuedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

billSchema.index({ status: 1, dueDate: 1 });

const Bill = mongoose.model('Bill', billSchema);

export default Bill;
