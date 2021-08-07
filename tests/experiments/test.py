
import requests
import datetime as dt

headers = {
    "host":"tp75ujv7h5dbhmv5trlwre5y54.appsync-api.us-east-1.amazonaws.com",
    "x-api-key":"da2-gjbmhorbgzd7xgrjxljhd5ehti"
}

query = """query ListApiCalls(
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
"""

def run_query(query): # A simple function to use requests.post to make the API call. Note the json= section.
    # request = requests.post('https://tp75ujv7h5dbhmv5trlwre5y54.appsync-api.us-east-1.amazonaws.com/graphql', json={'query': query, 'input':{'filter': {"createdAt": {"between": ["2021-03-17T20:56:14.654Z", "2021-03-17T20:58:14.654Z"]}}}}, headers=headers)
    request = requests.post('https://tp75ujv7h5dbhmv5trlwre5y54.appsync-api.us-east-1.amazonaws.com/graphql', json={'query': query, 'variables':{'filter':{'createdAt':{"between":[(dt.datetime.now()-dt.timedelta(days=1)).isoformat(), dt.datetime.now().isoformat()]}}}}, headers=headers)
    if request.status_code == 200:
        return request.json()
    else:
        raise Exception("Query failed to run by returning code of {}. {}".format(request.status_code, query))



response = run_query(query)#['data']['listApiCalls']['items']

# print(len(response))
print(response)
