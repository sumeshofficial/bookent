import RefreshToken from "../../models/refreshToken.model.js";

export const createRefreshToken = async (userId, tokenId) => {
  return RefreshToken.create({
    userId,
    tokenId,
  });
};

export const findRefreshToken = async (tokenId) => {
  return RefreshToken.findOne({ tokenId });
};

export const deleteRefreshToken = async (tokenId) => {
  return RefreshToken.deleteOne({ tokenId });
};
