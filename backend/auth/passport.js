import passport from 'passport';
import passportLocal from 'passport-local';
import passportJWT from 'passport-jwt';
import path from 'path';
import dotenv from 'dotenv';

import userService from '../services/user.service';
import { loginUserWithEmailAndPassword } from '../services/auth.service';
import { getUserById } from '../services/user.service';
import { generateJWTToken } from '../auth/helpers';
import axios from 'axios';
import User from '../models/user.model';

dotenv.config({ path: path.join(__dirname, '../.env') });

const LocalStrategy = passportLocal.Strategy;
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

passport.use(
  'local-signup',
  new LocalStrategy(
    { usernameField: 'email', passwordField: 'password', passReqToCallback: true },
    async (req, emailInput, passwordInput, done) => {
      const {
        full_name,
        user_name,
        role,
        phone_number,
        postal_code,
        interest_size,
        interest_type,
        rpas_number,
        plane_number,
        coordinates,
        club_name,
      } = req.body;
      const payload = {
        full_name,
        user_name,
        email: emailInput,
        password: passwordInput,
        role,
        phone_number,
        postal_code,
        interest_size,
        interest_type,
        rpas_number,
        plane_number,
        coordinates,
        club_name,
      };
      try {
        console.log('passport register called');
        const user = await userService.createUser(payload);
        if (user) {
          return done(null, user);
        } else {
          return done('Sign up error!', null);
        }
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.use(
  'local-login',
  new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, async (email, password, done) => {
    let user;
    try {
      user = await loginUserWithEmailAndPassword(email, password);
    } catch (error) {
      done(error);
    }

    if (!user) return done('No user found with that email address.', null);
    console.log(user);
    const { _id: id, user_name, role } = user;

    const options = {
      expiresIn: 3600,
    };

    const token = generateJWTToken({ id, user_name, role }, options);
    return done(null, token, user);
  })
);

passport.use(
  'jwt',
  new JWTStrategy(
    { jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(), secretOrKey: process.env.JWT_SECRET },
    async (jwtPayload, done) => {
      const { id } = jwtPayload;
      try {
        const user = await getUserById(id);
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.use(
  'google-login',
  new LocalStrategy(
    { usernameField: 'email', passwordField: 'password', passReqToCallback: true },
    async (req, emailInput, passwordInput, done) => {
      const { access_token } = req.body;
      const response = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      console.log('response', response);
      const name = response.data.given_name + ' ' + response.data.family_name;
      const email = response.data.email;
      const role = ['user'];
      const existingUser = await User.findOne({ email });
      const options = {
        expiresIn: 3600,
      };
      if (existingUser) {
        const token = generateJWTToken({ id: existingUser._id, name, role }, options);
        return done(null, token, existingUser);
      }
      const payload = { name, email, password: passwordInput, role };
      try {
        const user = await userService.createUser(payload);
        if (user) {
          const token = generateJWTToken({ id: user._id, name, role }, options);
          return done(null, token, user);
        } else {
          return done('Sign up error!', null);
        }
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

export default passport;
