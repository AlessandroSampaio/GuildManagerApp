export function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function fmtMs(ms: number) {
  const m = Math.floor(ms / 60000);
  const ss = Math.floor((ms % 60000) / 1000)
    .toString()
    .padStart(2, "0");
  return `${m}:${ss}`;
}

export function formatWeekRange(startsAt: string, endsAt: string): string {
  const fmt = (s: string) =>
    new Date(s).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
  return `${fmt(startsAt)} – ${fmt(endsAt)}`;
}
