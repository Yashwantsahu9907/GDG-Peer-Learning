import express from 'express';
import { 
  searchUsers, 
  getUserProfile, 
  toggleFollow, 
  toggleFriend, 
  getFollowers, 
  getFollowing, 
  getFriends, 
  updateProfile 
} from '../controllers/userController.js';
import { isAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Search users (authenticated or public)
router.get('/search', (req, res, next) => {
  // Try isAuth optional middleware
  try {
    if (req.cookies?.jwt) {
      return isAuth(req, res, next);
    }
  } catch (e) {}
  next();
}, searchUsers);

// Profile
router.get('/:id', (req, res, next) => {
  try {
    if (req.cookies?.jwt) {
      return isAuth(req, res, next);
    }
  } catch (e) {}
  next();
}, getUserProfile);

router.put('/profile/update', isAuth, updateProfile);

// Social Actions
router.post('/:id/follow', isAuth, toggleFollow);
router.post('/:id/friend', isAuth, toggleFriend);

// Lists
router.get('/:id/followers', (req, res, next) => {
  try {
    if (req.cookies?.jwt) {
      return isAuth(req, res, next);
    }
  } catch (e) {}
  next();
}, getFollowers);

router.get('/:id/following', (req, res, next) => {
  try {
    if (req.cookies?.jwt) {
      return isAuth(req, res, next);
    }
  } catch (e) {}
  next();
}, getFollowing);

router.get('/:id/friends', (req, res, next) => {
  try {
    if (req.cookies?.jwt) {
      return isAuth(req, res, next);
    }
  } catch (e) {}
  next();
}, getFriends);

export default router;
