const tinyER = require('../lib');
const bodyParser = require("body-parser");
const exphbs  = require('express-handlebars');
const path = require("path");

const router = tinyER.Router();
// create application
const app = tinyER();

router.get('/hb', function(req, res) {
  res.render('index', {message: 'I am a nested handlebar route'});
});

router.get('/', function (req, res) {
  res.send('Birds home page');
});




app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');
app.engine('handlebars', exphbs());


//set app to use middleware
app.use(testMiddleWare);
app.use(bodyParser.json());
app.use('/birds', router);


// example of a post request
app.post('/', (req, res)=>{
  console.log('test');
  console.log(req.body);
  res.status(200).json("thank you");
});

// set simple route, currently regex not working
app.get('/', (req, res)=>{
  //res.status(200).send("<h2>HELLO WORLD</h2>");
  res.send("<p>Hello Server</p>");
})

app.get('/t', (req, res)=>{
  //res.status(200).send("<h2>HELLO WORLD</h2>");
  res.redirect('/test');
})

app.get('/test', (req, res)=>{
  res.sendFile(__dirname + "/index.html");
});

app.get('/handlebar', (req, res)=>{
  
  res.render("test", {lay: false , t: "<p>Hi I am a handlebars demo</p>"});
});

// tell the app to  listen on port 8080
app.listen(8080, ()=>{
  console.log('running on 8080')
})

// define the middleware
function testMiddleWare(res, req, next){
  console.log('I am a user defined middleware!')
  next();
}