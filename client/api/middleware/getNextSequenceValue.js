import { Counter } from '../models/Counter.js';

export const getNextSequenceValue = async (sequenceName) => {
  const sequenceDocument = await Counter.findByIdAndUpdate(
    sequenceName,
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return String(sequenceDocument.seq).padStart(6, '0');
};