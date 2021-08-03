## Repository for the Conversation Chatbot

### TODOS and GOODIDEAS
 - Poll blockchain periodically, or before each request, and update training text with answers for *Who is the owner of this token/layer?* or *What is the value of this layer?* to be able to answer blockchain questions in the chatbot itself.
 - Can be a separate running ECS Docker Task that live updates the training text in S3 as it gets pulled in from Lambda
 - Or can just make the query, update the training text, and get the response on each request.  We would have to look at the trade 

# Steps
### Activate the virtual environment
- `. convoenv/bin/activate`
- `source convoenv/bin/activate`

# References
- https://www.twilio.com/blog/getting-started-with-openai-s-gpt-3-in-node-js
- https://github.com/sharthan/Async_bp/blob/main/indexbp.html
- https://github.com/nurecas/regalia/blob/master/Regalia.js


# Contract Schema
- https://thegraph.com/explorer/subgraph/asyncart/async-art?selected=playground
