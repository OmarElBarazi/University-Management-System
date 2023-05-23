const express = require("express");
const router = express.Router();
const authMiddlware = require("../middlware/authMiddlware");

const desKeyGenerator = require("../encryption/des");
const rsaKeyGenerator = require("../encryption/rsa");

router.post(
  "/des",
  authMiddlware.userAuth,
  authMiddlware.userCheckRole("staff"),
  desKeyGenerator.generateAndSaveDESKey
);

router.post(
  "/rsa",
  authMiddlware.userAuth,
  authMiddlware.userCheckRole("staff"),
  rsaKeyGenerator.generateAndSaveRSAKeyPair
);

module.exports = router;
