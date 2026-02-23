import { gql } from "@apollo/client";


// create post 
export const CREATE_POST = gql`
    mutation CreatePost($title: String!, $content: String!, $category: String!,$tags:[String]){
      createPost(title: $title, content: $content, category: $category, tags: $tags) {
        success,
        message,
        data {
          title,
          content,
          category,
          tags
        }
      }
    },
`

export const DELETE_POST = gql`
  mutation DeletePost($postId: String!) {
    deletePost(postId: $postId) {
      success,
      message,
      data{
        id,
      title,
      content,
      category,
      tags
      }
    }
  }
`;