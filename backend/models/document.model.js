import mongoose from 'mongoose';
import { toJSON, paginate } from './plugins';

const documentSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  hex: {
    type: String,
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

// add plugin that converts mongoose to json
documentSchema.plugin(toJSON);
documentSchema.plugin(paginate);

/**
 * @typedef Document
 */
const Document = mongoose.model('Document', documentSchema);

export default Document;
