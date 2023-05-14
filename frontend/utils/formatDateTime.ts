export default function formatDateTime(date: Date) {
  return Intl.DateTimeFormat(navigator.language, { timeZoneName: 'short' }).format(date)
}
