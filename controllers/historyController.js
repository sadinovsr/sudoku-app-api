import { 
  save,
  getAllHistory,
  getHistoryById,
  getHistoryByUserIdSudokuId,
  getHistoryByUserIdCompleted,
  getHistoryByUserIdNotCompleted,
  getHistoryStartedCountByUserId,
  getHistoryCompletedCountByUserId,
  getHistoryUsedSolveCountByUserId,
  updateHistoryById,
  deleteHistoryById,
} from '../models/HistoryModel';
import { getSudokuById, getAllSudokuCount } from '../models/SudokuModel';
import { compareUserLevels } from '../helpers/compareUserLevels';
import AppError from '../errors/AppError';

const addHistory = async ( req, res, next ) => {
  try {
    const { body } = req;
    const history = await save({
      userId: req.user.id,
      sudokuId: body.sudokuId,
      answer: body.answer,
      time: body.time
    });
    res.status(201).send({ payload: { message: 'Successfully added history entry!', history } });
  } catch ( error ) {
    next( error instanceof AppError ? error : new AppError( error.message ) );
  }
}

const getHistory = async ( req, res, next ) => {
  try {
    if ( compareUserLevels( req.user.level, 'moderator') ) {
      const history = await getAllHistory();
      res.status(200).send({
        payload: history
      });
    } else {
      throw new AppError( 'Only Admin or Moderator can get all History entries!' );
    }
  } catch ( error ) {
    next( error instanceof AppError ? error : new AppError( error.message ) );
  }
}

const getHistoryInfo = async ( req, res, next ) => {
  try {
    const id = req.params.historyId;
    const history = await getHistoryById( id );
    if ( (req.user.id).toString() === history.userId || compareUserLevels( req.user.level, 'moderator' ) ) {
      if ( history ) {
        res.status(200).send({
          payload: history
        });
      } else {
        throw new AppError( 'History entry not found!' );
      }
    } else {
      throw new AppError( 'Only Admin/Moderator or history entry owner can see this information!' );
    }
  } catch ( error ) {
    next( error instanceof AppError ? error : new AppError( error.message ) );
  }
}

const findHistoryUserEntry = async ( req, res, next ) => {
  try {
    const userId = req.user.id;
    const sudokuId = req.params.sudokuId;
    if ( await getHistoryByUserIdSudokuId( userId, sudokuId ) ) {
      res.status(200).send({
        payload: { hasHistoryEntry: true }
      })
    } else {
      res.status(200).send({
        payload: { hasHistoryEntry: false }
      })
    }
  } catch ( error ) {
    next( new AppError( error.message ) );
  }
}

const getDividedUserHistory = async ( req, res, next ) => {
  try {
    const userId = req.user.id;
    const completedHistory = await getHistoryByUserIdCompleted( userId );
    const notCompletedHistory = await getHistoryByUserIdNotCompleted( userId );
    if ( completedHistory && notCompletedHistory ) {

      let newCompletedHistory = [];
      let newNotCompletedHistory = [];

      await Promise.all(completedHistory.map(async (entry) => {
        let sudoku = await getSudokuById(entry.sudokuId);
        newCompletedHistory.push({
          difficulty: sudoku.difficulty,
          id: entry.id,
          userId: entry.userId,
          sudokuId: entry.sudokuId,
          answer: entry.answer,
          time: entry.time,
          completed: entry.completed,
          usedSolve: entry.usedSolve
        });
      }));
      await Promise.all(notCompletedHistory.map(async (entry) => {
        let sudoku = await getSudokuById(entry.sudokuId);
        newNotCompletedHistory.push({
          difficulty: sudoku.difficulty,
          id: entry.id,
          userId: entry.userId,
          sudokuId: entry.sudokuId,
          answer: entry.answer,
          time: entry.time,
          completed: entry.completed,
          usedSolve: entry.usedSolve
        });
      }));

      res.status(200).send({
        payload: {
          completedHistory: newCompletedHistory,
          notCompletedHistory: newNotCompletedHistory,
        }
      })
    } else {
      throw new AppError( 'History entries not found!' );
    }
  } catch ( error ) {
    next( error instanceof AppError ? error : new AppError( error.message ) );
  }
}

const getUserHistoryStatistics = async ( req, res, next ) => {
  try {
    const { user } = req;
    if ( user ) {
      const doneCount = await getHistoryCompletedCountByUserId( user.id );
      const startedCount = await getHistoryStartedCountByUserId( user.id );
      const usedSolveCount = await getHistoryUsedSolveCountByUserId( user.id );
      const allSudokuCount = await getAllSudokuCount();
      res.status(200).send({
        payload: {
          doneCount,
          startedCount,
          usedSolveCount,
          allSudokuCount,
        }
      })
    } else {
      throw new AppError( 'User not found!' );
    }
  } catch ( error ) {
    next( error instanceof AppError ? error : new AppError( error.message ) );
  }
}

const updateHistory = async ( req, res, next ) => {
  try {
    const sudokuId = req.params.sudokuId;
    const { user } = req;
    const sudokuObject = req.body;
    const history = await getHistoryByUserIdSudokuId( user.id, sudokuId );
    if ( !history ) {
      await save({
        userId: user.id,
        sudokuId,
        answer: sudokuObject.answer,
        time: sudokuObject.time,
        usedSolve: sudokuObject.usedSolve,
        completed: sudokuObject.completed,
      });
      res.status(201).send({ payload: { message: 'Successfully added history entry!', history } });
    } else {
      const updatedHistory = await updateHistoryById( history.id, sudokuObject );
      if ( updatedHistory ) {
        res.status(200).send({
          payload: updatedHistory
        });
      } else {
        throw new AppError( 'History entry not found!' );
      }
    }
  } catch ( error ) {
    next( error instanceof AppError ? error : new AppError( error.message ) );
  }
}

const deleteHistory = async ( req, res, next ) => {
  try {
    if ( compareUserLevels( req.user.level, 'moderator' ) ) {
      const id = req.params.historyId;
      const deletedHistory = await deleteHistoryById( id );
      if ( deletedHistory ) {
        res.status(200).send({
          payload: {
            message: 'History entry succesfully deleted!'
          }
        });
      } else {
        throw new AppError( 'History entry not found!' );
      }
    } else {
      throw new AppError( 'Only Admin and Moderator can delete history entry!' );
    }
  } catch ( error ) {
    next( error instanceof AppError ? error : new AppError( error.message ) );
  }
}

export {
  getHistory,
  addHistory,
  getHistoryInfo,
  findHistoryUserEntry,
  getDividedUserHistory,
  getUserHistoryStatistics,
  updateHistory,
  deleteHistory
}