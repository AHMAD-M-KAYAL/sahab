import { format, parse } from "date-fns";

const parseYmdHms = (s: string) => parse(s, "yyyy-MM-dd HH:mm:ss", new Date());

export const formatSlotLabel = (startStr: string, endStr: string) => {
  const start = parseYmdHms(startStr);
  const end = parseYmdHms(endStr);
  const s = format(start, "hh:mm a").toUpperCase();
  const e = format(end, "hh:mm a").toUpperCase();
  return `${s} - ${e}`;
};

export function localDateOnly(date:Date) {
  const pad = n => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export const parseSlot = (slot: string) => {
  const parts = slot.split("|");
  if (parts.length !== 2) throw new Error("Invalid slot format");
  const [startStr, endStr] = parts;

  const start = parse(startStr, "yyyy-MM-dd HH:mm:ss", new Date());
  const end = parse(endStr, "yyyy-MM-dd HH:mm:ss", new Date());

  return {
    date: format(start, "yyyy-MM-dd"),
    startTime: format(start, "HH:mm:ss"),
    endTime: format(end, "HH:mm:ss"),
  };
};

export function formatTo12Hour(time: string): string {
  const parsed = parse(time, "HH:mm:ss", new Date());
  return format(parsed, "hh:mm a");
}