import mongoose from 'mongoose';

const assessmentSchema = new mongoose.Schema(
  {
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
    },
    taxYear: {
      type: Number,
      required: true,
      min: 2000,
    },
    baseTax: {
      type: Number,
      required: true,
      min: 0,
    },
    penalty: {
      type: Number,
      default: 0,
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalDue: {
      type: Number,
      required: true,
      min: 0,
    },
    assessedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

assessmentSchema.index({ propertyId: 1, taxYear: 1 }, { unique: true });

const Assessment = mongoose.model('Assessment', assessmentSchema);

export default Assessment;
