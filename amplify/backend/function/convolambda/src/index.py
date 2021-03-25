        # API_CONVOAPP_GRAPHQLAPIENDPOINTOUTPUT
        # API_CONVOAPP_GRAPHQLAPIIDOUTPUT
        # API_CONVOAPP_GRAPHQLAPIKEYOUTPUT

import os
import boto3
import requests
import datetime as dt
import openai
import json

headers = {
    "host"     : os.environ["API_CONVOAPP_GRAPHQLAPIENDPOINTOUTPUT"].replace("https://", "").replace("/graphql", ""),
    "x-api-key": os.environ["API_CONVOAPP_GRAPHQLAPIKEYOUTPUT"],
    "content-type": "application/json",
    "Access-Control-Allow-Origin": "*"
}

def handler(event, context):
    print('Event:', event)

    prompt = event["queryStringParameters"]["prompt"]
    user = event["queryStringParameters"]["name"]

    # if filter_user_by_restrictions(user):
    #     return "Block user" but in lambda request form    


    ssm = boto3.client("ssm")
    api_key = ssm.get_parameter(Name="openai_api_key", WithDecryption=True)['Parameter']['Value']
    openai.api_key = api_key

    with open("training_text.txt", "r") as infile:
        training_text = infile.read()

    # request = app.current_request

    training_text = f"{training_text}\nUser:{prompt}"
    print(user)
    print(prompt)
    # print(training_text)
    response = openai.Completion.create(
        engine="davinci",
        prompt=training_text,
        temperature=0.9,
        max_tokens=150, # max length of the reply, training_text+user_prompt+response ≤ 2048
        top_p=1,
        frequency_penalty=0,
        presence_penalty=0,
        stop=['.', '!', '?']
    )
    
    response = None
    responses = response["choices"][0]["text"].split("Convo: ")
    if len(responses) >= 1:
        response = responses[0] + "."
    else:
        response = "I have no idea what you just said."

    # content filtration model 

    if create_api_call_db(user, prompt, response):
        print("Wrote Message")
    else:
        print("Failed")
    
    # Lambda proxy integration
    # means we have to send the entire response object from Lambda
    return {
        "statusCode": 200,
        "headers": {
            "access-control-allow-origin": "*"
        },
        "body": json.dumps(response),
        "isBase64Encoded": False
    }

def create_api_call_db(user, message, response):

    mutation = None
    with open("gql/mutations/create.txt", "r") as infile:
        mutation = infile.read()

    ApiCall = {
        'user': user,
        'message': message,
        'response': response
    }

    response = None
    request = requests.post(os.environ['API_CONVOAPP_GRAPHQLAPIENDPOINTOUTPUT'], json={'query': mutation, 'variables':{'input':ApiCall}}, headers=headers)
    if request.status_code == 200:
        response = request.json()
    else:
        print(request.text)
        print(request)
        raise Exception("Query failed to run by returning code of {}. {}".format(request.status_code, mutation))

    return response

def filter_user_by_restrictions(user):
    user_hour_messages = count_queries_by_user_time(user, grain={'hours':1})
    user_min_messages  = count_queries_by_user_time(user, grain={'minutes':1})
    return user_hour_messages >= 180 or user_min_messages >= 6

def count_queries_by_user_time(user, grain):
# 6 generations/minute, 180 generations/hour

    query = None
    with open("gql/queries/list.txt", "r") as infile:
        query = infile.read()

    filters = {
        "user":{
            "eq": user
        },
        "createdAt":{
            "between":[
                (dt.datetime.now()-dt.timedelta(**grain)).isoformat(), # yesterday
                dt.datetime.now().isoformat()
            ]   
        }
    }

    response = None
    request = requests.post(os.environ['API_CONVOAPP_GRAPHQLAPIENDPOINTOUTPUT'], json={'query': query, 'variables':{'filter':filters}}, headers=headers)
    if request.status_code == 200:
        response = request.json()
    else:
        raise Exception("Query failed to run by returning code of {}. {}".format(request.status_code, query))

    n_items = response['data']['listApiCalls']['items']

    return len(n_items)