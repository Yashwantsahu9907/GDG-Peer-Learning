import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 8 },
  phone: { type: String, default: 'Not Provided' },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], default: 'Other' },
  enrollmentNumber: { type: String, default: '' },
  branch: { type: String, default: 'CSE' },
  semester: { type: String, default: '1' },
  role: { type: String, enum: ['Student', 'Mentor', 'Admin'], default: 'Student' },
  gdgCoins: { type: Number, default: 100 },
  streak: { type: Number, default: 1 },
  longestStreak: { type: Number, default: 1 },
  bio: { type: String, default: 'Peer learner & developer at GDGPeer' },
  website: { type: String, default: '' },
  github: { type: String, default: '' },
  linkedin: { type: String, default: '' },
  twitter: { type: String, default: '' },
  location: { type: String, default: 'India' },
  college: { type: String, default: 'University' },
  skills: [{ type: String }],
  teachingSkills: [{
    skill: String,
    proficiency: { type: String, default: 'Intermediate' },
    sessions: { type: Number, default: 0 },
    endorsements: { type: Number, default: 0 }
  }],
  learningSkills: [{
    skill: String,
    priority: { type: String, default: 'High Priority' },
    progress: { type: Number, default: 20 }
  }],
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  friendRequests: [{
    from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
    createdAt: { type: Date, default: Date.now }
  }],
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
