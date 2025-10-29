/**
 * Converts a hexadecimal string to a Uint8Array.
 *
 * @param {string} hexString - The hexadecimal string to convert.
 * @return {Uint8Array} The converted Uint8Array.
 */
export function hexToUInt8Array(hexString: string) {
    if (hexString.length % 2 !== 0) {
        throw new Error('Hex string must have an even number of characters');
    }

    var bytes = new Uint8Array(hexString.length / 2);

    for (var i = 0; i < bytes.length; i++) {
        var byte = hexString.charAt(i * 2) + hexString.charAt(i * 2 + 1);
        bytes[i] = parseInt(byte, 16);
    }

    return bytes;
}
