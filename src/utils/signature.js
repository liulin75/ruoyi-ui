import CryptoJS from "crypto-js";

/**
 * AES CTR NoPadding 加密（完全对应后端）
 */
export    function aesEncryptCTR(content) {

  return CryptoJS.SHA256(content).toString(CryptoJS.enc.Hex);;

  
  // const keyHex = CryptoJS.enc.Utf8.parse(key);
  // const ivHex = CryptoJS.enc.Utf8.parse(iv);

  // const encrypted = CryptoJS.AES.encrypt(content, keyHex, {
  //   iv: ivHex,
  //   mode: CryptoJS.mode.CTR,
  //   padding: CryptoJS.pad.NoPadding
  // });

  // return encrypted.toString(); // Base64
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

export function buildInfo(originalJson) {
  let prefix = "0123456789abcdef";
  let suffix = "0123456789abcdef";
  let key = prefix + suffix; // 32 字节 key
  let iv = null; // 或后端给的
      console.log('buildInfobuildInfobuildInfokeykeykeykeykeykey',key);
  const encrypted = aesEncryptCTRJava(originalJson, key, iv); 
    // const encrypted = aesEncryptCTR(originalJson, key, iv); 
  const combined = prefix + encrypted + suffix;

  return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(combined));
}



export function aesEncryptCTRJava(content, key, iv) {
  const keyWords = CryptoJS.enc.Utf8.parse(key);
  const ivWords = CryptoJS.enc.Utf8.parse(iv);

  // CTR 模式直接传入 iv 作为 counter
  const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(content), keyWords, {
    iv: ivWords,
    mode: CryptoJS.mode.CTR,
    padding: CryptoJS.pad.NoPadding
  });

  const encryptData = encrypted.ciphertext.toString(CryptoJS.enc.Base64);
  let prefix = "0123456789abcdef";
  let suffix = "0123456789abcdef";
  const combined = prefix + encryptData + suffix;
  return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(combined));


  // return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
}



