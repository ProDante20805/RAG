import express from 'express';
import passport from 'passport';
import { catchAsync } from '../utils/catchAsync';
import { getMainCourse, getSubTitle } from '../controllers/chat.controller';
const router = express.Router();

router.post(
  '/getMainCourse',
  passport.authenticate('jwt', { session: false }),
  catchAsync(async (req, res) => {
    console.log('/api/chat/getMainCourse called -------');
    res.status(200).json(await getMainCourse(req));
  })
);

router.post(
  '/getSubTitle',
  passport.authenticate('jwt', { session: false }),
  catchAsync(async (req, res) => {
    console.log('/api/chat/getSubTitle called -------');
    res.status(200).json(await getSubTitle(req));
  })
);

export default router;
