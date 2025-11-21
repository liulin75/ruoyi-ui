import CryptoJS from "crypto-js";

/**
 * AES CTR NoPadding 加密（完全对应后端）
 */
export function aesEncryptCTR(content) {
  return CryptoJS.SHA256(content).toString(CryptoJS.enc.Hex);
}

/**
 * AES CTR NoPadding 解密
 */
export function aesDecryptCTR(base64Content, key, iv) {
  const keyHex = CryptoJS.enc.Utf8.parse(key);
  const ivHex = CryptoJS.enc.Utf8.parse(iv);

  const decrypted = CryptoJS.AES.decrypt(base64Content, keyHex, {
    iv: ivHex,
    mode: CryptoJS.mode.CTR,
    padding: CryptoJS.pad.NoPadding
  });

  return CryptoJS.enc.Utf8.stringify(decrypted);
}

// 接口参数加密
export function buildInfo(aa) {
  const key = "0123456789abcdef0123456789abcdef"; // 32字节
  const iv = "1111111111111111";                  // 16字节
  function aesEncryptCTR(content, key, iv) {
    const keyWords = CryptoJS.enc.Utf8.parse(key);
    const ivWords = CryptoJS.enc.Utf8.parse(iv);

    const encrypted = CryptoJS.AES.encrypt(
      CryptoJS.enc.Utf8.parse(content),
      keyWords,
      {
        iv: ivWords,
        mode: CryptoJS.mode.CTR,
        padding: CryptoJS.pad.NoPadding
      }
    );
    // 输出 Base64 密文
    return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
  }

  const encryptedAA = aesEncryptCTR(aa, key, iv);
  const prefix = "0123456789abcdef";
  const suffix = "0123456789abcdef";
  const combined = prefix + encryptedAA + suffix;

  const result = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Latin1.parse(combined));
  // 构造 info
  return result;
}

// 接口返回解密
export function decryptInfo(ccc) { 
    // 1. Base64 → combined（ASCII）
    const combined = CryptoJS.enc.Latin1.stringify(CryptoJS.enc.Base64.parse(ccc));
    // 取前 16 位
    const prefix = combined.substring(0, 16);
    // 取后 16 位
    const suffix = combined.substring(combined.length - 16);
    // 拼接
    const key = prefix + suffix;
    const encryptedBase64 = combined.slice(prefix.length, combined.length - suffix.length);
    const bbb = CryptoJS.enc.Base64.parse(encryptedBase64);
    const iv = '1111111111111111';                  // 16字节
    // 3. AES-CTR 解密
    const keyWords = CryptoJS.enc.Utf8.parse(key);
    const ivWords = CryptoJS.enc.Utf8.parse(iv);
  
    const decryptedWords = CryptoJS.AES.decrypt(
      { ciphertext: bbb },
      keyWords,
      {
        iv: ivWords,
        mode: CryptoJS.mode.CTR,
        padding: CryptoJS.pad.NoPadding
      }
    );
  
    // 4. 转回原始字符串（UTF-8）
    const decryptedStr = decryptedWords.toString(CryptoJS.enc.Utf8);
    return decryptedStr;      
}



