import mongoose from 'mongoose';

const sudokuSchema = new mongoose.Schema(
  {
    difficulty: { type: String, trim: true, required: true, enum: ['easy', 'medium', 'hard', 'very hard'] },
    sudoku: { type: String, trim: true, unique: true, required: true }
  },
  {
    timestamps: true
  }
);

const SudokuModel = mongoose.model('Sudoku', sudokuSchema);

const save = async sudoku => new SudokuModel(sudoku).save();
const getAllSudoku = async () => SudokuModel.find();
const getSudokuById = async _id => SudokuModel.findById(_id);
const getSudokuByDifficulty = async difficulty => SudokuModel.find({ difficulty });
const updateSudokuById = async (_id, model) => SudokuModel.findByIdAndUpdate(_id, model, { new: true });
const deleteSudokuById = async _id => SudokuModel.findByIdAndDelete(_id);

SudokuModel.schema
  .path( 'sudoku' )
  .validate( function(sudoku) {
    return sudoku && sudoku.length === 81;
  }, 'Sudoku length must be 81!' );

export { save, getAllSudoku, getSudokuById, getSudokuByDifficulty, updateSudokuById, deleteSudokuById, sudokuSchema };