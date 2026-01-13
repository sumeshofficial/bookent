export const buildStadiumDetails = (payload, oldDetails) => {
  if (!payload?.stadiumDetails) {
    return {};
  }

  return {
    stadiumDetails: {
      stadiumName: payload.stadiumDetails.stadiumName ?? oldDetails.stadiumName,
      address: payload.stadiumDetails.address ?? oldDetails.address,
      city: payload.stadiumDetails.city ?? oldDetails.city,
      state: payload.stadiumDetails.state ?? oldDetails.state,
      stateCode: payload.stadiumDetails.stateCode ?? oldDetails.stateCode,
      pincode: payload.stadiumDetails.pincode ?? oldDetails.pincode,
      location: payload.stadiumDetails.location ?? oldDetails.location,
      capacity: payload.stadiumDetails.capacity ?? oldDetails.capacity,
    },
  };
};
