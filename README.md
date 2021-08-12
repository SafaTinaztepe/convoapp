## Repository for the Conversation Chatbot

### TODOS
 - frontend design

# Steps
### Activate the virtual environment (required for Amplify cli)
- `. convoenv/bin/activate` or `source convoenv/bin/activate`

### Start local development server
- `yarn start` or `npm start`

### Deploy
- `amplify push` to push backend resources or `amplify publish` to also push frontend

# References
- https://www.twilio.com/blog/getting-started-with-openai-s-gpt-3-in-node-js
- https://github.com/sharthan/Async_bp/blob/main/indexbp.html
- https://github.com/nurecas/regalia/blob/master/Regalia.js


# Contract Schema
- https://thegraph.com/explorer/subgraph/asyncart/async-art?selected=playground


## Issue
- Serverless backend might not work at scale
- convert to ec2
- store everything in cloudwatch logs not dynamo db, export to S3