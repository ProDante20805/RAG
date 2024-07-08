import express from 'express';
import { catchAsync } from '../utils/catchAsync';
import { deliverEmail, verifyEmail, contactUs } from '../services/email.service';
const router = express.Router();

router.post(
  '/sendEmail',
  catchAsync(async (req, res) => {
    console.log('email send called--');
    res.status(200).json(await deliverEmail(req.body));
  })
);

router.post(
  '/contactUs',
  catchAsync(async (req, res) => {
    console.log('email send called--');
    res.status(200).json(await contactUs(req.body));
  })
);

router.post(
  '/verifyEmail',
  catchAsync(async (req, res) => {
    console.log('email verify called--');
    res.status(200).json(await verifyEmail(req.body));
  })
);

export default router;
