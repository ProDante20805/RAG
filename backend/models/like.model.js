import mongoose from 'mongoose';
import Post from '../models/post.model';
const { Schema } = mongoose;

const likeSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  postId: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
  status: { type: Number, enum: [1, -1], default: 1 },
});

// Check if user has already liked or disliked the post
likeSchema.statics.hasLikedOrDisliked = async function (userId, postId) {
  const like = await this.findOne({ userId, postId });
  return like ? like.status : 0;
};

// Increase Like method
likeSchema.statics.increaseLike = async function (userId, postId) {
  const currentStatus = await this.hasLikedOrDisliked(userId, postId);
  if (currentStatus === 1) {
    throw new Error('User has already liked the post');
  } else if (currentStatus === -1) {
    await Post.updateOne({ _id: postId }, { $inc: { likes: 1 } });
    return await this.findOneAndUpdate({ userId, postId }, { status: 1 });
  } else {
    return await this.create({ userId, postId, status: 1 });
  }
};

// Decrease Like method
likeSchema.statics.decreaseLike = async function (userId, postId) {
  const currentStatus = await this.hasLikedOrDisliked(userId, postId);
  if (currentStatus === -1) {
    throw new Error('User has already disliked the post');
  } else if (currentStatus === 1) {
    await Post.updateOne({ _id: postId }, { $inc: { likes: -1 } });
    return await this.findOneAndUpdate({ userId, postId }, { status: -1 });
  } else {
    return await this.create({ userId, postId, status: -1 });
  }
};

export default mongoose.model('Like', likeSchema);
