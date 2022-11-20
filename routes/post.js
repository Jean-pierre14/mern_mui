import exp from 'express';
import {
    getFeedPosts, 
    getUserPosts, 
    likePost
} from "../controllers/posts";
import { verifyToken } from '../middleware/auth';

const router = exp.Router();

// Read

router.get('/', verifyToken, getFeedPosts);
router.get('/:userId/posts', verifyToken, getUserPosts);

/** Update */
router.patch('/:id/like', verifyToken, likePost);