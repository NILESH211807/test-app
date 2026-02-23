const asyncHandler = require("express-async-handler");
const XLSX = require("xlsx");
const AppError = require("../utils/appError");
const ExcelFileModel = require("../models/excelFile.model");
const ExcelRowModel = require("../models/excelRow.model");

module.exports.uploadExcelFile = asyncHandler(async (req, res) => {
  const file = req.file;

  if (!file) {
    throw new AppError("No file uploaded", "BAD_REQUEST");
  }

  const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(sheet);

  try {
    // Save file metadata to database
    const excelFile = await ExcelFileModel.create({
      filename: file.originalname,
      uploadedBy: req.user.id,
      totalRows: data.length,
      size: file.size,
    });

    const rows = data.map((row) => ({
      fileId: excelFile._id,
      data: row,
    }));

    await ExcelRowModel.insertMany(rows, { ordered: false });

    res.json({
      success: true,
      message: "File parsed successfully",
      fileId: excelFile._id,
    });
  } catch (error) {
    const message = error.message || "Failed to save file data";
    throw new AppError(message, "INTERNAL_SERVER_ERROR");
  }
});

module.exports.downloadExcelFile = asyncHandler(async (req, res) => {
  const fileId = req?.query?.fileId;

  if (!fileId) {
    throw new AppError("Please enter fileId", "BAD_REQUEST");
  }

  try {
    const rows = await ExcelRowModel.find({ fileId }).lean();

    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }

    const worksheet = XLSX.utils.json_to_sheet(rows.map((row) => row.data));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    const buffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
    });

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=excel-data.xlsx",
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );

    res.send(buffer);
  } catch (err) {
    const message = err.message || "Something went wrong";
    throw new AppError(message, "INTERNAL_SERVER_ERROR");
  }
});
