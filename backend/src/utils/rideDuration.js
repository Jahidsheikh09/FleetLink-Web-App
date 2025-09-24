export function calculateEstimatedRideDurationHours(fromPincode, toPincode) {
  const from = parseInt(String(fromPincode), 10);
  const to = parseInt(String(toPincode), 10);
  if (Number.isNaN(from) || Number.isNaN(to)) {
    throw new Error('Invalid pincodes for duration calculation');
  }
  return Math.abs(to - from) % 24;
}

