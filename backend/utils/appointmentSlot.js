const buildBookingConflictQuery = ({ doctorId, dateInput, time }) => {
  const bookingDate = new Date(dateInput);
  const startOfDay = new Date(bookingDate);
  startOfDay.setUTCHours(0, 0, 0, 0);

  const endOfDay = new Date(bookingDate);
  endOfDay.setUTCHours(23, 59, 59, 999);

  return {
    doctor: doctorId,
    date: { $gte: startOfDay, $lte: endOfDay },
    time,
    status: { $ne: 'cancelled' }
  };
};

module.exports = {
  buildBookingConflictQuery
};
