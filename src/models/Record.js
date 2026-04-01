import mongoose from 'mongoose';

const recordSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: [true, 'Please provide an amount'],
      min: [0, 'Amount must be greater than 0'],
    },
    type: {
      type: String,
      enum: {
        values: ['income', 'expense'],
        message: 'Type must be either "income" or "expense"',
      },
      required: [true, 'Please provide a type (income or expense)'],
    },
    category: {
      type: String,
      required: [true, 'Please provide a category'],
      trim: true,
    },
    date: {
      type: Date,
      default: Date.now,
      required: [true, 'Please provide a date'],
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Record must be created by a user'],
      validate: {
        validator: async (value) => {
          const userExists = await mongoose.model('User').exists({ _id: value });
          return !!userExists;
        },
        message: 'Invalid user reference for createdBy',
      },
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
recordSchema.index({ createdBy: 1, date: -1 });
recordSchema.index({ type: 1, date: -1 });
recordSchema.index({ category: 1 });
recordSchema.index({ date: -1 });

export const Record = mongoose.model('Record', recordSchema);
