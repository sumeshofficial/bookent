import Stadium from "../../models/stadium.model.js";

export const fetchStadiumById = async (stadiumId) => {
  return Stadium.findById(stadiumId).lean();
};
