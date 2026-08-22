import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { getJwtSecret } from '../middlewares/authMiddleware.js';

const generateToken = (res, userId, role) => {
  const token = jwt.sign({ userId, role }, getJwtSecret(), {
    expiresIn: '30d',
  });

  const isProd = process.env.NODE_ENV === 'production';

  res.cookie('jwt', token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
};

const handleDailyLoginReward = async (user) => {
  const now = new Date();
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

  if (!user.lastLoginDate) {
    user.streak = 1;
    user.longestStreak = Math.max(user.longestStreak || 1, 1);
    user.gdgCoins = (user.gdgCoins || 0) + 1;
    user.lastLoginDate = today;

    await User.updateOne(
      { _id: user._id },
      { 
        $set: { 
          streak: 1, 
          longestStreak: user.longestStreak, 
          lastLoginDate: today 
        },
        $inc: { gdgCoins: 1 }
      }
    );
    return true;
  }

  const lastLogin = new Date(user.lastLoginDate);
  const lastLoginDay = new Date(Date.UTC(lastLogin.getUTCFullYear(), lastLogin.getUTCMonth(), lastLogin.getUTCDate()));
  
  const diffTime = today.getTime() - lastLoginDay.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    // Already visited today; ensure streak has a default value if missing
    if (!user.streak || user.streak < 1) {
      user.streak = 1;
      await User.updateOne({ _id: user._id }, { $set: { streak: 1 } });
    }
    return false;
  } else if (diffDays === 1) {
    // Consecutive day login - increment streak!
    user.streak = (user.streak || 0) + 1;
    user.longestStreak = Math.max(user.longestStreak || 1, user.streak);
    user.gdgCoins = (user.gdgCoins || 0) + 1;
    user.lastLoginDate = today;

    await User.updateOne(
      { _id: user._id },
      { 
        $set: { 
          streak: user.streak, 
          longestStreak: user.longestStreak, 
          lastLoginDate: today 
        },
        $inc: { gdgCoins: 1 }
      }
    );
    return true;
  } else {
    // Broken streak (more than 1 day missed) - reset streak to 1
    user.streak = 1;
    user.longestStreak = Math.max(user.longestStreak || 1, 1);
    user.gdgCoins = (user.gdgCoins || 0) + 1;
    user.lastLoginDate = today;

    await User.updateOne(
      { _id: user._id },
      { 
        $set: { 
          streak: 1, 
          longestStreak: user.longestStreak, 
          lastLoginDate: today 
        },
        $inc: { gdgCoins: 1 }
      }
    );
    return true;
  }
};

const formatUserResponse = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  gdgCoins: user.gdgCoins,
  streak: user.streak || 1,
  longestStreak: user.longestStreak || user.streak || 1,
  branch: user.branch,
  semester: user.semester,
  bio: user.bio || '',
  website: user.website || '',
});

export const register = async (req, res) => {
  try {
    const { name, email, password, phone, gender, enrollmentNumber, branch, semester } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
      gender,
      enrollmentNumber,
      branch,
      semester,
      streak: 1,
      longestStreak: 1,
      gdgCoins: 100,
      lastLoginDate: new Date(),
    });

    if (user) {
      generateToken(res, user._id, user.role);
      res.status(201).json({
        success: true,
        user: formatUserResponse(user),
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.comparePassword(password))) {
      await handleDailyLoginReward(user);
      generateToken(res, user._id, user.role);
      res.status(200).json({
        success: true,
        user: formatUserResponse(user),
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const logout = (req, res) => {
  const isProd = process.env.NODE_ENV === 'production';
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
  });
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (user) {
      await handleDailyLoginReward(user);
      res.status(200).json({ success: true, user: formatUserResponse(user) });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const googleAuth = async (req, res) => {
  try {
    const { accessToken } = req.body;

    if (!accessToken) {
      return res.status(400).json({ success: false, message: 'No access token provided' });
    }

    const googleResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (!googleResponse.ok) {
      return res.status(400).json({ success: false, message: 'Invalid Google Token' });
    }

    const userInfo = await googleResponse.json();
    const { name, email, sub: googleId, picture: photoURL } = userInfo;

    let user = await User.findOne({ email });

    if (user) {
      await handleDailyLoginReward(user);
      generateToken(res, user._id, user.role);
      res.status(200).json({
        success: true,
        user: formatUserResponse(user),
      });
    } else {
      // Create new user with default random password since they use Google
      const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      user = await User.create({
        name,
        email,
        password: randomPassword,
        phone: 'Not Provided',
        gender: 'Other',
        branch: 'OTHER',
        semester: '1',
        streak: 1,
        longestStreak: 1,
        gdgCoins: 100,
        lastLoginDate: new Date(),
      });

      generateToken(res, user._id, user.role);
      res.status(201).json({
        success: true,
        user: formatUserResponse(user),
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { bio, website } = req.body;
    const user = await User.findById(req.user.userId);
    
    if (user) {
      if (bio !== undefined) user.bio = bio;
      if (website !== undefined) user.website = website;
      
      const updatedUser = await user.save();
      res.status(200).json({
        success: true,
        user: formatUserResponse(updatedUser),
      });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
