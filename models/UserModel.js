import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema(
  {
    username: { type: String, trim: true, unique: true, required: true },
    email: { type: String, trim: true, unique: true, required: true },
    password: { type: String, trim: true, required: true },
    level: { type: String, trim: true, required: true, enum: ['user', 'moderator', 'admin'], default: 'user' }
  },
  {
    timestamps: true
  }
);

userSchema.pre('save', async function callback(next) {
  if( this.password ) {
    this.password = await bcrypt.hash(
      this.password,
      parseInt( process.env.PASSWORD_HASHING_ROUNDS, 10 )
    );
  }
  next();
});

const UserModel = mongoose.model('User', userSchema);

const save = async user => new UserModel(user).save();
const comparePassword = async ({ givenPassword, password }) => bcrypt.compare( givenPassword, password );
const getAllUsers = async () => UserModel.find();
const getUserByEmail = async email => UserModel.findOne({ email });
const getUserByUsername = async username => UserModel.findOne({ username });
const getUserById = async _id => UserModel.findById({ _id });
const getRegisteredUserCountLastWeek = async date => UserModel.countDocuments({ createdAt: { '$gte': date } });
const updateUserById = async (_id, model) => UserModel.findByIdAndUpdate(_id, model, { new: true });
const deleteUserById = async _id => UserModel.findByIdAndDelete(_id);

UserModel.schema
  .path( 'username' )
  .validate( async username => !(await getUserByUsername(username)), 'User already exists!' );
UserModel.schema
  .path( 'email' )
  .validate( async email => !(await getUserByEmail(email)), 'Email is already in use!' );

export {
  save,
  comparePassword,
  getAllUsers,
  getUserByEmail,
  getUserByUsername,
  getUserById,
  getRegisteredUserCountLastWeek,
  updateUserById,
  deleteUserById,
  userSchema
};