import { getAllUsers, updateUserById, deleteUserById } from '../models/UserModel';
import AppError from '../errors/AppError';

const getUsers = async ( req, res, next ) => {
  try {
    const users = await getAllUsers();
    res.status(200).send({
      payload: users
    });
  } catch ( error ) {
    next( new AppError( error.message ) );
  }
}

const getUserInfo = async ( req, res ) => {
  const { user } = req;
  res.status(200).send({
    payload: user
  });
}

const updateUser = async ( req, res, next ) => {
  try {
    const id = req.params.userId;
    const body = { ...req.body };
    const updatedUser = await updateUserById(id, body);
    if ( updatedUser ) {
      res.status(200).send({
        payload: updatedUser
      });
    } else {
      throw new AppError( 'User not found!' );
    }
  } catch ( error ) {
    next( error instanceof AppError ? error : new AppError(error.message) );
  }
}

const deleteUser = async ( req, res, next ) => {
  try {
    const id = req.params.userId;
    const deletedUser = await deleteUserById( id );
    if ( deletedUser ) {
      res.status(200).send({
        payload: {
          message: 'User succesfully deleted!'
        }
      });
    } else {
      throw new AppError( 'User not found!' );
    }
  } catch ( error ) {
    next( error instanceof AppError ? error : new AppError(error.message) );
  }
}

export { getUsers, getUserInfo, updateUser, deleteUser }