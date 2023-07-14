const express = require('express');
const templating = require('./server.templating')
const routing = require('./server.routing.js');

const app = express();

templating.useTemplates(app);

app.use(routing);

const port = process.env.PORT || 3000; 
app.listen(port, () => {
  console.log('listening on port ' + port)
});