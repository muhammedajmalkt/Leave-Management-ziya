import express from 'express';
import { createLeaveRequest, getLeaveRequest, approveLeaveRequest, rejectLeaveRequest, getLeavesByUser, getAllLeaveRequests } from '../controllers/leaveController.js';
import verifyToken from '../middlewares/verifyToken.js';
import { asyncErrorhandler } from '../middlewares/asyncErrorhandler.js';

const router = express.Router();

router.post('/', asyncErrorhandler(createLeaveRequest));
router.get('/:id',  asyncErrorhandler(getLeaveRequest));
router.put('/:id/approve', verifyToken,asyncErrorhandler( approveLeaveRequest));
router.put('/:id/reject', verifyToken, asyncErrorhandler(rejectLeaveRequest));
router.get('/user/:userId',  asyncErrorhandler(getLeavesByUser));
router.get('/',  asyncErrorhandler(getAllLeaveRequests));



export default router;