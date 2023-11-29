export function convertRippleEpochToUTCDate(rippleEpoch: number) {
    return new Date((rippleEpoch + 946684800) * 1000);
}
