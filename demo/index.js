const tinyER = require('../lib');
const bodyParser = require("body-parser");
const exphbs  = require('express-handlebars');
const path = require("path");

// create application
const app = tinyER();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');
app.engine('handlebars', exphbs());


// set app to use middleware
app.use(testMiddleWare);
app.use(bodyParser.json());

// set simple route, currently regex not working
app.get('/', (req, res)=>{
  
  //res.status(200).send("<h2>HELLO WORLD</h2>");
  res.send("<p>Hello Server</p>");
})

app.post('/', (req, res)=>{

  res.status(200).send();
});

app.get('/test', (req, res)=>{

  res.sendFile(__dirname + "/index.html");
});

app.get('/handlebar', (req, res)=>{
  
  res.render("test.handlebars", {lay: false , t: "<p>sdfsadf</p>"});
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