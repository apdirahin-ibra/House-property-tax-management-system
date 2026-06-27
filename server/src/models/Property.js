import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Owner',
      required: [true, 'Owner is required'],
    },
    propertyCode: {
      type: String,
      required: [true, 'Property code is required'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    district: {
      type: String,
      required: [true, 'District is required'],
      trim: true,
    },
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
    sizeSqm: {
      type: Number,
      min: 0,
      default: null,
    },
    assessedValue: {
      type: Number,
      required: [true, 'Assessed value is required'],
      min: 0,
    },
    usageStatus: {
      type: String,
      enum: ['occupied', 'vacant', 'rented'],
      default: 'occupied',
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
  },
  { timestamps: true }
);

propertySchema.index({ zone: 1, propertyType: 1, status: 1 });

const Property = mongoose.model('Property', propertySchema);

export default Property;
