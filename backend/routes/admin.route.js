const express = require("express");
const router = express.Router();
const { isAuth } = require("../middlewares/auth");
const {
  uploadExcelFile,
  downloadExcelFile,
} = require("../controllers/admin.controller");
const upload = require("../middlewares/upload");

router.post(
  "/parse-excel",
  isAuth,
  upload.single("excelFile"),
  uploadExcelFile,
);

router.get("/download", isAuth, downloadExcelFile);

module.exports = router;
