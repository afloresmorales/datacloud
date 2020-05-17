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
app.use(express.json());

app.get('/api/value/:key', (req, res)=>{

    if(typeof req.headers.token === 'undefined'){
      res.json({
        message: 'No token was provided. Please, provide a token.'
      });
    } else {
      console.log('CALLED: ', req.headers.token, req.params.key)
      const value = cache.get(req.headers.token.concat(req.params.key));
      console.log('VALUE: ', value)
      res.json({
        value
      })
    }
});

app.get('/api/token', function(req, res){
  res.send({
    token: uuid()
  });
})


app.post('/api/value',(req, res)=>{
    if(typeof req.headers.token === 'undefined'){
      res.json({
        message: 'No token was provided. Please, provide a token.'
      });
    } else {
      console.log('body: ', req.body);
      const message = createValueRow(req.headers.token, req.body);
      res.json({
        message
      })
    }
})
function createValueRow(token, dataToStore){
    const tokenKey = token.concat(dataToStore.key);
    console.log('tokenKey: ', tokenKey)
    const success = cache.set( tokenKey, dataToStore );
    return success;
}
app.listen(8000, ()=>{console.log('Server started on 8000')});
