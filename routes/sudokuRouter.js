import express from 'express'
import { addSudoku, getSudoku, getSudokuInfo, getAllSudokuByDifficulty, getRandomizedSudokuByDifficulty, getAuthorizedRandomizedSudokuByDifficulty, updateSudoku, deleteSudoku } from '../controllers/sudokuController'
import authenticate from '../middlewares/authenticate';

const router = express.Router();

router.get('/', getSudoku);
router.post('/', authenticate, addSudoku);
router.get('/:sudokuId', getSudokuInfo);
router.get('/difficulty/:difficulty', getAllSudokuByDifficulty);
router.get('/random/difficulty/:difficulty', getRandomizedSudokuByDifficulty);
router.get('/random/auth/difficulty/:difficulty', authenticate, getAuthorizedRandomizedSudokuByDifficulty);
router.patch('/:sudokuId', authenticate, updateSudoku);
router.delete('/:sudokuId', authenticate, deleteSudoku);

export default router;