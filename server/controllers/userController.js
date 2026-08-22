import User from '../models/User.js';
import Notification from '../models/Notification.js';

// Search users with query
export const searchUsers = async (req, res) => {
  try {
    const query = req.query.q || '';
    const currentUserId = req.user?.userId;

    if (!query.trim()) {
      // Return popular or recent peers if query is empty
      const users = await User.find(currentUserId ? { _id: { $ne: currentUserId } } : {})
        .select('name email role branch semester bio skills followers following friends gdgCoins streak')
        .limit(20)
        .lean();

      const formatted = users.map(u => ({
        _id: u._id,
        name: u.name,
        email: u.email,
        username: `@${u.email.split('@')[0]}`,
        role: u.role,
        branch: u.branch,
        semester: u.semester,
        bio: u.bio || '',
        skills: u.skills || ['JavaScript', 'React'],
        followersCount: u.followers?.length || 0,
        followingCount: u.following?.length || 0,
        friendsCount: u.friends?.length || 0,
        isFollowing: currentUserId ? (u.followers || []).some(id => id.toString() === currentUserId) : false,
        isFriend: currentUserId ? (u.friends || []).some(id => id.toString() === currentUserId) : false,
        streak: u.streak || 1,
        gdgCoins: u.gdgCoins || 100
      }));

      return res.status(200).json({ success: true, users: formatted });
    }

    const regex = new RegExp(query, 'i');
    const users = await User.find({
      $and: [
        currentUserId ? { _id: { $ne: currentUserId } } : {},
        {
          $or: [
            { name: regex },
            { email: regex },
            { branch: regex },
            { bio: regex },
            { skills: { $in: [regex] } }
          ]
        }
      ]
    })
      .select('name email role branch semester bio skills followers following friends gdgCoins streak')
      .limit(30)
      .lean();

    const formatted = users.map(u => ({
      _id: u._id,
      name: u.name,
      email: u.email,
      username: `@${u.email.split('@')[0]}`,
      role: u.role,
      branch: u.branch,
      semester: u.semester,
      bio: u.bio || '',
      skills: u.skills || [],
      followersCount: u.followers?.length || 0,
      followingCount: u.following?.length || 0,
      friendsCount: u.friends?.length || 0,
      isFollowing: currentUserId ? (u.followers || []).some(id => id.toString() === currentUserId) : false,
      isFriend: currentUserId ? (u.friends || []).some(id => id.toString() === currentUserId) : false,
      streak: u.streak || 1,
      gdgCoins: u.gdgCoins || 100
    }));

    res.status(200).json({ success: true, users: formatted });
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get User Profile by ID
export const getUserProfile = async (req, res) => {
  try {
    const targetUserId = req.params.id === 'me' ? req.user?.userId : req.params.id;
    const currentUserId = req.user?.userId;

    if (!targetUserId) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }

    const user = await User.findById(targetUserId).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const isOwnProfile = currentUserId && currentUserId === user._id.toString();
    const isFollowing = currentUserId && !isOwnProfile 
      ? (user.followers || []).some(id => id.toString() === currentUserId) 
      : false;
    const isFriend = currentUserId && !isOwnProfile 
      ? (user.friends || []).some(id => id.toString() === currentUserId) 
      : false;

    // Build rich profile structure
    const profile = {
      _id: user._id,
      isOwnProfile,
      isFollowing,
      isFriend,
      basicInfo: {
        name: user.name,
        username: `@${user.email.split('@')[0]}`,
        email: user.email,
        bio: user.bio || 'Peer learner and developer.',
        college: user.college || 'Engineering Institute',
        department: user.branch || 'CSE',
        year: `Semester ${user.semester || '1'}`,
        location: user.location || 'India',
        website: user.website || '',
        github: user.github || '',
        twitter: user.twitter || '',
        linkedin: user.linkedin || ''
      },
      stats: {
        followers: user.followers?.length || 0,
        following: user.following?.length || 0,
        friends: user.friends?.length || 0,
        gdgCoins: user.gdgCoins || 100,
        streak: user.streak || 1,
        longestStreak: user.longestStreak || 1,
        peersHelped: (user.followers?.length || 0) * 2 + 5,
        teachingSessions: 8,
        learningSessions: 14,
        projects: 4,
        reputation: 4.9,
        reviews: 12,
        hoursLearned: 64
      },
      skills: user.skills && user.skills.length > 0 ? user.skills : ['JavaScript', 'React', 'Node.js', 'Python'],
      teaching: user.teachingSkills && user.teachingSkills.length > 0 ? user.teachingSkills : [
        { skill: 'React', proficiency: 'Advanced', sessions: 8, endorsements: 12 },
        { skill: 'JavaScript', proficiency: 'Advanced', sessions: 14, endorsements: 18 }
      ],
      learning: user.learningSkills && user.learningSkills.length > 0 ? user.learningSkills : [
        { skill: 'Kubernetes', priority: 'High Priority', progress: 65 },
        { skill: 'Rust', priority: 'High Priority', progress: 40 }
      ],
      learningGoals: [
        { title: 'Master Distributed Systems', description: 'Build high-scale fault-tolerant services.', progress: 65, target: '2026' }
      ],
      recentSessions: [
        { topic: 'React System Architecture', role: 'Mentor', peer: 'Peer Dev', date: 'Recent', duration: '45 min', rating: 5 }
      ],
      achievements: [
        'Community Peer', 'Active Learner', `${user.streak || 1} Day Streak`
      ],
      availability: {
        types: ['Pair Programming', 'Mentoring', 'Collab Rooms'],
        time: 'Flexible'
      }
    };

    res.status(200).json({ success: true, profile });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Follow / Unfollow Toggle
export const toggleFollow = async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const currentUserId = req.user.userId;

    if (targetUserId === currentUserId) {
      return res.status(400).json({ success: false, message: 'You cannot follow yourself' });
    }

    const targetUser = await User.findById(targetUserId);
    const currentUser = await User.findById(currentUserId);

    if (!targetUser || !currentUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const isAlreadyFollowing = (targetUser.followers || []).some(id => id.toString() === currentUserId);

    if (isAlreadyFollowing) {
      // Unfollow
      targetUser.followers = (targetUser.followers || []).filter(id => id.toString() !== currentUserId);
      currentUser.following = (currentUser.following || []).filter(id => id.toString() !== targetUserId);
      await targetUser.save();
      await currentUser.save();

      return res.status(200).json({
        success: true,
        isFollowing: false,
        followersCount: targetUser.followers.length,
        message: `Unfollowed ${targetUser.name}`
      });
    } else {
      // Follow
      if (!targetUser.followers) targetUser.followers = [];
      if (!currentUser.following) currentUser.following = [];

      targetUser.followers.push(currentUserId);
      currentUser.following.push(targetUserId);
      await targetUser.save();
      await currentUser.save();

      // Create Notification for Target User
      try {
        await Notification.create({
          recipientId: targetUserId,
          senderId: currentUserId,
          type: 'FOLLOW',
          message: `${currentUser.name} started following you!`,
          link: `/profile/${currentUserId}`
        });
      } catch (notifErr) {
        console.warn('Follow notification creation failed:', notifErr.message);
      }

      return res.status(200).json({
        success: true,
        isFollowing: true,
        followersCount: targetUser.followers.length,
        message: `You are now following ${targetUser.name}`
      });
    }
  } catch (error) {
    console.error('Error toggling follow:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add Friend / Remove Friend Toggle
export const toggleFriend = async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const currentUserId = req.user.userId;

    if (targetUserId === currentUserId) {
      return res.status(400).json({ success: false, message: 'You cannot be friends with yourself' });
    }

    const targetUser = await User.findById(targetUserId);
    const currentUser = await User.findById(currentUserId);

    if (!targetUser || !currentUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const isAlreadyFriend = (currentUser.friends || []).some(id => id.toString() === targetUserId);

    if (isAlreadyFriend) {
      // Remove Friend
      currentUser.friends = (currentUser.friends || []).filter(id => id.toString() !== targetUserId);
      targetUser.friends = (targetUser.friends || []).filter(id => id.toString() !== currentUserId);
      await currentUser.save();
      await targetUser.save();

      return res.status(200).json({
        success: true,
        isFriend: false,
        friendsCount: currentUser.friends.length,
        message: `Removed ${targetUser.name} from friends`
      });
    } else {
      // Add Friend
      if (!currentUser.friends) currentUser.friends = [];
      if (!targetUser.friends) targetUser.friends = [];

      currentUser.friends.push(targetUserId);
      targetUser.friends.push(currentUserId);

      // Auto-follow each other when becoming friends
      if (!currentUser.following.some(id => id.toString() === targetUserId)) currentUser.following.push(targetUserId);
      if (!targetUser.followers.some(id => id.toString() === currentUserId)) targetUser.followers.push(currentUserId);
      if (!targetUser.following.some(id => id.toString() === currentUserId)) targetUser.following.push(currentUserId);
      if (!currentUser.followers.some(id => id.toString() === targetUserId)) currentUser.followers.push(targetUserId);

      await currentUser.save();
      await targetUser.save();

      try {
        await Notification.create({
          recipientId: targetUserId,
          senderId: currentUserId,
          type: 'FOLLOW',
          message: `${currentUser.name} connected with you as a friend!`,
          link: `/profile/${currentUserId}`
        });
      } catch (notifErr) {
        console.warn('Friend notification creation failed:', notifErr.message);
      }

      return res.status(200).json({
        success: true,
        isFriend: true,
        friendsCount: currentUser.friends.length,
        message: `Added ${targetUser.name} as a friend!`
      });
    }
  } catch (error) {
    console.error('Error toggling friend:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get List of Followers for a user
export const getFollowers = async (req, res) => {
  try {
    const targetUserId = req.params.id === 'me' ? req.user.userId : req.params.id;
    const currentUserId = req.user?.userId;

    const user = await User.findById(targetUserId).populate('followers', 'name email role branch semester bio skills followers friends streak gdgCoins');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const followers = (user.followers || []).map(f => ({
      _id: f._id,
      name: f.name,
      email: f.email,
      username: `@${f.email.split('@')[0]}`,
      role: f.role,
      branch: f.branch,
      semester: f.semester,
      bio: f.bio || '',
      skills: f.skills || [],
      isFollowing: currentUserId ? (f.followers || []).some(id => id.toString() === currentUserId) : false,
      isFriend: currentUserId ? (f.friends || []).some(id => id.toString() === currentUserId) : false
    }));

    res.status(200).json({ success: true, followers });
  } catch (error) {
    console.error('Error getting followers:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get List of Following for a user
export const getFollowing = async (req, res) => {
  try {
    const targetUserId = req.params.id === 'me' ? req.user.userId : req.params.id;
    const currentUserId = req.user?.userId;

    const user = await User.findById(targetUserId).populate('following', 'name email role branch semester bio skills followers friends streak gdgCoins');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const following = (user.following || []).map(f => ({
      _id: f._id,
      name: f.name,
      email: f.email,
      username: `@${f.email.split('@')[0]}`,
      role: f.role,
      branch: f.branch,
      semester: f.semester,
      bio: f.bio || '',
      skills: f.skills || [],
      isFollowing: true,
      isFriend: currentUserId ? (f.friends || []).some(id => id.toString() === currentUserId) : false
    }));

    res.status(200).json({ success: true, following });
  } catch (error) {
    console.error('Error getting following:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get List of Friends for a user
export const getFriends = async (req, res) => {
  try {
    const targetUserId = req.params.id === 'me' ? req.user.userId : req.params.id;
    const currentUserId = req.user?.userId;

    const user = await User.findById(targetUserId).populate('friends', 'name email role branch semester bio skills followers friends streak gdgCoins');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const friends = (user.friends || []).map(f => ({
      _id: f._id,
      name: f.name,
      email: f.email,
      username: `@${f.email.split('@')[0]}`,
      role: f.role,
      branch: f.branch,
      semester: f.semester,
      bio: f.bio || '',
      skills: f.skills || [],
      isFollowing: currentUserId ? (f.followers || []).some(id => id.toString() === currentUserId) : false,
      isFriend: true
    }));

    res.status(200).json({ success: true, friends });
  } catch (error) {
    console.error('Error getting friends:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Profile
export const updateProfile = async (req, res) => {
  try {
    const { bio, website, github, linkedin, twitter, location, college, skills, teachingSkills, learningSkills } = req.body;
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (bio !== undefined) user.bio = bio;
    if (website !== undefined) user.website = website;
    if (github !== undefined) user.github = github;
    if (linkedin !== undefined) user.linkedin = linkedin;
    if (twitter !== undefined) user.twitter = twitter;
    if (location !== undefined) user.location = location;
    if (college !== undefined) user.college = college;
    if (skills !== undefined) user.skills = skills;
    if (teachingSkills !== undefined) user.teachingSkills = teachingSkills;
    if (learningSkills !== undefined) user.learningSkills = learningSkills;

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        bio: updatedUser.bio,
        website: updatedUser.website,
        github: updatedUser.github,
        linkedin: updatedUser.linkedin,
        twitter: updatedUser.twitter,
        location: updatedUser.location,
        college: updatedUser.college,
        skills: updatedUser.skills
      }
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
