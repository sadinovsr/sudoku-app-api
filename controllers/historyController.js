import { save, getAllHistory, getHistoryById, getHistoryByUserIdSudokuId, updateHistoryById, deleteHistoryById } from '../models/HistoryModel';
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
        throw new AppError( 'History entry not found' );
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

const updateHistory = async ( req, res, next ) => {
  try {
    const sudokuId = req.params.sudokuId;
    const { user } = req;
    const answer = req.body.answer;
    const history = await getHistoryByUserIdSudokuId( user.id, sudokuId );
    if ( !history ) {
      await save({
        userId: user.id,
        sudokuId,
        answer,
        time: 1
      });
      res.status(201).send({ payload: { message: 'Successfully added history entry!', history } });
    } else {
      const updatedHistory = await updateHistoryById( history.id, { answer } );
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

export { getHistory, addHistory, getHistoryInfo, findHistoryUserEntry, updateHistory, deleteHistory }