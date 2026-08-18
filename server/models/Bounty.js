import mongoose from 'mongoose';

const bountySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  coins: { type: Number, required: true },
  tags: [{ type: String }],
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['Open', 'In Progress', 'Solved'], default: 'Open' },
  solver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

const Bounty = mongoose.model('Bounty', bountySchema);
export default Bounty;
