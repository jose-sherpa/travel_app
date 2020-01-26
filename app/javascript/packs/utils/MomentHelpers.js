export const dayDiff = (start, end) => {
  return start.startOf("day").diff(end.endOf("day"), "days");
};

export const getDaysUntilText = (start, end) => {
  let daysUntilText = null;
  if (start > end) {
    const daysUntil = dayDiff(start, end);

    if (daysUntil === 0) {
      daysUntilText = "Today";
    } else if (daysUntil === 1) {
      daysUntilText = "Tomorrow";
    } else {
      daysUntilText = `In ${daysUntil} days`;
    }
  }

  return daysUntilText;
};
