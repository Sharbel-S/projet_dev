const express = require('express');
var mustache = require('mustache-express');
const app = express();
var account_model = require('./models/account_model');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

app.engine('html', mustache());
app.set('view engine', 'html');
app.set('views', './views');


app.get('/', function (req, res) {
  res.render('index');
})

app.get('/signInPage', (req, res) => {
  res.render('signInPage');
});

app.post('/signInPage', (req, res) => {
  account_model.check_email_password_account(req.body.email, req.body.password).then((response) => {
    if (response == false) {
      console.log("not found !");
    }
    else {
      console.log("found !");
    }
  }
  );
});

app.listen(5000)