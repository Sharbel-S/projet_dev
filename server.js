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

app.get('/signUpPage', (req, res) => {
  res.render('signUpPage');
})

app.post('/signUp', (req, res) => {
  account_model.check_if_email_already_used(req.body.email).then((response) => {
    if (response == false) {
      if (req.body.password !== req.body.confirmPassword) {
        req.flash('info', 'Password and confirmation are not the same');
        res.redirect('/signUpPage');
      }
      else {
        account_model.create_new_account(req.body.email, req.body.password).then((response) => {
          if(response != null) {
            res.locals.authenticated = true;
            res.render('./homePage');
          }
        })
      }
    }
    else {
      req.flash('info', 'Email already used');
      res.redirect('/signUpPage');
    }
  })
})

app.post('/signInPage', (req, res) => {
  account_model.check_email_password_account(req.body.email, req.body.password).then((response) => {
    if (response == null) {
      req.flash('info', 'Incorect username or password');
      res.redirect('/signInPage');
    }
    else {
      console.log(response);
      todo_model.getTodoList().then((response) => {
        res.locals.authenticated = true;
        res.render('./homePage', { list: response })
      });
    }
  }
  );
});

app.get('/logout', (req, res) => {
  req.session = null;
  res.redirect('/');
});



app.post('/up', function (req, res) {
  var txt_folder_name = req.body;

  console.log(txt_folder_name);
  //Do other stuff
})


app.listen(4000)