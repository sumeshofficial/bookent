import passport from "../../middlewares/user/passport.js";

export const googleInitMiddleware = passport.authenticate("google", {
  scope: ["profile", "email"],
});
