const postTypeDefs = `#graphql

  type Author {
    name: String!
    email: String!
}

type Post {
    id: String!
    title: String!
    content: String!
    category: String!
    tags: [String]!
    isAuthor: Boolean!
    author: Author!
}

type PostResponse {
    success: Boolean
    message: String
    data: Post
}

type Query {
    getAllPost: [Post]
}


    type Mutation {
        createPost(title:String!,content:String!,category:String!,tags:[String]):PostResponse
        deletePost(postId:String!): PostResponse
    }

`;

module.exports = postTypeDefs;
