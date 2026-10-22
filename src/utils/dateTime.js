export function formatSinhalaDate(date = new Date()) {
  return new Intl.DateTimeFormat('si-LK', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Colombo' }).format(date);
}

export function formatShortDate(value) {
  return new Intl.DateTimeFormat('si-LK', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Colombo' }).format(new Date(value));
}
