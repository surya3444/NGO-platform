import mongoose from 'mongoose';

const withdrawalRequestSchema = mongoose.Schema(
  {
    ngo: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Ngo',
    },
    ngoName: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    },
    // We copy the bank details so they are permanent,
    // even if the NGO changes their KYC later.
    bankDetails: {
      accountHolderName: { type: String },
      accountNumber: { type: String },
      ifscCode: { type: String },
    },
  },
  {
    timestamps: true,
  }
);

const WithdrawalRequest = mongoose.model(
  'WithdrawalRequest',
  withdrawalRequestSchema
);
export default WithdrawalRequest;