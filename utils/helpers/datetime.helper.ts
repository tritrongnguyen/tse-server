import { DateTime } from 'luxon';
export const toGMT7DateTime = (date: Date): DateTime => {
  const timeZone = 'Asia/Ho_Chi_Minh';
  return DateTime.fromJSDate(date, { zone: timeZone });
};
