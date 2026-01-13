import { ulid } from "ulid";

export const generatePublicOrderId = () => {
  const year = new Date().getFullYear();
  return `BK-${year}-${ulid()}`;
};
