const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = Schema(
  {
    name: { type: String, trim: true, required: true },
    email: { type: String, trim: true, required: true },
    password: { type: String, trim: true, required: true },
    documentUrl: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
    isKycUpdated: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = userSchema;
