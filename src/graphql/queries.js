/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getApiCall = /* GraphQL */ `
  query GetApiCall($id: ID!) {
    getApiCall(id: $id) {
      id
      user
      message
      response
      createdAt
      updatedAt
    }
  }
`;
export const listApiCalls = /* GraphQL */ `
  query ListApiCalls(
    $filter: ModelApiCallFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listApiCalls(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        user
        message
        response
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
