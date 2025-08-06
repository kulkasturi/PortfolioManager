const express = require('express');
const app = express();

app.get('/', (req, res) => {
  console.log('GET / hit!');
  res.send('It works!');
});

app.listen(8980, () => {
  console.log('✅ Test server running on http://localhost:8980');
});
