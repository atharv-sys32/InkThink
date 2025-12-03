import gql from 'graphql-tag';

export const GET_CATEGORIES = gql`
  query {
    categories {
      id
      name
      slug
      icon
      status
    }
  }
`;

export const CREATE_CATEGORY = gql`
  mutation createCategory($createCategoryInput: CreateCategoryInput!) {
    createCategory(createCategoryInput: $createCategoryInput) {
      id
      name
      slug
      icon
      status
    }
  }
`;

export const UPDATE_CATEGORY = gql`
  mutation updateCategory($id:Int!, $updateCategoryInput: UpdateCategoryInput!) {
    updateCategory(id:$id, updateCategoryInput: $updateCategoryInput) {
      id
      name
      slug
      icon
      status
    }
  }
`

export const DELETE_CATEGORY = gql`
  mutation removeCategory($id: Int!) {
    removeCategory(id: $id) {
      status
      message
    }
  }
`;
