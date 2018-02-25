var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var plaid = require('plaid');
var moment = require('moment');

/* Heroku will load values from config variables in production */
var APP_PORT = process.env.PORT || 8000;
var PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID,
    PLAID_SECRET = process.env.PLAID_SECRET,
    PLAID_PUBLIC_KEY = process.env.REACT_APP_PLAID_PUBLIC_KEY,
    PLAID_ENV = process.env.REACT_APP_PLAID_ENV || "sandbox";

var ACCESS_TOKEN = null,
    PUBLIC_TOKEN = null,
    ITEM_ID = null;

var client = new plaid.Client(
  PLAID_CLIENT_ID,
  PLAID_SECRET,
  PLAID_PUBLIC_KEY,
  plaid.environments[PLAID_ENV]
);

var app = express();
var api = express.Router();

var mappingsRaw = fs.readFileSync("mappings.json");
var mappings = JSON.parse(mappingsRaw);

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

api.post('/get_access_token', function(request, response, next) {
  PUBLIC_TOKEN = request.body.public_token;
  client.exchangePublicToken(PUBLIC_TOKEN, function(error, tokenResponse) {
    if (error != null) {
      console.log(error);
      response.json({
        "status": "error",
        "message": "An error occured"
      });
      return;
    }
    ACCESS_TOKEN = tokenResponse.access_token;
    ITEM_ID = tokenResponse.item_id;
    response.json({
      "status": "success",
      "data": {
        "access_token": ACCESS_TOKEN,
        "item_id": ITEM_ID
      }
    });
  });
});

/*api.get('/account_types', function(request, response, next) {

}) */

api.get('/get_transactions', function(request, response, next) {
  ACCESS_TOKEN = request.query.access_token;

  var startDate = moment().subtract(30, 'days').format('YYYY-MM-DD');
  var endDate = moment().format('YYYY-MM-DD');

  client.getTransactions(ACCESS_TOKEN, startDate, endDate, {
    count: 250,
    offset: 0
  }, function(error, transactionsResponse) {
    if (error != null) {
      console.log(error);
      return;
    }
    transactionsResponse.transactions.forEach(function(t) {
      t["carbonCategory"] = "All";

      t["carbon"] = 0;
      t["carbonCategory"] = "Unknown";

      for (var i = 0; i < mappings.length; i += 1) {
        if (mappings[i].hasOwnProperty(t.category_id)) {
          t["carbon"] = t.amount * mappings[i][t.category_id]["Aland_CO2"] * (1.0/453.592);
          t["carbonCategory"] = mappings[i][t.category_id]["Aland_Transaction_Type"];
        }
      }

      /*if (mappings.hasOwnProperty(t.category_id) && mappings[t.category_id] != null) {
        t["carbon"] = t.amount * mappings[t.category_id];
      }
      else {
        console.log("No carbon for "+t.category_id);
        t["carbon"] = 0;
      } */
    });
    response.json({
      "status": "success",
      "data": transactionsResponse.transactions
    });
  });
});

/*api.post('/analyze_transactions', function(request, response, next) {
  request.transactions() {

  }
}); */

api.get('/get_categories', function(req, res, next) {
  client.getCategories(function(err, response) {
    var fullText = "";
    response.categories.forEach(function(c) {
      fullText += c.category_id + " " + c.hierarchy + '\n';
    });
    res.send(fullText);
    /*res.json({
      "status": "success",
      "data": response.categories
    }); */
  });
});

app.use('/api', api);

app.get('/favicon.ico', function(req, res) {
  res.status(204);
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static('client/build/'));
}

var server = app.listen(APP_PORT, function() {
  console.log('Offset server listening on ' + APP_PORT);
});
