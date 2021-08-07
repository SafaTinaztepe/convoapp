from flask import Flask, request
import os
import boto3
import requests
import datetime as dt
import openai
import json

app = Flask(__name__)

headers = {
    "content-type": "application/json",
    "Access-Control-Allow-Origin": "*"
}
# api_key = os.environ["OPEN_AI"]
# api_key = "sk-l9aZYTbZq7eBa4gs9L2Li7WOY30amDJUSPJ02wRY"
openai.api_key = api_key
ssm = boto3.client("ssm")  
training_text = None
with open("training_text.txt", "r") as infile:
    training_text = infile.read()
layer_data = ssm.get_parameter(Name="convo_layer_data")["Parameter"]["Value"]
layer_data = json.loads(layer_data)["data"]["master"]
for i, layer in enumerate(layer_data["layers"]):
    value = layer["levers"][0]['currentValue']
    owner = layer["owner"]["id"]
    value_string = f"\nUser: What is the value of {i}?\nConvo: The value of {i} is {value}."
    owner_string = f"\nUser: Who is the owner of {i}?\nConvo: The owner of {i} is {owner}."
    training_text += value_string + owner_string

@app.route("/convo", methods=['GET'])
def convo():
    if not("prompt" in request.args and "name" in request.args):
        return {"status": 400, "body": "Invalid Parameters"}

    params = request.args
    prompt = params["prompt"][:200]
    user = params["name"]
    label = classify_content(prompt, user)
    print(f"Content Label: {label}")
    print(f"Prompt: {prompt}")
    if label == "2":
        response = "Be careful about what you say to Convo.  I am a bot, but I still have feelings."
    else:
        training_text += (f"\nUser: {prompt}\nConvo: ")
        return {"text": training_text}
        # print(training_text)
        # response = openai.Completion.create(
        #     engine="davinci",
        #     prompt=training_text, # include entire training text
        #     temperature=0.1, # randomness of responses
        #     max_tokens=100, # max length of the reply, training_text+user_prompt+response ≤ 2048
        #     top_p=1,
        #     frequency_penalty=0, # dont repeat terms
        #     presence_penalty=0,
        #     stop=["User: ", "Convo: "],
        #     user=user
        # )
        # # print(response['choices'])
        # if len(response["choices"]) >= 1 and \
        #    len(text_choice:=response["choices"][0]["text"]) > 0:
        #     response = text_choice
        # else:
        #     response = "I had a little trouble understanding what you said.  You can use full sentences to speak with Convo.  I am a bot."
        
    # create_api_call_db(user, prompt, response)
    
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

def classify_content(prompt, user):
    response = openai.Completion.create(
      engine="content-filter-alpha-c4",
      prompt = "<|endoftext|>"+prompt+"\n--\nLabel:",
      temperature=0,
      max_tokens=1,
      top_p=1,
      frequency_penalty=0,
      presence_penalty=0,
      logprobs=10
    #   user=user
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

app.run()