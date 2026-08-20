import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 8 },
  phone: { type: String, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  enrollmentNumber: { type: String },
  branch: { type: String, required: true },
  semester: { type: String, required: true },
  role: { type: String, enum: ['Student', 'Mentor', 'Admin'], default: 'Student' },
  gdgCoins: { type: Number, default: 100 },
  streak: { type: Number, default: 1 },
  longestStreak: { type: Number, default: 1 },
  bio: { type: String, default: '' },
  website: { type: String, default: '' },
  lastLoginDate: { type: Date },
}, { timestamps: true });

// Pre-save middleware to hash password
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Instance method to compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
