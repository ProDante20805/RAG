import express from 'express';

const router = express.Router();

import authRouter from './auth.routes';
import adminRouter from './admin.routes';
import postRouter from './post.routes';
import profileRouter from './profile.routes';
import chatRouter from './chat.routes';
import emailRouter from './email.routes';

const defaultRoutes = [
  {
    path: '/auth',
    route: authRouter,
  },
  {
    path: '/admin',
    route: adminRouter,
  },
  {
    path: '/post',
    route: postRouter,
  },
  {
    path: '/profile',
    route: profileRouter,
  },
  {
    path: '/chat',
    route: chatRouter,
  },
  {
    path: '/email',
    route: emailRouter,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
