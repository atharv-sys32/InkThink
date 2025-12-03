import gql from 'graphql-tag';

export const LOGIN_MUTATION = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password)
  }
`;

export const REGISTER_MUTATION = gql`
  mutation createUser($createUserInput: CreateUserInput!) {
    createUser(createUserInput: $createUserInput) {
      id
      name
      email
      role
    }
  }
`;
