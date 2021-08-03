import json
import boto3

def handler(event, context):
  
  ssm = boto3.client("ssm")
  u = f"{int(ssm.get_parameter(Name='convouniques')['Parameter']['Value']) + 1}"
  ssm.put_parameter(Name="convouniques", Value=u, Overwrite=True)
  
  return {
      'statusCode': 200,
      'headers': {
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
      },
      'body': u
  }