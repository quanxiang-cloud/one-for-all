/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

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
  res.send(tasks);
});

app.post('/todos', (req, res) => {
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
    return;
  }

  tasks.splice(index, 1);
  res.status(204);
});

app.put('/todos/:todoId', (req, res) => {
  const todoID = parseInt(req.params.todoId);
  const index = tasks.findIndex(({ id }) => id === todoID);

  if (index === -1) {
    res.status(404);
    return;
  }

  tasks.splice(index, 1, req.body);
  res.status(200);
});

app.listen(8080, function() {
  console.log('Running on port 8080!');
});
