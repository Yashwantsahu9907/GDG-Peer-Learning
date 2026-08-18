import Bounty from '../models/Bounty.js';
import User from '../models/User.js';

export const getBounties = async (req, res) => {
  try {
    const bounties = await Bounty.find().populate('author', 'name gdgCoins').sort({ createdAt: -1 });
    res.status(200).json({ success: true, bounties });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createBounty = async (req, res) => {
  try {
    const { title, description, coins, tags } = req.body;
    
    // Check if user has enough coins
    const user = await User.findById(req.user.userId);
    if (user.gdgCoins < coins) {
      return res.status(400).json({ success: false, message: 'Not enough GDG coins' });
    }

    const bounty = await Bounty.create({
      title,
      description,
      coins,
      tags,
      author: req.user.userId,
    });

    // Deduct coins from author
    user.gdgCoins -= coins;
    await user.save();

    res.status(201).json({ success: true, bounty });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const resolveBounty = async (req, res) => {
  try {
    const { id } = req.params;
    const { solverId } = req.body;

    const bounty = await Bounty.findById(id);
    if (!bounty) return res.status(404).json({ success: false, message: 'Bounty not found' });
    
    if (bounty.author.toString() !== req.user.userId) {
      return res.status(403).json({ success: false, message: 'Not authorized to resolve this bounty' });
    }

    if (bounty.status === 'Solved') {
      return res.status(400).json({ success: false, message: 'Bounty already solved' });
    }

    bounty.status = 'Solved';
    bounty.solver = solverId;
    await bounty.save();

    // Add coins to solver
    const solver = await User.findById(solverId);
    if (solver) {
      solver.gdgCoins += bounty.coins;
      await solver.save();
    }

    res.status(200).json({ success: true, bounty });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getLeaderboard = async (req, res) => {
  try {
    const users = await User.find().sort({ gdgCoins: -1 }).select('name gdgCoins branch role').limit(100);
    res.status(200).json({ success: true, leaderboard: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
