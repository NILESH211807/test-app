const { getExcelFile } = require("../../services/admin.service");

const excelFileResolver = {
  Query: {
    getExcelFiles: async (_, args, { user }) => getExcelFile(args, user),
  },
};

module.exports = excelFileResolver;
