import CryptoJS from 'crypto-js';

// Encrypt function in ReactJS
export const encryptAES = (text, key) => {
  // Ensure the key is 16 bytes long
  const keyHex = CryptoJS.enc.Utf8.parse(key); // Parse the key
  if (keyHex.sigBytes !== 16) {
    throw new Error('Key must be 16 bytes long for AES-128');
  }

  // Generate a random initialization vector (IV) for CBC mode
  const iv = CryptoJS.lib.WordArray.random(16);

  // Encrypt the text with AES using CBC mode and PKCS7 padding
  const encrypted = CryptoJS.AES.encrypt(text, keyHex, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });

  // Convert encrypted data and IV to base64 strings
  const encryptedText = encrypted.toString();
  const ivBase64 = iv.toString(CryptoJS.enc.Base64);

  return { encryptedText, ivBase64 };
};