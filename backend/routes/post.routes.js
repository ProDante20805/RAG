import express from 'express';
import passport from 'passport';
import { catchAsync } from '../utils/catchAsync';
import {
  addPost,
  comment,
  getPosts,
  getFCPosts,
  like,
  unlike,
  getPostById,
  getCommentsById,
  inviteFC,
  getNotifications,
  createCrew,
  getAllFC,
  acceptInvite,
} from '../controllers/post.controller';
const router = express.Router();

router.post(
  '/addPost',
  passport.authenticate('jwt', { session: false }),
  catchAsync(async (req, res) => {
    console.log('/api/user/post called -------');
    res.status(200).json(await addPost(req, res));
  })
);

router.post(
  '/getPosts',
  passport.authenticate('jwt', { session: false }),
  catchAsync(async (req, res) => {
    console.log('/api/post/getPosts called -------');
    res.status(200).json(await getPosts(req, res));
  })
);

router.post(
  '/getAllFC',
  passport.authenticate('jwt', { session: false }),
  catchAsync(async (req, res) => {
    console.log('/api/post/getAllFC called -------');
    res.status(200).json(await getAllFC(req.user._id));
  })
);

router.post(
  '/getFCPosts',
  passport.authenticate('jwt', { session: false }),
  catchAsync(async (req, res) => {
    console.log('/api/post/getFCPosts called -------');
    res.status(200).json(await getFCPosts(req));
  })
);

router.post(
  '/getPostById',
  passport.authenticate('jwt', { session: false }),
  catchAsync(async (req, res) => {
    console.log('/api/post/getPostById called -------');
    res.status(200).json(await getPostById(req.body.id));
  })
);

router.post(
  '/getCommentsByPostId',
  passport.authenticate('jwt', { session: false }),
  catchAsync(async (req, res) => {
    console.log('/api/post/getPostById called -------');
    res.status(200).json(await getCommentsById(req.body.id));
  })
);

router.post(
  '/like',
  passport.authenticate('jwt', { session: false }),
  catchAsync(async (req, res) => {
    console.log('/api/post/like called -------');
    res.status(200).json(await like(req, res));
  })
);

router.post(
  '/unlike',
  passport.authenticate('jwt', { session: false }),
  catchAsync(async (req, res) => {
    console.log('/api/post/unlike called -------');
    res.status(200).json(await unlike(req, res));
  })
);

router.post(
  '/comment',
  passport.authenticate('jwt', { session: false }),
  catchAsync(async (req, res) => {
    console.log('/api/post/comment called -------');
    res.status(200).json(await comment(req, res));
  })
);

router.post(
  '/inviteFC',
  passport.authenticate('jwt', { session: false }),
  catchAsync(async (req, res) => {
    console.log('/api/post/inviteFC called -------');
    res.status(200).json(await inviteFC(req.body.email, req.user._id));
  })
);

router.post(
  '/acceptInvite',
  passport.authenticate('jwt', { session: false }),
  catchAsync(async (req, res) => {
    console.log('/api/post/acceptInvite called -------');
    res.status(200).json(await acceptInvite(req.body.id, req.user._id));
  })
);

router.post(
  '/getNotifications',
  passport.authenticate('jwt', { session: false }),
  catchAsync(async (req, res) => {
    console.log('/api/post/getNotifications called -------');
    res.status(200).json(await getNotifications(req.user));
  })
);

router.post(
  '/createCrew',
  passport.authenticate('jwt', { session: false }),
  catchAsync(async (req, res) => {
    console.log('/api/post/createCrew called -------');
    res.status(200).json(await createCrew(req));
  })
);

export default router;
