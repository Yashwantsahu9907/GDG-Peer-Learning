import express from 'express';
import { getBounties, createBounty, resolveBounty, getLeaderboard } from '../controllers/bountyController.js';
import { isAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/bounties', getBounties);
router.post('/bounties', isAuth, createBounty);
router.post('/bounties/:id/resolve', isAuth, resolveBounty);
router.get('/leaderboard', getLeaderboard);

export default router;
