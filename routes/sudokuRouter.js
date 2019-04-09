import express from 'express'
import { addSudoku, getSudoku, getSudokuInfo, getAllSudokuByDifficulty, getRandomizedSudokuByDifficulty, updateSudoku, deleteSudoku } from '../controllers/sudokuController'

const router = express.Router();

router.get('/', getSudoku);
router.post('/', addSudoku);
router.get('/:sudokuId', getSudokuInfo);
router.get('/difficulty/:difficulty', getAllSudokuByDifficulty);
router.get('/random/difficulty/:difficulty', getRandomizedSudokuByDifficulty);
router.patch('/:sudokuId', updateSudoku);
router.delete('/:sudokuId', deleteSudoku);

export default router;