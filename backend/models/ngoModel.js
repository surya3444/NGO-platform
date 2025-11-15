import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const kycSchema = mongoose.Schema({
  accountHolderName: { type: String },
  accountNumber: { type: String },
  ifscCode: { type: String },
  documentType: { type: String },
  documentUrl: { type: String },
});

const ngoSchema = mongoose.Schema(
  {
    ngoName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    address: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
    },
    otpExpires: {
      type: Date,
    },
    kycStatus: {
      type: String,
      enum: ['None', 'Pending', 'Verified', 'Rejected'],
      default: 'None',
    },
    kycDetails: kycSchema,
    
    // --- ADD THIS FIELD ---
    totalWithdrawn: {
      type: Number,
      required: true,
      default: 0,
    },
    // --- END OF ADDITION ---
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
ngoSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare entered password with hashed password
ngoSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Ngo = mongoose.model('Ngo', ngoSchema);
export default Ngo;