import json
import boto3
import requests

def handler(event, context):
    print('received event:')
    print(event)

    ssm = boto3.client("ssm")
    asyncMasterID = '256'
    url = "https://api.thegraph.com/subgraphs/name/asyncart/async-art"
    headers = {
        "Content-Type": "application/json"
    }
    body = { "query": \
        """{
            master(id:""" + asyncMasterID + """){
                owner
                lastSale {
                    timestamp
                }
                layers {
                    levers {
                        currentValue
                    }
                    owner {
                        id
                    }
                }
            }
            }"""
        }

    res = requests.post(url, json.dumps(body), headers=headers)

    # print(res)
    print(res.text)
    ssm.put_parameter(Name="convo_layer_data", Value=res.text)
    
    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
        },
        'body': "Worked!"
    }