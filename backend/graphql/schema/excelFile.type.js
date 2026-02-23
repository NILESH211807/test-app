const excelFileTypeDef = `#graphql

scalar JSON

type GetAllExcelFileResp {
  success: Boolean!
  message: String!,
  data: [JSON!]!,
  length: Int!
}

type ExcelRowsResponse {
  success: Boolean!
  message: String!
  rows: [JSON!]!
  length: Int!
}

type Response {
    success: Boolean!,
    message: String!
}

type Query {
  getExcelFiles(
    fileId: ID!,
    page: Int,
    limit: Int
  ): ExcelRowsResponse!

  getAllExcelFile(isPublic:Boolean, page:Int, limit: Int): GetAllExcelFileResp

}


  type Mutation {
    changeFileVisibility(fileId:String!,visibility: String!): Response

    deleteFile (fileId: String!): Response

    # downloadExcelFile(fileId: String!): Response
  }


`;

module.exports = excelFileTypeDef;
