import gql from 'graphql-tag';

// Query for admin panel - includes user field for filtering
export const GET_POSTS = gql`
  query {
    posts {
      id
      name
      summary
      description
      slug
      image
      status
      user {
        id
        name
        email
      }
      category {
        id
        name
      }
      tags {
        id
        name
      }
      createdAt
      updatedAt
    }
  }
`;

// Query for public blog - excludes user field
export const GET_POSTS_PUBLIC = gql`
  query {
    posts {
      id
      name
      summary
      description
      slug
      image
      status
      category {
        id
        name
      }
      tags {
        id
        name
      }
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_POST = gql`
  mutation createPost($createPostInput: CreatePostInput!) {
    createPost(createPostInput: $createPostInput) {
      id
      name
      summary
      description
      slug
      image
      status
    }
  }
`;

export const UPDATE_POST = gql`
  mutation updatePost($updatePostInput: UpdatePostInput!) {
    updatePost(updatePostInput: $updatePostInput) {
      id
      name
      summary
      description
      slug
      image
      status
      category {
        id
        name
      }
      tags {
        id
        name
      }
    }
  }
`;

export const DELETE_POST = gql`
  mutation removePost($id: Int!) {
    removePost(id: $id) {
      id
      name
    }
  }
`;
