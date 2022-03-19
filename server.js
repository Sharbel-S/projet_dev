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
    if (response == null) {
      if (req.body.password !== req.body.confirmPassword) {
        req.flash('info', 'Password and confirmation are not the same');
        res.redirect('/signUpPage');
      }
      else {
        account_model.create_new_account(req.body.email, req.body.password).then((response) => {
          if (response != null) {
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
      todo_model.getTodoList().then((response) => {
        res.locals.authenticated = true;
        req.session.email = req.body.email;
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


app.use(is_authenticated);

app.get('/addNewTodo', is_authenticated,(req, res) => {
  console.log("local ", res.locals);
  res.render('addNewTodo');
});


app.post('/addTodo', (req, res) => {
  todo_model.insert_new_todo(req.session.email, req.body).then((response) => {
    console.log(response);

  })
});

function is_authenticated(req, res, next) {
  if (req.session.email !== undefined) {
    res.locals.authenticated = true;
    return next();
  }
  res.status(401).send('Authentication required');
}

app.listen(5000)