export interface Guild {
  id: number;
  name: string;
  server: string;
  region: string;
}
export interface Character {
  id: number;
  name: string;
  server: string;
  class: string;
  guildName: string | null;
}
