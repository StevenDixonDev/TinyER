const tinyER = require('../lib');
const bodyParser = require("body-parser");
const exphbs  = require('express-handlebars');
const path = require("path");
const static = require('serve-static');

// create router
const router = tinyER.Router();
// create application
const app = tinyER();


// tell router to use get path
router.get('/hb', function(req, res) {
  res.render('index', {message: 'I am a nested handlebar route'});
});

// tell router to use get path
router.get('/', function (req, res) {
  res.send('Birds home page');
});

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

// tell app to use the router created above
app.use('/birds', router);

// example of a post request
app.post('/', (req, res)=>{
  console.log(req.body);
  res.status(200).json("thank you");
});

// set simple route, currently regex not working
app.get('/', (req, res)=>{
  res.render("index", {lay: false , t: "<p>Hi I am a handlebars demo</p>"});
})

app.get('/re/:name/', (req, res)=>{
  console.log(req.params.name, 'test')
})



// // sendfile example
// app.get('/test', (req, res)=>{
//   res.sendFile(__dirname + "/index.html");
// });

// // redirect example
// app.get('/t', (req, res)=>{
//   res.redirect('/test');
// })

// handle bars example
app.get('/handlebar', (req, res)=>{  
  res.render("test", {lay: false , t: "<p>Hi I am a handlebars demo</p>"});
});

app.get('*', (req, res) => {
  res.redirect('/');
})

// tell the app to  listen on port 8080
app.listen(8080, ()=>{
  console.log('running on 8080')
})

// define the middleware
function testMiddleWare(res, req, next){
  console.log('I am a user defined middleware!');
  next();
}