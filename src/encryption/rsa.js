const crypto = require("crypto");
const fs = require("fs");

// Generate RSA key pair and save in a JSON file
function generateAndSaveRSAKeyPair() {
  const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048,
  });

  const publicKeyPem = publicKey.export({
    type: "spki",
    format: "pem",
  });

  const privateKeyPem = privateKey.export({
    type: "pkcs8",
    format: "pem",
  });

  const keyPair = {
    publicKey: publicKeyPem,
    privateKey: privateKeyPem,
  };

  fs.writeFileSync("rsa_keys.json", JSON.stringify(keyPair));
  console.log("RSA key pair has been saved in rsa_keys.json file.");
}

// Read the RSA key pair from the JSON file
function readRSAKeyPair() {
  const jsonData = fs.readFileSync("rsa_keys.json", "utf8");
  const keyPair = JSON.parse(jsonData);
  return keyPair;
}

// Encrypt data using the RSA public key from the JSON file
function encryptWithPublicKey(data) {
  const keyPair = readRSAKeyPair();

  const publicKey = crypto.createPublicKey({
    key: keyPair.publicKey,
    format: "pem",
    type: "spki",
  });

  const encryptedData = crypto.publicEncrypt(
    publicKey,
    Buffer.from(data, "utf8")
  );
  return encryptedData.toString("base64");
}

// Decrypt data using the RSA private key from the JSON file
function decryptWithPrivateKey(encryptedData) {
  const keyPair = readRSAKeyPair();

  const privateKey = crypto.createPrivateKey({
    key: keyPair.privateKey,
    format: "pem",
    type: "pkcs8",
  });

  const decryptedData = crypto.privateDecrypt(
    privateKey,
    Buffer.from(encryptedData, "base64")
  );
  return decryptedData.toString("utf8");
}

module.exports = {
  generateAndSaveRSAKeyPair,
  encryptWithPublicKey,
  decryptWithPrivateKey,
};
