import dayjs from 'dayjs';

export const formatTimeStr = (targetDay, platformDay) => {
  const targetDate = dayjs()
    .utc()
    .add(targetDay - platformDay - 1, 'day')
    .hour(17);

  const hoursDiff = targetDate.diff(dayjs().utc(), 'hours');

  if (hoursDiff < 0) return '';

  const hoursLeft = hoursDiff % 24;
  const daysLeft = Math.floor(hoursDiff / 24);

  if (daysLeft < 1) return targetDate.fromNow(true) === 'a day' ? '1 day' : targetDate.fromNow(true);

  const hoursLeftString = hoursLeft === 0 ? '' : hoursLeft === 1 ? 'an hour' : hoursLeft + ' hours';
  const daysLeftString = daysLeft === 1 ? '1 day' : daysLeft + ' days';

  return daysLeftString + (hoursLeftString ? ', ' + hoursLeftString : hoursLeftString);
};
