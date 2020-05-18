const express = require('express');
const cors = require('cors');
const NodeCache = require( "node-cache" );
const uuid = require('uuid-random');

const cache = new NodeCache({
  stdTTL: 600,
  checkperiod: 600
});

const app = express();
app.use(cors())
app.use(express.text());

app.get('/api/value/:key', (req, res)=>{

    if(!req.headers.token){
      res.send('No token was provided. Please, provide a token.');
    } else {
      const item = cache.get(req.headers.token.concat(req.params.key));
      const response = item ? item.value : 'No value matches the provided token and key.';
      res.send(response)
    }
});

app.get('/api/token', function(req, res){
  res.send(uuid());
})


app.put('/api/value/:key',(req, res)=>{
    if(!req.headers.token){
      res.send('No token was provided. Please, provide a token.');
    } else {
      const data = {
        value: req.body,
        key: req.params.key
      }
      createValueRow(req.headers.token, data);
      res.send('Item has been created.')
    }
})
function createValueRow(token, dataToStore){
    const tokenKey = token.concat(dataToStore.key);
    const success = cache.set( tokenKey, dataToStore );
    return success;
}
app.listen(process.env.PORT || 8000, ()=>{console.log('Server started on 8000')});
