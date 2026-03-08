export interface RaidWeekSummary {
  id: number;
  label: string;
  startsAt: string;
  endsAt: string;
  reportCount: number;
}

export interface RaidWeek {
  id: number;
  label: string;
  startsAt: string;
  endsAt: string;
  createdAt: string;
  updatedAt: string;
  reportCodes: string[];
}
