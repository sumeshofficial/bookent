export const getChangedFields = (original, updated) => {
  const changes = {};

  Object.keys(updated).forEach((key) => {
    const updatedValue = updated[key];

    if (updatedValue === undefined) return;

    let originalValue = original[key];

    if (key.toLowerCase().includes("date")) {
      const normalizeDate = (val) =>
        val ? new Date(val).toISOString().slice(0, 10) : "";

      if (normalizeDate(originalValue) !== normalizeDate(updatedValue)) {
        changes[key] = updatedValue;
      }
      return;
    }

    if (typeof originalValue === "number") {
      if (Number(updatedValue) !== originalValue) {
        changes[key] = Number(updatedValue);
      }
      return;
    }

    if (
      (originalValue === null && updatedValue === "") ||
      (originalValue === "" && updatedValue === null)
    ) {
      return;
    }

    if (updatedValue !== originalValue) {
      changes[key] = updatedValue;
    }
  });

  return changes;
};
