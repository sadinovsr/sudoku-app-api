import express from 'express'
import { getHistory, addHistory, getHistoryInfo, updateHistory, deleteHistory } from '../controllers/historyController'

const router = express.Router();

router.get('/', getHistory);
router.post('/', addHistory);
router.get('/:historyId', getHistoryInfo);
router.patch('/:historyId', updateHistory);
router.delete('/:historyId', deleteHistory);

export default router;