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
