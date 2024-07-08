import { Schema, model, ObjectId } from 'mongoose';
import User from './user.model';

import { toJSON, paginate } from './plugins';

const MessageSchema = new Schema({
  prompt: String,
  answer: String,
});

export const Message = model('Message', MessageSchema);

const ContentSchema = new Schema(
  {
    userId: {
      type: ObjectId,
      reference: User._id,
    },
    messages: [MessageSchema],
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
ContentSchema.plugin(toJSON);
ContentSchema.plugin(paginate);

/**
 * @typedef User
 */
const Content = model('Content', ContentSchema);

export default Content;
