// Normalizes rich text to prevent long overflowing words
export const normalizeRichTextWrapping = (html: string) =>
  html
    .split(/(<[^>]*>)/g)
    .map((part, index) =>
      index % 2 === 0
        ? part.replace(/&nbsp;|\u00a0/g, " ").replace(/-/g, "\u2011")
        : part
    )
    .join("");

// Converts 24-hour time format to 12-hour format
export const convertTo12Hour = (time24: string): string => {
  if (!time24) return "";
  const [hours, minutes] = time24.split(":").map(Number);
  const meridiem = hours >= 12 ? "PM" : "AM";
  const hours12 = hours % 12 || 12;
  return `${String(hours12).padStart(2, "0")}:${String(minutes).padStart(2, "0")} ${meridiem}`;
};