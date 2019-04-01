import { getAllUsers, getUserByUsername, getUserByEmail, updateUserById, deleteUserById } from '../models/UserModel';
import { compareUserLevels } from '../helpers/compareUserLevels';
import AppError from '../errors/AppError';
import bcrypt from 'bcrypt';

const getUsers = async ( req, res, next ) => {
  try {
    if ( compareUserLevels( req.user.level, 'admin' ) ) {      
      const users = await getAllUsers();
      res.status(200).send({
        payload: users
      });
    } else {
      throw new AppError( 'Only admin or moderator can get all users' );
    }
  } catch ( error ) {
    next( error instanceof AppError ? error : new AppError(error.message) );
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
    const isAdmin = compareUserLevels( req.user.level, 'admin' );

    if ( (req.user.id).toString() === id || isAdmin ) {
      const { username, email, password, level } = req.body;
      let userUpdate = {};

      if ( password ) {
        const newPassword = await bcrypt.hash( password, parseInt( process.env.PASSWORD_HASHING_ROUNDS, 10 ) );
        userUpdate.password = newPassword;
      }
      if ( username ) {
        userUpdate.username = username;
      }
      if ( email ) {
        userUpdate.email = email;
      }
      if ( level && isAdmin ) {
        userUpdate.level = level;
      }
      const updatedUser = await updateUserById(id, userUpdate);
      if ( updatedUser ) {
        res.status(200).send({
          payload: updatedUser
        });
      } else {
        throw new AppError( 'User not found!' );
      }
    } else {
      throw new AppError( 'Only admin or user himself can update user information!' );
    }
  } catch ( error ) {
    next( error instanceof AppError ? error : new AppError( error.message ) );
  }
}

const deleteUser = async ( req, res, next ) => {
  try {
    const id = req.params.userId;
    if ( (req.user.id).toString() === id || compareUserLevels( req.user.level, 'admin' ) ) {
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
    } else {
      throw new AppError( 'Only admin or user himself can delete user information!' );
    }
  } catch ( error ) {
    next( error instanceof AppError ? error : new AppError( error.message) );
  }
}

export { getUsers, getUserInfo, updateUser, deleteUser }