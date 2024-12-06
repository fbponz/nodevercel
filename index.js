const express = require('express');
const app = express();
const port = 4000;

app.get('/', (req, res) => {
  res.status(200).json('Hello World!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;