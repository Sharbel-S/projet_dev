var express = require('express');
var mustache = require('mustache-express');
var cookieSession = require('cookie-session');
var flash = require('express-flash');

const app = express();
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



// GET

app.get('/', function (req, res) {
  res.render('index');
})

app.get('/signInPage', (req, res) => {
  res.render('signInPage');
});

app.get('/signUpPage', (req, res) => {
  res.render('signUpPage');
})

app.get('/logout', (req, res) => {
  req.session = null;
  res.redirect('/');
});

// POST

app.post('/signUp', async (req, res) => {
  await dataTreatment.tryToSignUp(req, res);
})

app.post('/signInPage', async (req, res) => {
  await dataTreatment.tryToSignIn(req, res);
});

app.post('/addNewTodoGroup', async (req, res) => {
  await dataTreatment.addNewTodoGroup(req.session.userId, req.body.group, req.body.color, res);
});

app.post('/changeTodoStatus', async (req, res) => {
  await dataTreatment.changeTodoStatus(req.body.taskId, res);
});

app.post('/changeTodoStatusToDone', async (req, res) => {
  await dataTreatment.changeTodoStatusToDone(req.body.taskId, res);
});

app.post('/getGroupInfo', async (req, res) => {
  await dataTreatment.getGroupInfo(req.body.groupId, res);
});

app.post('/editTodoGroup', async (req, res) => {
  await dataTreatment.editTodoGroup(req.body, res);
});

app.post('/modifyTodo', async (req, res) => {
  await dataTreatment.modifyTodo(req.body, res);
});

app.post('/addNewTodo', async (req, res) => {
  await dataTreatment.addNewTodo(req.body, res);
});

// DELETE

app.delete('/deleteGroup', async (req, res) => {
  await dataTreatment.deleteGroup(req.body.groupId, res);
});

app.delete('/deleteTask', async (req, res) => {
  await dataTreatment.deleteTask(req.body.taskId, req.body.groupId, res);
});


// Get methodes that need a to have an account to access

app.use(is_authenticated);

app.get('/mainPage', is_authenticated, async (req, res) => {
  var response = await dataTreatment.getAllGroupsById(req.session.userId);
  res.render('mainPage', { list: response });
});

app.get('/tasks/:id', is_authenticated, async (req, res) => {
  var response = await dataTreatment.getAllTasksById(req.params.id);
  var grpName = await dataTreatment.getGroupName(req.params.id);
  var grpId = await dataTreatment.getGroupId(req.params.id);
  res.render('tasksList', { list: response, grpName, grpId });
});

// framework to check authentification
function is_authenticated(req, res, next) {
  if (req.session.userId !== undefined) {
    res.locals.authenticated = true;
    return next();
  }
  res.status(401).send('Authentication required');
}

app.listen(5000, () => console.log('listening on http://localhost:5000'));