import mongoose from 'mongoose';

const taxRateSchema = new mongoose.Schema(
  {
    zone: {
      type: String,
      required: [true, 'Zone is required'],
      trim: true,
    },
    propertyType: {
      type: String,
      required: [true, 'Property type is required'],
      trim: true,
    },
    taxYear: {
      type: Number,
      required: [true, 'Tax year is required'],
      min: 2000,
    },
    rateType: {
      type: String,
      enum: ['fixed', 'percentage'],
      required: [true, 'Rate type is required'],
    },
    rateValue: {
      type: Number,
      required: [true, 'Rate value is required'],
      min: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

taxRateSchema.index({ zone: 1, propertyType: 1, taxYear: 1 }, { unique: true });

const TaxRate = mongoose.model('TaxRate', taxRateSchema);

export default TaxRate;
