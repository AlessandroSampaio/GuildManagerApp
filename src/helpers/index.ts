export {
  DIFF,
  DELAY_FAILURE,
  DELAY_SUCCESS,
  WOW_CLASSES,
  diffLabel,
} from "./constants";
export { roleClass, roleIcon } from "./roles";
export { fmtDate, fmtMs, formatWeekRange, fmtAmount } from "./formatters";
export {
  classColor,
  backgroundClassColor,
  tierBarColor,
  tierColor,
} from "./colors";
export { nextTuesday, isTuesday } from "./week";

export function sleep(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}
