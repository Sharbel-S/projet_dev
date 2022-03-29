var express = require('express');
var mustache = require('mustache-express');
var cookieSession = require('cookie-session');
var flash = require('express-flash');

const app = express();
var account_model = require('./models/account_model');
var todo_model = require('./models/todo_model');
var dataTreatment = require('./buisness_model/dataTreatment');


const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(flash());

//expose public directory
app.use(express.static('public'));


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
    if (!response) {
      if (req.body.password !== req.body.confirmPassword) {
        req.flash('info', 'Password and confirmation are not the same');
        res.redirect('/signUpPage');
      }
      else {
        account_model.create_new_account(req.body.email, req.body.password).then((responseId) => {
          if (response != null) {
            res.locals.authenticated = true;
            req.session.userId = responseId;
            res.redirect('./mainPage');
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
  account_model.check_email_password_account(req.body.email, req.body.password).then((responseId) => {
    if (responseId == null) {
      req.flash('info', 'Incorect username or password');
      res.redirect('/signInPage');
    }
    else {
      req.session.userId = responseId;
      res.locals.authenticated = true;
      res.redirect('./mainPage');
    }
  }
  );
});


app.post('/addNewTodoGroup', (req, res) => {
  todo_model.add_new_todo_group(req.session.userId, req.body.group, req.body.color).then((response) => {
    if (response) {
      res.send(200);
    }
    else {
      res.send(404);
    }
  })
});

app.delete('/deleteGroup', (req, res) => {
  todo_model.delete_selected_todo_group(req.body.groupId).then((response) => {
    res.send(req.body.groupId);
  })
});

app.delete('/deleteTask', (req, res) => {
  todo_model.delete_selected_todo(req.body.taskId).then((response) => {
    res.send(req.body.groupId);
  })
});


app.post('/changeTodoStatus', (req, res) => {
  todo_model.set_todo_status_to_todo(req.body.taskId).then((response) => {
    res.send("done");
  })
});

app.post('/changeTodoStatusToDone', (req, res) => {
  todo_model.set_todo_status_to_done(req.body.taskId).then((response) => {
    res.send("done");
  })
});

app.post('/getGroupInfo', (req, res) => {
  todo_model.get_group_info(req.body.groupId).then((response) => {
    res.send(response[0]);
  })
});

app.post('/editTodoGroup', (req, res) => {
  todo_model.edit_todo_group_info(req.body.groupId, req.body.group, req.body.color).then((response) => {
    res.send("done !");
  })
});

app.post('/modifyTodo', (req, res) => {
  todo_model.edit_todo_info(req.body.id, req.body.title, req.body.description, req.body.limited_date).then((response) => {
    res.send("done !");
  })
});

app.post('/addNewTodo', (req, res) => {
  todo_model.add_new_todo(req.body.groupId, req.body.groupName, req.body.title, req.body.limited_date, req.body.description).then((response) => {
    res.send("done !");
  })
});



app.get('/logout', (req, res) => {
  req.session = null;
  res.redirect('/');
});


app.use(is_authenticated);

app.get('/mainPage', is_authenticated, async (req, res) => {
  var response = await dataTreatment.getAllGroupsById(req.session.userId);
  res.render('mainPage', { list: response });
});

app.get('/tasks/:id', (req, res) => {
  todo_model.get_all_tasks_of_group(req.params.id).then((response) => {
    res.render('tasksList', { list: response, });
  });
});

app.get('/test', is_authenticated, (req, res) => {
  todo_model.get_all_tasks_of_group("623ee300dda95d7d76975939").then((response) => {
    var grpName = response[0].groupName;
    var grpId = response[0].groupId;
    res.render('tasksList', { list: response, grpName, grpId });
  });
});



app.post('/addTodo', (req, res) => {
  todo_model.insert_new_todo(req.session.email, req.body).then((response) => {
    console.log(response);
  })
});




function is_authenticated(req, res, next) {
  if (req.session.userId !== undefined) {
    res.locals.authenticated = true;
    return next();
  }
  res.status(401).send('Authentication required');
}

app.listen(5000)