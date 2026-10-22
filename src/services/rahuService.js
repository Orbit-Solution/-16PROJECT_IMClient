const segments = { 0: 8, 1: 2, 2: 7, 3: 5, 4: 6, 5: 4, 6: 3 };
const sampleSun = { sunrise: '06:01', sunset: '18:20' };

function minutes(time) { const [h, m] = time.split(':').map(Number); return h * 60 + m; }
function clock(total) { const normalized = ((Math.round(total) % 1440) + 1440) % 1440; return `${String(Math.floor(normalized / 60)).padStart(2, '0')}:${String(normalized % 60).padStart(2, '0')}`; }

export function calculateRahu({ date = new Date(), sunrise = sampleSun.sunrise, sunset = sampleSun.sunset } = {}) {
  const weekday = new Date(date).getDay();
  const start = minutes(sunrise);
  const duration = minutes(sunset) - start;
  const part = duration / 8;
  const offset = segments[weekday] - 1;
  return { date: new Date(date).toISOString().slice(0, 10), sunrise, sunset, start: clock(start + part * offset), end: clock(start + part * (offset + 1)), weekday, source: 'configured-sun-data' };
}

export function getTodayRahu() { return calculateRahu(); }
