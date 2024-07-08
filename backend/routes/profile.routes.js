import express from 'express';
import passport from 'passport';
import { catchAsync } from '../utils/catchAsync';
import { uploadProfilePDF, uploadProfilePDF1 } from '../controllers/admin.controller';
import { updateUserById, updateAvatar, changePasswordById, isEmailExist, resetPasswordById } from '../services/user.service';
import { generateCodeForPwd } from '../services/email.service';
const router = express.Router();

router.post(
  '/update',
  passport.authenticate('jwt', { session: false }),
  catchAsync(async (req, res) => {
    console.log('/api/profile/update called -------');
    res.status(200).json(await updateUserById(req.user._id, req.body));
  })
);

router.post(
  '/changePassword',
  passport.authenticate('jwt', { session: false }),
  catchAsync(async (req, res) => {
    console.log('/api/profile/changePassWord called -------');
    res.status(200).json(await changePasswordById(req.user._id, req.body));
  })
);

router.post(
  '/uploadProfilePDF',
  catchAsync(async (req, res) => {
    console.log('/api/auth/uploadProfilePDF called ---------');
    res.status(200).json(await uploadProfilePDF(req, res));
  })
);

router.post(
  '/uploadProfilePDF1',
  passport.authenticate('jwt', { session: false }),
  catchAsync(async (req, res) => {
    console.log('/api/profile/uploadProfilePDF1 called ---------');
    res.status(200).json(await uploadProfilePDF1(req, req.user._id));
  })
);

router.post(
  '/updateAvatar/new',
  catchAsync(async (req, res) => {
    console.log('/api/profile/updateAvatar/new called -------');
    res.status(200).json(await updateAvatar(req, res));
  })
);

router.post(
  '/updateAvatar/edit',
  passport.authenticate('jwt', { session: false }),
  catchAsync(async (req, res) => {
    console.log('/api/profile/updateAvatar/edit called -------');
    res.status(200).json(await updateAvatar(req, res, req.user._id));
  })
);

router.post(
  '/get',
  passport.authenticate('jwt', { session: false }),
  catchAsync(async (req, res) => {
    console.log('/api/profile/get called -------');
    res.status(200).json(req.user);
  })
);

router.post(
  '/isExistEmail',
  catchAsync(async (req, res) => {
    console.log('/api/profile/isExistEmail called ---------');
    res.status(200).json(await isEmailExist(req.body.email));
  })
);

router.post(
  '/generateCodeForPwd',
  catchAsync(async (req, res) => {
    console.log('/api/profile/generateCodeForPwd called ---------');
    const email_exist = await isEmailExist(req.body.email);
    if (email_exist) {
      res.status(200).json(await generateCodeForPwd(req.body.email));
    } else {
      res.status(200).json(false);
    }
  })
);

router.post(
  '/resetPassword',
  catchAsync(async (req, res) => {
    console.log('/api/profile/resetPassword called -------');
    res.status(200).json(await resetPasswordById(req.body));
  })
);

export default router;
