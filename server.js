var express = require('express');
var mustache = require('mustache-express');
var cookieSession = require('cookie-session');
var flash = require('express-flash');

const app = express();
var account_model = require('./models/account_model');
var todo_model = require('./models/todo_model');


const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(flash());

app.engine('html', mustache());
app.set('view engine', 'html');
app.set('views', './views');

app.use(cookieSession({
  secret: 'mot-de-passe-du-cookie'
}));


app.get('/', function (req, res) {
  res.render('index');
})

app.get('/signInPage', (req, res) => {
  res.render('signInPage');
});

app.post('/signInPage', (req, res) => {
  account_model.check_email_password_account(req.body.email, req.body.password).then((response) => {
    if (response == false) {
      res.locals.authenticated = false;

      console.log("not found !");
    }
    else {
      console.log("found !");
      todo_model.getTodoList().then((response) => {
      res.locals.authenticated = true;
      res.render('./homePage', {list:response})
      });
    }
  }
  );
});

app.get('/logout', (req, res) => {
  req.cookies.authenticated = false;
  req.session = null;
  res.redirect('/');
});



app.post('/up', function(req, res){
  var txt_folder_name = req.body;

  console.log(txt_folder_name);
  //Do other stuff
})


app.listen(4000)