export function nextTuesday(): string {
  const d = new Date();
  // DayOfWeek: 0=Dom,1=Seg,2=Ter,...
  const daysUntilTue = (2 - d.getDay() + 7) % 7;
  d.setDate(d.getDate() + (daysUntilTue === 0 ? 0 : daysUntilTue));
  return d.toISOString().slice(0, 10);
}

export function isTuesday(dateStr: string): boolean {
  return new Date(dateStr).getDay() === 2;
}
