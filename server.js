const express = require('express');
const app = express();
const fs = require('fs');

app.use('/', express.static('./views/build'))

app.use('/assets', express.static('./assets'))

app.engine('html', (filePath, options, callback) => {
  options = options || {};
  fs.readFile(filePath, (err, content) => {
    if (err) return callback(err)
    // this is an extremely simple template engine
    let rendered = content.toString();
    for(const key of Object.keys(options)){
      const exp = `{${key}}`;
      if(rendered.includes(exp))
        rendered = rendered.replace(exp, options[key])
    }
    return callback(null, rendered)
  })
})

app.set('views', './views/build')
app.set('view engine', 'html')

app.use(require('./router'))

const findPort = () => {
  if(process.env.PORT){
    return process.env.PORT;
  }

  if(fs.existsSync('.port')){
    const p = fs.readFileSync('.port', {encoding: 'utf-8'});
    return parseInt(p.trim());
  }

  return 3000;
}

const port = findPort(); 
app.listen(port, () => console.log('listening on port ' + port));