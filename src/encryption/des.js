const crypto = require("crypto");
const fs = require("fs");

// Read the DES key from des.env file
function readDESKey() {
  const envContent = fs.readFileSync("des.env", "utf8");
  const matches = envContent.match(/DES_KEY=(.*)/);
  if (matches && matches[1]) {
    const keyHex = matches[1];
    return Buffer.from(keyHex, "hex");
  }
  throw new Error("DES key not found in des.env file.");
}

// Generate DES key and save in des.env file
function generateAndSaveDESKey() {
  const key = crypto.randomBytes(8);
  const keyHex = key.toString("hex");

  fs.writeFileSync("des.env", `DES_KEY=${keyHex}`);
  console.log("DES key has been saved in the des.env file.");
}

// Create a DES cipher object with the provided key
function createDesCipher(key) {
  return crypto.createCipheriv("des", key, null);
}

// Create a DES decipher object with the provided key
function createDesDecipher(key) {
  return crypto.createDecipheriv("des", key, null);
}

// Encrypt data using the DES cipher
function encryptWithDES(data) {
  const key = readDESKey();
  const cipher = createDesCipher(key);
  let encryptedData = cipher.update(data, "utf8", "hex");
  encryptedData += cipher.final("hex");
  return encryptedData;
}

// Decrypt encrypted data using the DES decipher
function decryptWithDES(encryptedData) {
  const key = readDESKey();
  const decipher = createDesDecipher(key);
  let decryptedData = decipher.update(encryptedData, "hex", "utf8");
  decryptedData += decipher.final("utf8");
  return decryptedData;
}

module.exports = {
  generateAndSaveDESKey,
  encryptWithDES,
  decryptWithDES,
};
