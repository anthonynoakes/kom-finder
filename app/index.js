const express = require('express')
const url = require('url');
const request = require('request');

const path = require('path')
const PORT = process.env.PORT || 5000

var app = express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .get('/', (req, res) => res.send(render(req)))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))

render = (request) => {
  var url_parts = url.parse(request.url, true);
  var query = url_parts.query;
  console.log(`Listening on ${JSON.stringify(query)}`)

  return stravaOathHandshake(query.code);
}

stravaOathHandshake = (code) =>
{
  var client_id = process.env.client_id;
  var client_secret = process.env.client_secret; 
  var requst_body = {
    json: {
      client_id: client_id,
      client_secret: client_secret,
      code: code
    } };

  request.post(
    "https://www.strava.com/oauth/token",
    requst_body,
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body);
            bearer = body.token_type + " " + body.access_token
            return body.access_token
        }
      }
  );

  return "success"
}
