var Sentencer = require("sentencer")

const generateRandomData = (userContext, events, done) => {
  var prompt = Sentencer.make("What do you think about {{ adjective }} {{ noun }}?");
  var name = "user-" + Math.random().toFixed(1)*10

  userContext.vars.prompt = prompt
  userContext.vars.name = name

  return done()
}

function handleResponse (requestParams, response, context, ee, next) {
  if (response.statusCode !== 200) {
    console.log(response.body);
  }
  return next();
}

module.exports = { generateRandomData, handleResponse }