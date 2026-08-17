import { Base64, DES, ECB, Pkcs7, Utf8 } from "crypto-es";

export function decryptMedia(encryptedUrl: string): string {
  if (!encryptedUrl || typeof encryptedUrl !== "string") {
    return "";
  }

  try {
    const key = Utf8.parse("38346591");

    const decrypted = DES.decrypt(
      {
        ciphertext: Base64.parse(encryptedUrl),
      },
      key,
      {
        mode: ECB,
        padding: Pkcs7,
      },
    );

    return decrypted.toString(Utf8);
  } catch {
    return "";
  }
}
