const express = require('express');
const fs = require('fs');
const templating = require('./server.templating')

const app = express();

templating.useTemplates(app);


app.use(require('./server.routing.js'))

const port = process.env.PORT || 3000; 
app.listen(port, () => console.log('listening on port ' + port));