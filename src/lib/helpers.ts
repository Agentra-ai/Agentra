export function truncateString(text: string, length: number): string {
  if (text.length <= length) {
    return text
  }
  return text.substring(0, length) + "..."
}

export function formatNumber(number: number) {
  if (number >= 1000000) {
    return (number / 1000000).toFixed(0) + "M";
  } else if (number >= 1000) {
    return (number / 1000).toFixed(0) + "K";
  } else {
    return number.toString();
  }
}