import {
  createNewComment,
  createNewLike,
  createNewPost,
  createNewUnLike,
  queryPosts,
  queryFCPosts,
  queryPostById,
  queryCommentsByPostId,
  inviteUserToFC,
  acceptInvitation,
  getNotesForMe,
  createFC,
  queryAllFC,
} from '../services/post.service';
import pick from '../utils/pick';

export const addPost = async (req, res) => {
  return await createNewPost(req.body, req.user._id);
};

export const getPosts = async (req, res) => {
  return await queryPosts();
};

export const acceptInvite = async (creator, me) => {
  return await acceptInvitation(creator, me);
};

export const getAllFC = async (id) => {
  return await queryAllFC(id);
};

export const getFCPosts = async (req) => {
  return await queryFCPosts(req);
};

export const createCrew = async (req) => {
  return await createFC(req);
};
export const inviteFC = async (email, id) => {
  return await inviteUserToFC(email, id);
};

export const getNotifications = async (data) => {
  return await getNotesForMe(data);
};

export const getPostById = async (id) => {
  return await queryPostById(id);
};

export const getCommentsById = async (id) => {
  return await queryCommentsByPostId(id);
};

export const like = async (req, res) => {
  const { postId } = req.body;
  const userId = req.user._id;
  return await createNewLike(userId, postId);
};

export const unlike = async (req, res) => {
  const { postId } = req.body;
  const userId = req.user._id;
  return await createNewUnLike(userId, postId);
};

export const comment = async (req, res) => {
  const { postId, content } = req.body;
  const userId = req.user._id;
  return await createNewComment(content, userId, postId);
};
