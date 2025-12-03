import gql from 'graphql-tag';

export const GET_TAGS = gql`
  query {
    tags {
      id
      name
      slug
      status
    }
  }
`;

export const CREATE_TAG = gql`
  mutation createTag($createTagInput: CreateTagInput!) {
    createTag(createTagInput: $createTagInput) {
      id
      name
      slug
      status
    }
  }
`;

export const UPDATE_TAG = gql`
  mutation updateTag($id: Int!, $updateTagInput: UpdateTagInput!) {
    updateTag(id: $id, updateTagInput: $updateTagInput) {
      id
      name
      slug
      status
    }
  }
`;

export const DELETE_TAG = gql`
  mutation removeTag($id: Int!) {
    removeTag(id: $id)
  }
`;
