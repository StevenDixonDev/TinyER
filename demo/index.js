const tinyER = require('../lib');
const bodyParser = require("body-parser");
const exphbs  = require('express-handlebars');
const path = require("path");
const static = require('serve-static');

const PORT = process.env.PORT || 3000;
// create router
const router = tinyER.Router();
// create application
const app = tinyER();

// set a route on the router
router.get('/', (req, res)=>{
  res.send('This is a sub-route');
})

// set views location
app.set('views', path.join(__dirname, 'views'));
// set view engine name
app.set('view engine', 'handlebars');
// set handlebars to the actual engine function
app.engine('handlebars', exphbs());

//set app to use middleware
app.use(testMiddleWare);
app.use(bodyParser.json());
app.use(static(__dirname + '/public'));
// use a router object as a route
app.use('/test', router);

// example of a post request
app.post('/', (req, res)=>{
  res.status(200).json("thank you");
});

// set simple route, currently regex not working
app.get('/', (req, res)=>{
  res.render("index", {home: req.url});
})

// optional parameters and queries
app.get('/Routing/:name?', (req, res) =>{
  let query = Object.keys(req.query).map(key => `${key}: ${req.query[key]}`);
  res.render("route" , {routing: req.url, params: req.params.name, query});
});

app.get('/Middleware', (req, res) =>{
  res.render("middleware", {middle: req.url});
});

app.post('/Middleware', (req, res) =>{
  res.json(req.body);
});

app.get('/Rendering', (req, res) =>{
  res.render("render", {render: req.url});
});

// use a different layout with handlebars
app.get('/test', (req, res) =>{
  res.render('index', { title: 'my other page', layout: 'second' });
});

// sendfile example
app.get('/sendfile', (req, res)=>{
  res.sendFile(__dirname + "/index.html");
});

// redirect example
app.get('/redirect', (req, res)=>{
  res.redirect('/sendfile');
})

// handle bars example
app.get('/handlebar', (req, res)=>{  
  res.render("test", {lay: false , t: "<p>Hi I am a handlebars demo</p>"});
});

// redirect all non matched routes
app.get('*', (req, res) => {
  res.redirect('/');
})

// tell the app to  listen on port 8080
app.listen(PORT, ()=>{
  console.log('running on port: ' + PORT)
})

// define the middleware
function testMiddleWare(res, req, next){
  console.log('I am a user defined middleware!');
  next();
}