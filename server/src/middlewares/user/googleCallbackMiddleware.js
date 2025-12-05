import { sendPopupResponse } from "../../utility/user/googleAuth.js";
import passport from "./passport.js";

export const googleCallbackMiddleware = (req, res, next) => {
  passport.authenticate("google", { session: false }, (err, user) => {
    if (err || !user) {
      const FRONTEND_URL = process.env.FRONTEND_URL;
      return sendPopupResponse(
        res,
        { error: err?.message || "Authentication failed" },
        FRONTEND_URL
      );
    }

    req.user = user;
    next();
  })(req, res, next);
};
