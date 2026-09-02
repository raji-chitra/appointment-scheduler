const test = require('node:test');
const assert = require('node:assert/strict');
const { buildBookingConflictQuery } = require('../utils/appointmentSlot');

test('buildBookingConflictQuery normalizes a booking date and time for conflict checks', () => {
  const query = buildBookingConflictQuery({
    doctorId: '64f1abc123',
    dateInput: '2026-08-10',
    time: '09:00'
  });

  assert.deepEqual(query, {
    doctor: '64f1abc123',
    date: {
      $gte: new Date('2026-08-10T00:00:00.000Z'),
      $lte: new Date('2026-08-10T23:59:59.999Z')
    },
    time: '09:00',
    status: { $ne: 'cancelled' }
  });
});
