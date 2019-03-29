import mongoose from 'mongoose';

const historySchema = new mongoose.Schema(
  {
    userId: { type: String, trim: true, required: true },
    sudokuId: { type: String, trim: true, required: true },
    answer: { type: String, trim: true, required: true },
    time: { type: Number, required: true }
  },
  {
    timestamps: true
  }
);

const HistoryModel = mongoose.model('History', historySchema);

const save = async history => new HistoryModel(history).save();
const getAllHistory = async () => HistoryModel.find();
const getHistoryById = async _id => HistoryModel.findById(_id);
const getHistoryByUserId = async userId => HistoryModel.find({ userId });
const getHistoryBySudokuId = async sudokuId => HistoryModel.find({ sudokuId });
const updateHistoryById = async (_id, model) => HistoryModel.findByIdAndUpdate(_id, model, { new: true });
const deleteHistoryById = async _id => HistoryModel.findByIdAndDelete(_id);

HistoryModel.schema
  .path( 'answer' )
  .validate( function(answer) {
    return answer && answer.length === 81;
  }, 'Answer length must be 81!' );

export { save, getAllHistory, getHistoryById, getHistoryByUserId, getHistoryBySudokuId, updateHistoryById, deleteHistoryById, historySchema };