export const shiftMap: Record<string, any> = {
  E: { type: "early", label: "Early Shift", start: "07:00", end: "15:00" },
  VD: { type: "early", label: "Early Shift", start: "07:00", end: "15:00" },

  L: { type: "late", label: "Late Shift", start: "14:00", end: "22:00" },
  VL: { type: "late", label: "Late Shift", start: "14:00", end: "22:00" },

  N: { type: "night", label: "Night Shift", start: "22:00", end: "07:00" },
  VN: { type: "night", label: "Night Shift", start: "22:00", end: "07:00" },

  R: { type: "rest", label: "Rest Day" },
  RR: { type: "rest", label: "Re-Rostered Rest" },

  AL: { type: "annual_leave", label: "Annual Leave" },
  LR: { type: "leave_requested", label: "Leave Requested" },

  W: { type: "court", label: "Court" },
  C: { type: "course", label: "Course" },

  SB: { type: "service_break", label: "Service Break" },
  T: { type: "toil", label: "Time Off In Lieu" },

  PH: { type: "public_holiday", label: "Public Holiday" },
  A: { type: "public_holiday", label: "Public Holiday" }
};
