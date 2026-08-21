export const getStartOfDay = (
  date: Date = new Date()
): Date => {
  const start = new Date(date);

  start.setHours(0, 0, 0, 0);

  return start;
};

export const getEndOfDay = (
  date: Date = new Date()
): Date => {
  const end = new Date(date);

  end.setHours(23, 59, 59, 999);

  return end;
};

export const getDateRange = (
  date: Date = new Date()
) => {
  return {
    start: getStartOfDay(date),
    end: getEndOfDay(date),
  };
};