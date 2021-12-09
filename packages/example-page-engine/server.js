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
app.use('/externals', express.static('../../shared'));

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'tmpl/prod.html'));
});

const port = process.env.example_port || 5050;

app.listen(port, function() {
  console.log(`Page engine example running at ${port}`);
});
