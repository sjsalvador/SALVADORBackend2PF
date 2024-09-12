// src/config/passport.js

import dotenv from 'dotenv';
dotenv.config();

import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import User from '../models/User.js';

const secretKey = process.env.SECRET_KEY;
if (!secretKey) {
  throw new Error("SECRET_KEY no está definida en las variables de entorno.");
}

const opts = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    (req) => req.cookies.token,
    ExtractJwt.fromAuthHeaderAsBearerToken()
  ]),
  secretOrKey: secretKey,
};

export const passportConfig = (passport) => {
  passport.use(
    new JwtStrategy(opts, async (jwt_payload, done) => {
      try {
        const user = await User.findById(jwt_payload.id);
        if (user) {
          return done(null, user);
        }
        return done(null, false);
      } catch (error) {
        return done(error, false);
      }
    })
  );
};
