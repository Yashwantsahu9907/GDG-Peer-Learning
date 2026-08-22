import User from '../models/User.js';

export const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await User.find({})
      .select('name role gdgCoins streak longestStreak')
      .sort({ gdgCoins: -1 })
      .limit(50);

    res.status(200).json({ success: true, leaderboard });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
