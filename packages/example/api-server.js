/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/dist', express.static('dist'));
app.use('/pkg', express.static('pkg'));
app.use('/externals', express.static('externals'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/page-engine', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/page-engine/index.html'));
});

const tasks = [
  {
    id: 23,
    title: 'this is first todo task',
    description: 'password',
    status: 'working',
    create_date: '2017-12-24T00:00:00.000Z',
  },
];

// list todos
app.get('/todos', function(req, res) {
  const status = req.query.status;
  if (!status) {
    return res.send(tasks);
  }

  return res.send(tasks.filter((task) => task.status === status));
});

app.post('/todos', (req, res) => {
  if (!req.body.title) {
    res.status(400);
    res.send({ message: 'title required' });
    return;
  }

  const newTask = {
    id: Date.now(),
    title: req.body.title,
    status: 'working',
    create_date: (new Date()).toISOString(),
  };

  tasks.unshift(newTask);

  res.send(newTask);
});

app.delete('/todos/:todoId', (req, res) => {
  const todoID = parseInt(req.params.todoId);
  const index = tasks.findIndex(({ id }) => id === todoID);

  if (index === -1) {
    res.status(404);
    res.send();
    return;
  }

  tasks.splice(index, 1);
  res.status(204);
  res.send();
});

app.put('/todos/:todoId', (req, res) => {
  const todoID = parseInt(req.params.todoId);
  const index = tasks.findIndex(({ id }) => id === todoID);

  if (index === -1) {
    res.status(404);
    res.send();
    return;
  }

  tasks.splice(index, 1, req.body);
  res.status(200);
  res.send();
});

app.get('/todo_status', (req, res) => {
  res.send({
    all: tasks.length,
    working: tasks.filter(({ status }) => status === 'working').length,
    done: tasks.filter(({ status }) => status === 'done').length,
  });
});

app.listen(8080, function() {
  console.log('Running on port 8080!');
});
