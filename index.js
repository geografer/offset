var express = require('express');
var bodyParser = require('body-parser');
var plaid = require('plaid');

var APP_PORT = process.env.PORT || 8000;

/*var client = new plaid.Client(
  PLAID_CLIENT_ID,
  PLAID_SECRET,
  PLAID_PUBLIC_KEY,
  plaid.environments[PLAID_ENV]
); */

var app = express();

app.use(express.static('client/build'));


var server = app.listen(APP_PORT, function() {
  console.log('Offset server listening on ' + APP_PORT);
});
