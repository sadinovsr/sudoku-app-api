import { save, getAllSudoku, getSudokuById, getSudokuByDifficulty, updateSudokuById ,deleteSudokuById } from '../models/SudokuModel';
import { compareUserLevels } from '../helpers/compareUserLevels';
import { randomIntBetween } from '../helpers/randomIntBetween';
import { getHistoryByUserId } from '../models/HistoryModel';
import AppError from '../errors/AppError';

const addSudoku = async ( req, res, next ) => {
  try {
    if ( compareUserLevels( req.user.level, 'moderator') ) {
      const { body } = req;
      const sudoku = await save({
        difficulty: body.difficulty,
        sudoku: body.sudoku,
      });
      res.status(201).send({ payload: { message: 'Successfully added sudoku!', sudoku } });
    } else {
      throw new AppError( 'Only Admin or Moderator can add new sudoku!' );
    }
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

const getRandomizedSudokuByDifficulty = async ( req, res, next ) => {
  try {
    const sudoku = await getSudokuByDifficulty( req.params.difficulty );
    if ( sudoku ) {
      let sudokuIds = [];
      sudoku.forEach(obj => {
        sudokuIds.push(obj._id);
      });
      let max = sudoku.length - 1;
      const index = randomIntBetween(0, max);
      res.status(200).send({
        payload: sudoku[index]
      });
    } else {
      throw new AppError( 'Cannot find sudoku with given difficulty' );
    }
  } catch ( error ) {
    next( error instanceof AppError ? error : new AppError( error.message ) );
  }
}

const getAuthorizedRandomizedSudokuByDifficulty = async ( req, res, next ) => {
  try {
    if ( req.user ) {
      const sudoku = await getSudokuByDifficulty( req.params.difficulty );
      const userHistory = await getHistoryByUserId( req.user.id );
      if ( sudoku ) {
        let sudokuIds = [];
        let historySudokuIds = [];
        let availableSudokuIds = [];
        sudoku.forEach(obj => {
          sudokuIds.push(obj._id);
        });
        userHistory.forEach(obj => {
          historySudokuIds.push(obj.sudokuId);
        });
        for ( let i = 0; i < sudokuIds.length; i++ ) {
          let foundMatchingIds = false;
          for ( let j = 0; j < historySudokuIds.length; j++ ) {
            if ( String(sudokuIds[i]) === String(historySudokuIds[j]) ) {
              foundMatchingIds = true;
              break;
            }
          }
          if ( !foundMatchingIds ) {
            availableSudokuIds.push(sudokuIds[i]);
          }
        }
        let max = availableSudokuIds.length - 1;
        const index = randomIntBetween(0, max);
        const returnSudoku = await getSudokuById( availableSudokuIds[index] );
        res.status(200).send({
          payload: returnSudoku,
        });
      } else {
        throw new AppError( 'Cannot find sudoku with given difficulty' );
      }
    } else {
      throw new AppError( 'Cannot find user!' );
    }
  } catch ( error ) {
    next( error instanceof AppError ? error : new AppError( error.message ) );
  }
}

const updateSudoku = async ( req, res, next ) => {
  try {
    if ( compareUserLevels( req.user.level, 'moderator') ) {
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
    } else {
      throw new AppError( 'Only Admin or Moderator can update sudoku!' );
    }
  } catch ( error ) {
    next( error instanceof AppError ? error : new AppError( error.message ) );
  }
}

const deleteSudoku = async ( req, res, next ) => {
  try {
    if ( compareUserLevels( req.user.level, 'moderator') ) {
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
    } else {
      throw new AppError( 'Only Admin or Moderator can delete sudoku!' );
    }
  } catch ( error ) {
    next( error instanceof AppError ? error : new AppError( error.message ) );
  }
}

export { 
  addSudoku,
  getSudoku,
  getSudokuInfo,
  getAllSudokuByDifficulty,
  getRandomizedSudokuByDifficulty,
  getAuthorizedRandomizedSudokuByDifficulty,
  updateSudoku,
  deleteSudoku
}