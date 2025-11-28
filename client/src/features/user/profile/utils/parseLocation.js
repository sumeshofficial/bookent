export const parseLocation = (user) => {
  if (!user || !user.location)
    return { formattedLocation: "Location not available" };

  const parts = (user.location.address || "").split(",");
  const city = parts[parts.length - 2]?.trim() || "";
  const state = parts[parts.length - 1]?.trim() || "";

  const formatted =
    city || state
      ? `${city}${city && state ? ", " : ""}${state}`
      : "Location not available";

  return {
    formattedLocation: formatted,
    city,
    state,
  };
};
