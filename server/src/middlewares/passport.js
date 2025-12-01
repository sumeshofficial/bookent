import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import dotenv from "dotenv";
import { findUserById, handleGoogleAuth } from "../services/auth.service.js";
import { getObjectURL } from "../services/s3.service.js";
dotenv.config();

const googleCallbackUrl = process.env.GOOGLE_CALLBACK_URL;

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

// configure JWT strategy
passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      const user = await findUserById(jwt_payload.id);
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (error) {
      return done(error, false);
    }
  })
);

// Configure Google strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: googleCallbackUrl,
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        profile.role = "user";
        if (req.query.state) {
          const stateData = JSON.parse(req.query.state);
          if (stateData.role) {
            profile.role = stateData.role;
          }
        }

        const user = await handleGoogleAuth(profile);

        if (
          user &&
          user.profileImage &&
          user.profileImage.includes("uploads")
        ) {
          const url = await getObjectURL(user.profileImage);
          user.profileImage = url;
        }

        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

export default passport;
