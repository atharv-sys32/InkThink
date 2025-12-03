import gql from 'graphql-tag';

// Query for admin panel - includes post.user field for filtering
export const GET_COMMENTS = gql`
  query {
    comments {
      id
      content
      user {
        id
        name
        email
      }
      post {
        id
        name
        user {
          id
          name
        }
      }
      status
      createdAt
      updatedAt
    }
  }
`;

// Query for public blog - excludes post.user field
export const GET_COMMENTS_PUBLIC = gql`
  query {
    comments {
      id
      content
      user {
        id
        name
        email
      }
      post {
        id
        name
      }
      status
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_COMMENT = gql`
  mutation createComment($createCommentInput: CreateCommentInput!) {
    createComment(createCommentInput: $createCommentInput) {
      id
      content
      status
    }
  }
`;

export const UPDATE_COMMENT = gql`
  mutation updateComment($updateCommentInput: UpdateCommentInput!) {
    updateComment(updateCommentInput: $updateCommentInput) {
      id
      content
      status
    }
  }
`;

export const DELETE_COMMENT = gql`
  mutation removeComment($id: Int!) {
    removeComment(id: $id) {
      id
      content
    }
  }
`;
