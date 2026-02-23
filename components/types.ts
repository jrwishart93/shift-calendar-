export type RawShift = {
  date: string;
  code: string;
  note?: string;
};

export type EnrichedShift = RawShift & {
  label: string;
  type: string;
  startTime: string | null;
  endTime: string | null;
};
