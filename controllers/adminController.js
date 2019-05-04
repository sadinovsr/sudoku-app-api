import { getRegisteredUserCountLastWeek, getAllUsers } from '../models/UserModel';
import { getAllSudokuCount } from '../models/SudokuModel';
import { getAllHistoryCompletedCount, getAllHistoryUsedSolveCount } from '../models/HistoryModel';
import { compareUserLevels } from '../helpers/compareUserLevels';
import AppError from '../errors/AppError';

const getAdminDashboardData = async ( req, res ,next ) => {
  try {
    if ( compareUserLevels( req.user.level, 'admin' ) ) {
      let date = new Date();
      date.setDate( date.getDate() - 7 );
      const users = await getAllUsers();
      const sudokuCount = await getAllSudokuCount();
      const completedSudokuCount = await getAllHistoryCompletedCount();
      const usedSolveSudokuCount = await getAllHistoryUsedSolveCount();
      const lastWeekNewUserCount = await getRegisteredUserCountLastWeek( date );
      res.status(200).send({
        payload: {
          users,
          sudokuCount,
          completedSudokuCount,
          usedSolveSudokuCount,
          lastWeekNewUserCount,
        }
      })
    } else {
      throw new AppError('Only admin has access rights!');
    }
  } catch ( error ) {
    next( error instanceof AppError ? error : new AppError( error.message ) );
  }
}

export { getAdminDashboardData };