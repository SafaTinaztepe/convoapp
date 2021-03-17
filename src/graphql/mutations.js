/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createApiCall = /* GraphQL */ `
  mutation CreateApiCall(
    $input: CreateApiCallInput!
    $condition: ModelApiCallConditionInput
  ) {
    createApiCall(input: $input, condition: $condition) {
      id
      user
      message
      response
      createdAt
      updatedAt
    }
  }
`;
export const updateApiCall = /* GraphQL */ `
  mutation UpdateApiCall(
    $input: UpdateApiCallInput!
    $condition: ModelApiCallConditionInput
  ) {
    updateApiCall(input: $input, condition: $condition) {
      id
      user
      message
      response
      createdAt
      updatedAt
    }
  }
`;
export const deleteApiCall = /* GraphQL */ `
  mutation DeleteApiCall(
    $input: DeleteApiCallInput!
    $condition: ModelApiCallConditionInput
  ) {
    deleteApiCall(input: $input, condition: $condition) {
      id
      user
      message
      response
      createdAt
      updatedAt
    }
  }
`;
