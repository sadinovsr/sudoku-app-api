import { save, getAllSudoku, getSudokuById, getSudokuByDifficulty, updateSudokuById ,deleteSudokuById } from '../models/SudokuModel';
import AppError from '../errors/AppError';

const addSudoku = async ( req, res, next ) => {
  try {
    const { body } = req;
    const sudoku = await save({
      difficulty: body.difficulty,
      sudoku: body.sudoku,
    });
    res.status(201).send({ payload: { message: 'Successfully added sudoku!', sudoku } });
    return;
  } catch ( error ) {
    next( error instanceof AppError ? error : new AppError( error.message ) );
  }
}

const getSudoku = async ( req, res, next ) => {
  try {
    const sudoku = await getAllSudoku();
    res.status(200).send({
      payload: sudoku
    });
  } catch ( error ) {
    next( new AppError( error.message ) );
  }
}

const getSudokuInfo = async ( req, res, next ) => {
  try {
    const id = req.params.sudokuId;
    const sudoku = await getSudokuById( id );
    if ( sudoku ) {
      res.status(200).send({
        payload: sudoku
      });
    } else {
      throw new AppError( 'Sudoku not found' );
    }
  } catch ( error ) {
    next( error instanceof AppError ? error : new AppError( error.message ) );
  }
}

const getAllSudokuByDifficulty = async ( req, res, next ) => {
  try {
    const difficulty = req.params.difficulty;
    const sudoku = await getSudokuByDifficulty( difficulty );
    if ( sudoku ) {
      res.status(200).send({
        payload: sudoku
      });
    } else {
      throw new AppError( 'Cannot find sudoku with given difficulty' );
    }
  } catch ( error ) {
    next( error instanceof AppError ? error : new AppError( error.message ) );
  }
}

const updateSudoku = async ( req, res, next ) => {
  try {
    const id = req.params.sudokuId;
    const body = { ...req.body };
    const updatedSudoku = await updateSudokuById( id, body );
    if ( updatedSudoku ) {
      res.status(200).send({
        payload: updatedSudoku
      });
    } else {
      throw new AppError( 'Sudoku not found!' );
    }
  } catch ( error ) {
    next( error instanceof AppError ? error : new AppError( error.message ) );
  }
}

const deleteSudoku = async ( req, res, next ) => {
  try {
    const id = req.params.sudokuId;
    const deletedSudoku = await deleteSudokuById( id );
    if ( deletedSudoku ) {
      res.status(200).send({
        payload: {
          message: 'Sudoku succesfully deleted!'
        }
      });
    } else {
      throw new AppError( 'Sudoku not found!' );
    }
  } catch ( error ) {
    next( error instanceof AppError ? error : new AppError( error.message ) );
  }
}

export { addSudoku, getSudoku, getSudokuInfo, getAllSudokuByDifficulty, updateSudoku, deleteSudoku }