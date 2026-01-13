export const sanitizeUser = (user) => ({
  _id: user._id,
  fullname: user.fullname,
  email: user.email,
  profileImage: user.profileImage,
  role: user.role,
  authProvider: user.authProvider,
  location: user.location,
  preferences: user.preferences,
  wallet: user.wallet,
});
