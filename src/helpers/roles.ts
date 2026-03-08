export function roleClass(role: string) {
  switch (role.toLowerCase()) {
    case "dps":
      return "tag-dps";
    case "healer":
      return "tag-healer";
    case "tank":
      return "tag-tank";
    default:
      return "tag-neutral";
  }
}

export function roleIcon(role: string) {
  const r = role.toLowerCase();
  if (r === "tank") return "🛡";
  if (r === "healer") return "💚";
  return "⚔";
}
