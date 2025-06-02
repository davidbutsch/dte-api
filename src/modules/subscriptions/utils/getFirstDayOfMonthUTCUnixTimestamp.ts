/**
 * Returns the Unix timestamp (in seconds) for the first day of the given month (UTC).
 *
 * @param index 0-indexed representation of target month.
 */
export function getFirstDayOfMonthUTCUnixTimestamp(index: number): number {
  const now = new Date();

  const firstDayOfMonthUTC = new Date(
    Date.UTC(
      now.getUTCFullYear(), // Year
      index, // Month
      1 // Day
    )
  );

  // Get the first day of month timestamp in milliseconds since the Unix epoch
  const inMilliseconds = firstDayOfMonthUTC.getTime();

  // Convert to integer seconds (which Stripe uses)
  return Math.floor(inMilliseconds / 1000);
}
