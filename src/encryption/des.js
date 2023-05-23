const crypto = require("crypto");
const fs = require("fs");

// Generate DES key and save in des_key.json file
function generateAndSaveDESKey() {
  const key = crypto.randomBytes(8);
  const iv = crypto.randomBytes(8);
  const keyHex = key.toString("hex");
  const ivHex = iv.toString("hex");
  const desKeyData = { key: keyHex, iv: ivHex };

  fs.writeFileSync("des_key.json", JSON.stringify(desKeyData));
  console.log("DES key and IV have been saved in the des_key.json file.");
}

// Read the DES key and IV from des_key.json file
function readDESKey() {
  const desKeyData = JSON.parse(fs.readFileSync("des_key.json", "utf8"));
  if (desKeyData && desKeyData.key && desKeyData.iv) {
    const keyHex = desKeyData.key;
    const ivHex = desKeyData.iv;
    const key = Buffer.from(keyHex, "hex");
    const iv = Buffer.from(ivHex, "hex");
    return { key, iv };
  }
  throw new Error("DES key or IV not found in des_key.json file.");
}

// Create a DES cipher object with the provided key and IV
function createDesCipher(key, iv) {
  return crypto.createCipheriv("des-cbc", key, iv);
}

// Create a DES decipher object with the provided key and IV
function createDesDecipher(key, iv) {
  return crypto.createDecipheriv("des-cbc", key, iv);
}

// Encrypt data using the DES cipher
function encryptWithDES(data) {
  const { key, iv } = readDESKey();
  const cipher = createDesCipher(key, iv);
  let encryptedData = cipher.update(data, "utf8", "hex");
  encryptedData += cipher.final("hex");
  return encryptedData;
}

// Decrypt encrypted data using the DES decipher
function decryptWithDES(encryptedData) {
  const { key, iv } = readDESKey();
  const decipher = createDesDecipher(key, iv);
  let decryptedData = decipher.update(encryptedData, "hex", "utf8");
  decryptedData += decipher.final("utf8");
  return decryptedData;
}

module.exports = {
  generateAndSaveDESKey,
  encryptWithDES,
  decryptWithDES,
};
