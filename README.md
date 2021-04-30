## Repository for the Conversation Chatbot

### TODOS and GOODIDEAS
 - Poll blockchain periodically, or before each request, and update training text with answers for *Who is the owner of this token/layer?* or *What is the value of this layer?* to be able to answer blockchain questions in the chatbot itself.
 - Can be a separate running ECS Docker Task that live updates the training text in S3 as it gets pulled in from Lambda
 - Or can just make the query, update the training text, and get the response on each request.  We would have to look at the trade 