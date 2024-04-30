/**
 * Converts a Ripple epoch time to a UTC date.
 *
 * @param {number} rippleEpoch - The Ripple epoch time to convert.
 * @return {Date} The UTC date corresponding to the Ripple epoch time.
 */
export function convertRippleEpochToUTCDate(rippleEpoch: number) {
    return new Date((rippleEpoch + 946684800) * 1000);
}
