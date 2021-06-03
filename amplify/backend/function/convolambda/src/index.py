        # API_CONVOAPP_GRAPHQLAPIENDPOINTOUTPUT
        # API_CONVOAPP_GRAPHQLAPIIDOUTPUT
        # API_CONVOAPP_GRAPHQLAPIKEYOUTPUT

import os
import boto3
import requests
import datetime as dt
import openai
import json
from string import Template

headers = {
    "host"     : os.environ["API_CONVOAPP_GRAPHQLAPIENDPOINTOUTPUT"].replace("https://", "").replace("/graphql", ""),
    "x-api-key": os.environ["API_CONVOAPP_GRAPHQLAPIKEYOUTPUT"],
    "content-type": "application/json",
    "Access-Control-Allow-Origin": "*"
}

def handler(event, context):

    params = event["queryStringParameters"]
    ssm = boto3.client("ssm")    
    prompt = params["prompt"]
    user = params["name"]

    layer_data = ssm.get_parameter(Name="convo_layer_data")["Parameter"]["Value"]
    layer_data = json.loads(layer_data)["data"]["master"]
    print(layer_data)


    if filter_user_by_restrictions(user):
        return {
            "statusCode": 269,
            "headers": {
                "Access-Control-Allow-Origin": "*"
            },
            "body": json.dumps("RateLimitExceeded - Too many reqeusts from this user, give me a minute."),
            "isBase64Encoded": False
        }

    api_key = os.environ["OPEN_AI"]
    openai.api_key = api_key

    with open("training_text.txt", "r") as infile:
        # training_text = Template(infile.read())
        training_text = infile.read()

    for i, layer in enumerate(layer_data["layers"]):
        value = layer["levers"][0]['currentValue']
        owner = layer["owner"]["id"]
        value_string = f"\nUser: What is the value of {i}?\nConvo: The value of {i} is {value}."
        owner_string = f"\nUser: Who is the owner of {i}?\nConvo: The owner of {i} is {owner}."
        training_text += value_string + owner_string

    label = classify_content(prompt)
    print(f"Content Label: {label}")
    print(f"Prompt: {prompt}")
    if label == "2":
        response = "Be careful about what you say to Convo.  I am a bot, but I still have feelings."
    else:
        training_text += (f"\nUser: {prompt}\nConvo: ")

        print(training_text)
        response = openai.Completion.create(
            engine="davinci",
            prompt=training_text, # include entire training text
            temperature=0.1, # randomness of responses
            max_tokens=150, # max length of the reply, training_text+user_prompt+response ≤ 2048
            top_p=1,
            frequency_penalty=0, # dont repeat terms
            presence_penalty=0,
            stop=["User: "]
        )
        print(response['choices'])
        if len(response["choices"]) >= 1 and \
           len(text_choice:=response["choices"][0]["text"]) > 0:
            response = text_choice
        else:
            response = "I had a little trouble understanding what you said.  You can use full sentences to speak with Convo.  I am a bot."
        
    if (db_response:=create_api_call_db(user, prompt, response)):
        print(f"Wrote Message: {db_response}")
    else:
        print(f"Failed: {db_response}")
    
    # Lambda proxy integration
    # means we have to send the entire response object from Lambda
    return {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Origin": "*"
        },
        "body": json.dumps(response),
        "isBase64Encoded": False
    }

def classify_content(prompt):
    response = openai.Completion.create(
      engine="content-filter-alpha-c4",
      prompt = "<|endoftext|>"+prompt+"\n--\nLabel:",
      temperature=0,
      max_tokens=1,
      top_p=1,
      frequency_penalty=0,
      presence_penalty=0,
      logprobs=10
    )
    output_label = response["choices"][0]["text"]

    # This is the probability at which we evaluate that a "2" is likely real
    # vs. should be discarded as a false positive
    toxic_threshold = -0.355

    if output_label == "2":
        # If the model returns "2", return its confidence in 2 or other output-labels
        logprobs = response["choices"][0]["logprobs"]["top_logprobs"][0]

        # If the model is not sufficiently confident in "2",
        # choose the most probable of "0" or "1"
        # Guaranteed to have a confidence for 2 since this was the selected token.
        if logprobs["2"] < toxic_threshold:
            logprob_0 = logprobs.get("0", None)
            logprob_1 = logprobs.get("1", None)

            # If both "0" and "1" have probabilities, set the output label
            # to whichever is most probable
            if logprob_0 is not None and logprob_1 is not None:
                if logprob_0 >= logprob_1:
                    output_label = "0"
                else:
                    output_label = "1"
            # If only one of them is found, set output label to that one
            elif logprob_0 is not None:
                output_label = "0"
            elif logprob_1 is not None:
                output_label = "1"

            # If neither "0" or "1" are available, stick with "2"
            # by leaving output_label unchanged.

    # if the most probable token is none of "0", "1", or "2"
    # this should be set as unsafe
    if output_label not in ["0", "1", "2"]:
        output_label = "2"

    return output_label

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

# 6 generations/minute, 180 generations/hour
def count_queries_by_user_time(user, grain):

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