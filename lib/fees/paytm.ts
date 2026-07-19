import crypto from "crypto";

/**
 * Generates a Paytm API request signature.
 * Body must be JSON-stringified with minimal separators (no spaces).
 */
export function generateSignature(bodyJson: string, key: string): string {
  return crypto.createHmac("sha256", key).update(bodyJson).digest("base64");
}

/**
 * Verifies a Paytm callback form POST checksum.
 * Params should not include CHECKSUMHASH.
 */
export function verifySignature(
  params: Record<string, string>,
  key: string,
  checksum: string
): boolean {
  const sortedKeys = Object.keys(params).sort();
  const paramStr = sortedKeys.map((k) => params[k] ?? "").join("|");
  const expected = crypto
    .createHmac("sha256", key)
    .update(paramStr)
    .digest("base64");
  return expected === checksum;
}

export function buildPaytmRequestHeaders(
  body: Record<string, unknown>,
  key: string
): Record<string, string> {
  const bodyJson = JSON.stringify(body);
  return {
    "Content-Type": "application/json",
    signature: generateSignature(bodyJson, key),
  };
}
