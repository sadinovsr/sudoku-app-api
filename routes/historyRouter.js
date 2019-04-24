import express from 'express'
import { getHistory, addHistory, getHistoryInfo, findHistoryUserEntry, getDividedUserHistory, updateHistory, deleteHistory } from '../controllers/historyController'

const router = express.Router();

router.get('/', getHistory);
router.post('/', addHistory);
router.get('/divided', getDividedUserHistory);
router.get('/:historyId', getHistoryInfo);
router.patch('/:sudokuId', updateHistory);
router.delete('/:historyId', deleteHistory);
router.get('/sudoku/:sudokuId', findHistoryUserEntry);

export default router;