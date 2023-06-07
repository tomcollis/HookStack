/**
 * Module dependencies.
 */
const express = require('express');
const { Deta } = require('deta');  // import Deta
var app = module.exports = express();
app.use(express.json());
var path = require('path');

/**
 * Deta variables.
 */
const myDataKey = process.env.MY_DATA_KEY;
const deta = Deta(myDataKey);
// Deta database name
const db = deta.Base('HookStack');

// create an error with .status. we
// can then use the property in our
// custom error handler (Connect repects this prop as well)

function error(status, msg) {
  var err = new Error(msg);
  err.status = status;
  return err;
}

// the following, accepts http get requests and provides
// a simple help guide or introduction

app.get('/', function(req, res){
    res.status(200);
    res.set('Cache-control', `no-store`)
    res.sendFile(path.join(__dirname, 'index.html'));
    //res.send({ error: "home" });
});

// the following, accepts any http posts that contains data
// and then saves it to a database using the source parameter
// for the system-id field and saving the body as a JSON object

app.post('/', function(req, res){
    res.status(404);
    res.set('Cache-control', `no-store`)
    res.send({ error: "data shouldn't be posted here" });
    console.log('received: data posted to wrong endpoint');
});

// the following, accepts any http posts that contains data
// and then saves it to a database using the source parameter
// for the system-id field and saving the body as a JSON object

app.post('/p/', function(req, res){
    // post is empty
    if (req.body.length <= 0) {
    res.status(404);
    res.set('Cache-control', `no-store`)
    res.send({ error: "no data" });
    console.log('received: empty request');
    } else {
    // post is not empty
    var source = req.query['source'];
    if (source === undefined) {
        var source = 'unknown';
      };
    var timeKey = Date.now();
    console.log('receiving data from: ' + source + ' at ' + timeKey);
    db.put({ key: timeKey.toString(), body: req.body, source });
    res.status(200);
    res.set('Cache-control', `no-store`)
    res.send({ success: "data received", key: timeKey, body: req.body, source });
    console.log('data received and processed');
    }
});

// here we validate the API key,
// by mounting this middleware to /api
// meaning only paths prefixed with "/api"
// will cause this middleware to be invoked

app.use('/', function(req, res, next){
  var key = req.query['api-key'];
  // key isn't present
  if (!key) return next(error(400, 'api key required'));
  // key is invalid
  if (key !== apiKeys) return next(error(401, 'invalid api key'));
  // all good, store req.key for route access
  req.key = key;
  next();
});

// valid api key
// api keys do_not_serve as authentication, merely to
// track API usage or help prevent malicious behavior etc.

var apiKeys = process.env.API_KEY;

// we now can assume the api key is valid,
// and simply expose the data

// get all records for source provided in URL
// then delete all retrieved records
app.get('/webhooks/:source', async (req, res) => {
    // Get source from URL parameter
    const { source } = req.params
    console.log('Retrieving items for source: ' + source);

    // ORIGINAL - Get all records from source system
    // const { value: items} = await db.fetch([{"source":source}]);
    // console.log('Retrieved ' + items.length + ' items');

    // START NEW PART

    let resA = await db.fetch([{"source":source}]);
    let items = resA.items;
    
    // continue fetching until last is not seen
    while (resA.last){
      resA = await db.fetch([{"source":source}], {last: resA.last});
      items = items.concat(resA.items);
    }
    console.log('Retrieved ' + items.length + ' items');
    
    // END NEW PART

    // Create response
    res.set('Cache-control', `no-store`)
    res.setHeader("Content-Count", items.length);
    res.json({ items: items });
    // Delete retrieved records
    for (const element of items) {
      console.log('Deleting: ' + element.key)
      db.delete(element.key)
      console.log('Deleted: ' + element.key);
    }
});

// get all records for source unknown
// then delete all retrieved records
app.get('/webhooks/', async (req, res) => {
    // set source to unknown as not provided in URL
    var source = "unknown";
    console.log('Retrieving items for unknown source');
    // ORIGINAL - Get all records from source system
    // const { value: items} = await db.fetch([{"source":source}]).next();
    // console.log('Retrieved ' + items.length + ' items');

    // START NEW PART

    let resA = await db.fetch([{"source":source}]);
    let items = resA.items;
    
    // continue fetching until last is not seen
    while (resA.last){
      resA = await db.fetch([{"source":source}], {last: resA.last});
      items = items.concat(resA.items);
    }
    console.log('Retrieved ' + items.length + ' items');
    
    // END NEW PART

    // Create response
    res.set('Cache-control', `no-store`)
    res.setHeader("Content-Count", items.length);
    res.json({ items: items });
    // Delete retrieved records
    for (const element of items) {
      console.log('Deleting: ' + element.key)
      db.delete(element.key)
      console.log('Deleted: ' + element.key);
    }
});

// middleware with an arity of 4 are considered
// error handling middleware. When you next(err)
// it will be passed through the defined middleware
// in order, but ONLY those with an arity of 4, ignoring
// regular middleware.
app.use(function(err, req, res, next){
  // whatever you want here, feel free to populate
  // properties on `err` to treat it differently in here.
  res.status(err.status || 500);
  res.set('Cache-control', `no-store`)
  res.send({ error: err.message });
});

// our custom JSON 404 middleware. Since it's placed last
// it will be the last middleware called, if all others
// invoke next() and do not respond.
app.use(function(req, res){
  res.status(404);
  res.set('Cache-control', `no-store`)
  res.send({ error: "can't find that" });
});

const port = parseInt(process.env.PORT || 443);
app.listen(port, () => {
   console.log(`HookStack: listening on port ${port}`);
});