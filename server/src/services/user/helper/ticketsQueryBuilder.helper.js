export const ticketsQueryBuilder = ({ userId, search, status, sort }) => {
  const query = { userId };

  if (status && status !== "ALL") {
    query.status = status;
  }

  if (search) {
    query.$or = [
      { "eventDetails.title": { $regex: search, $options: "i" } },
      { "eventDetails.venue": { $regex: search, $options: "i" } },
    ];
  }

  let sortQuery = {};

  switch (sort) {
    case "booked":
      sortQuery = { createdAt: -1 };
      break;
    case "booked_asc":
      sortQuery = { createdAt: 1 };
      break;
    case "upcoming":
      sortQuery = { "eventDetails.date": 1 };
      break;
    case "past":
      sortQuery = { "eventDetails.date": -1 };
      break;
    case "az":
      sortQuery = { "eventDetails.title": 1 };
      break;
    default:
      sortQuery = { createdAt: -1 };
  }

  return { query, sortQuery };
};
