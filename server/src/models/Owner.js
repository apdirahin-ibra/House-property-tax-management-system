import mongoose from 'mongoose';

const ownerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone is required'],
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      default: null,
    },
    nationalId: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
    },
  },
  { timestamps: true }
);

const Owner = mongoose.model('Owner', ownerSchema);

export default Owner;
