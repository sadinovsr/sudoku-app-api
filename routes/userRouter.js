import express from 'express'
import { getUsers, getUserInfo, updateUser, deleteUser } from '../controllers/userController'

const router = express.Router();

router.get('/', getUsers);
router.get('/self', getUserInfo);
router.patch('/:userId', updateUser);
router.delete('/:userId', deleteUser);

export default router;