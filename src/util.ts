export const dateString = (date: Date) => date.toLocaleDateString(
  "en-au",
  {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric"
  }
)
