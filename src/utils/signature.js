import CryptoJS from "crypto-js";

/**
 * AES 加密（与后端保持一致）
 */
export function aesEncrypt(data, key) {
  const keyHex = CryptoJS.enc.Utf8.parse(key);
  const ivHex = CryptoJS.enc.Utf8.parse("0000000000000000"); // 后端 null 相当于 16 个 0
  const encrypted = CryptoJS.AES.encrypt(data, keyHex, {
    iv: ivHex,
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });
  return encrypted.toString(); // base64 输出
}

/**
 * Base64 编码
 */
export function base64Encode(str) {
  return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(str))
}

/**
 * 生成前端 request-info
 */
export function buildInfo(originalJson) {
  let prefix = "0123456789abcdef";
  let suffix = "0123456789abcdef";
  let key = prefix + suffix; // 32 位密钥

  const encrypted = aesEncrypt(originalJson, key); // AES + Base64
  const combined = prefix + encrypted + suffix;

  return base64Encode(combined);
}

/**
 * 生成签名（与后端 SignatureUtils 保持一致）
 */
export function generateSignature(appCode, appSecret, requestUuid, requestTime, requestRegion, originalJson, uri, algorithm = "HmacSHA256") {
  const raw = `${appCode}${appSecret}${requestUuid}${requestTime}${requestRegion}${originalJson}${uri}`;
  return CryptoJS.HmacSHA256(raw, appSecret).toString();
}
