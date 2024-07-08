import mongoose from 'mongoose';
import { paginate, toJSON } from './plugins';
import Post from '../models/post.model';

const { Schema } = mongoose;

const commentSchema = new Schema({
  content: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  postId: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
  createdAt: { type: Date, default: Date.now },
});

commentSchema.post('save', async function () {
  const post = await Post.findById(this.postId);
  post.comments.push(this._id);
  await post.save();
});

// add plugin that converts mongoose to json
commentSchema.plugin(toJSON);
commentSchema.plugin(paginate);

export default mongoose.model('Comment', commentSchema);
