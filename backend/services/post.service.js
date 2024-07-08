import Like from '../models/like.model';
import Post from '../models/post.model';
import Comment from '../models/comment.model';
import Notification from '../models/notification.model';
import User from '../models/user.model';
import Flightcrew from '../models/flightcrew.model';

/**
 * Create new post
 * @param {string} content - Post content
 * @param {string} userId - userId who posts new Post
 * @returns {Promise<Post>}
 */
export const createNewPost = async (body, userId) => {
  try {
    const newPost = body.fc_creator
      ? {
          content: body.content,
          userId,
          fcCreator: body.fc_creator,
        }
      : {
          content: body.content,
          userId,
        };
    return (await Post.create(newPost)).populate('userId');
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

/**
 * Query for posts
 * @param {Object} filter - MongoDB filter
 * @param {Object} option - Query options
 * @param {string} [option.sortBy] - Sort option in the format sortField:(des|asc)
 * @param {number} [options.limit] - Maximum number of results per page ( default = 10 )
 * @param {number} [options.page] - Current page ( default = 1)
 * @returns {Promise<QueryResult>}
 */
export const queryPosts = async () => {
  try {
    return await Post.find({ fcCreator: null }).populate('userId').populate('comments');
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const queryFCPosts = async (req) => {
  try {
    return await Post.find({ fcCreator: req.body.creator_id }).populate('userId').populate('comments');
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const queryPostById = async (id) => {
  try {
    return await Post.findById(id).populate('userId');
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const queryCommentsByPostId = async (id) => {
  try {
    return await Comment.find({ postId: id }).populate('userId');
  } catch (err) {
    console.log(err);
    throw err;
  }
};

/**
 * Increase like
 * @param {string} userId - id of user
 * @param {string} postId - id of post
 * @returns {Promise<Like>}
 */
export const createNewLike = async (userId, postId) => {
  try {
    return await Like.increaseLike(userId, postId);
  } catch (err) {
    console.log(err);
    throw err;
  }
};

/**
 * Decrease like
 * @param {string} userId - id of user
 * @param {string} postId - id of post
 * @returns {Promise<Like>}
 */
export const createNewUnLike = async (userId, postId) => {
  try {
    return await Like.decreaseLike(userId, postId);
  } catch (err) {
    console.log(err);
    throw err;
  }
};

/**
 * Create new comment
 * @param {string} userId - id of user
 * @param {string} postId - id of post
 * @param {string} content - content of comment
 */
export const createNewComment = async (content, userId, postId) => {
  try {
    const newComment = {
      content,
      userId,
      postId,
    };
    return await Comment.create(newComment);
  } catch (err) {
    console.log(err);
    throw err;
  }
};

/**
 * Invite user to Flight Crew with email
 * @param {string} email - email of user
 */

export const inviteUserToFC = async (email, id) => {
  try {
    if (await User.isEmailTaken(email)) {
      if (await User.isVerifiedEmail(email)) {
        const newNotification = {
          to: email,
          from: id,
          type: 2,
        };
        return !!(await Notification.create(newNotification));
      } else {
        return 'Email has not verified yet.';
      }
    } else {
      return 'Email is not exist.';
    }
  } catch (err) {
    console.log('post/inviteFC', err);
    throw err;
  }
};

export const acceptInvitation = async (creator, me) => {
  try {
    await Notification.findOneAndUpdate({ from: creator }, { $set: { checked: 1 } });
    await Flightcrew.findOneAndUpdate({ creator }, { $push: { invited_users: me } });
    return true;
  } catch (err) {
    console.log('post/acceptInvitation', err);
    throw err;
  }
};

export const getNotesForMe = async (data) => {
  try {
    return await Notification.find({ $and: [{ checked: 0 }, { $or: [{ type: 0 }, { to: data.email }] }] }).populate('from');
  } catch (err) {
    console.log('post/getnotifications', err);
    throw err;
  }
};

export const createFC = async (req) => {
  try {
    const result = await Flightcrew.create({ fc_name: req.body.crew, creator: req.user.id });
    return await Flightcrew.findOne({ _id: result.id }).populate('creator');

    // return (await Flightcrew.create({ fc_name: req.body.crew, creator: req.user.id })).populate('creator')
  } catch (err) {
    console.log('post/createCrew', err);
    throw err;
  }
};

export const queryAllFC = async (id) => {
  try {
    const all = await Flightcrew.find({ creator: { $ne: id }, invited_users: { $in: [id] } }).populate('creator');
    const mine = await Flightcrew.find({ creator: id }).populate('creator');
    return { all, mine };
  } catch (err) {
    console.log('post/createCrew', err);
    throw err;
  }
};
