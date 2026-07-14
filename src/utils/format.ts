export function formatMoney(v: number): string {
  const sign = v < 0 ? '-' : '';
  const abs = Math.abs(Math.round(v));
  return `${sign}$${abs.toLocaleString()}`;
}

export function formatMonthYear(monthsElapsed: number, startYear: number): string {
  const monthIndex = monthsElapsed % 12;
  const year = startYear + Math.floor(monthsElapsed / 12);
  const names = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  return `${names[monthIndex]} ${year}`;
}
