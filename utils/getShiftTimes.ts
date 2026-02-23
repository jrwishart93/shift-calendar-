type ShiftTimeResult = {
  startTime: string | null;
  endTime: string | null;
};

const londonWeekdayFormatter = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  timeZone: "Europe/London",
});

function isSaturdayInLondon(dateISO: string): boolean {
  const weekday = londonWeekdayFormatter.format(new Date(`${dateISO}T12:00:00Z`));
  return weekday === "Sat";
}

export function getShiftTimes(code: string, dateISO: string): ShiftTimeResult {
  if (code === "E" || code === "VD") {
    const isSaturday = isSaturdayInLondon(dateISO);
    const endTime = isSaturday ? "16:00" : "15:00";
    console.log("[getShiftTimes] early shift", { dateISO, code, isSaturday, startTime: "07:00", endTime });
    return { startTime: "07:00", endTime };
  }

  if (code === "L" || code === "VL") {
    console.log("[getShiftTimes] late shift", { dateISO, code, startTime: "14:00", endTime: "23:00" });
    return { startTime: "14:00", endTime: "23:00" };
  }

  if (code === "N" || code === "VN") {
    console.log("[getShiftTimes] night shift", { dateISO, code, startTime: "22:00", endTime: "07:00" });
    return { startTime: "22:00", endTime: "07:00" };
  }

  console.log("[getShiftTimes] no working times", { dateISO, code });
  return { startTime: null, endTime: null };
}

