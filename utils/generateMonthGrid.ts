export type MonthGridDay = {
  date: string;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
};

const ISO_DATE_LENGTH = 10;

function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, ISO_DATE_LENGTH);
}

export function generateMonthGrid(year: number, month: number): MonthGridDay[][] {
  const firstOfMonth = new Date(Date.UTC(year, month, 1));
  const mondayBasedDay = (firstOfMonth.getUTCDay() + 6) % 7;
  const startDate = new Date(firstOfMonth);
  startDate.setUTCDate(startDate.getUTCDate() - mondayBasedDay);

  const endOfMonth = new Date(Date.UTC(year, month + 1, 0));
  const endOffset = 6 - ((endOfMonth.getUTCDay() + 6) % 7);
  const endDate = new Date(endOfMonth);
  endDate.setUTCDate(endDate.getUTCDate() + endOffset);

  const todayIso = toIsoDate(new Date());
  const weeks: MonthGridDay[][] = [];
  let currentWeek: MonthGridDay[] = [];

  for (const cursor = new Date(startDate); cursor <= endDate; cursor.setUTCDate(cursor.getUTCDate() + 1)) {
    const date = new Date(cursor);

    currentWeek.push({
      date: toIsoDate(date),
      dayNumber: date.getUTCDate(),
      isCurrentMonth: date.getUTCMonth() === month,
      isToday: toIsoDate(date) === todayIso
    });

    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  return weeks;
}
