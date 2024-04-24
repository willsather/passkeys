export function encode(buffer: ArrayBuffer): string {
  const uint8Array = new Uint8Array(buffer);
  const binaryString = uint8Array.reduce(
    (acc, byte) => acc + String.fromCharCode(byte),
    ""
  );

  return btoa(binaryString)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

export function decode(base64URLString: string): ArrayBuffer {
  const base64 = base64URLString.replace(/-/g, "+").replace(/_/g, "/");

  /**
   * Pad with '=' until it's a multiple of four
   * (4 - (85 % 4 = 1) = 3) % 4 = 3 padding
   * (4 - (86 % 4 = 2) = 2) % 4 = 2 padding
   * (4 - (87 % 4 = 3) = 1) % 4 = 1 padding
   * (4 - (88 % 4 = 0) = 4) % 4 = 0 padding
   */
  const padLength = (4 - (base64.length % 4)) % 4;
  const paddedString = base64.padEnd(base64.length + padLength, "=");

  const binaryString = atob(paddedString);

  const buffer = new ArrayBuffer(binaryString.length);
  const uint8Array = new Uint8Array(buffer);

  uint8Array.set(Array.from(binaryString, (char) => char.charCodeAt(0)));

  return buffer;
}
