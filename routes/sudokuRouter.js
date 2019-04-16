import express from 'express'
import { addSudoku, getSudoku, getSudokuInfo, getAllSudokuByDifficulty, getRandomizedSudokuByDifficulty, updateSudoku, deleteSudoku } from '../controllers/sudokuController'
import authenticate from '../middlewares/authenticate';

const router = express.Router();

router.get('/', getSudoku);
router.post('/', authenticate, addSudoku);
router.get('/:sudokuId', getSudokuInfo);
router.get('/difficulty/:difficulty', getAllSudokuByDifficulty);
router.get('/random/difficulty/:difficulty', getRandomizedSudokuByDifficulty);
router.patch('/:sudokuId', authenticate, updateSudoku);
router.delete('/:sudokuId', authenticate, deleteSudoku);

export default router;