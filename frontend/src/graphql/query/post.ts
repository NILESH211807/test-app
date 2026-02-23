import { gql } from "@apollo/client";

export const GET_ALL_POST = gql`
    query getAllPost{
        getAllPost{
            id
      title
      content
      category
      tags,
      isAuthor
      author{
        name,
        email
      }
        }
    }
`;