const tinyER = require('../lib');
const bodyParser = require("body-parser");
// create application
const app = tinyER();

// set app to use middleware
app.use(testMiddleWare);
app.use(bodyParser.json());

// set simple route, currently regex not working
app.get('/', (req, res)=>{
  
  //res.status(200).send("<h2>HELLO WORLD</h2>");
  res.send("<p>Hello Server</p>");
})

app.post('/', (req, res)=>{
  console.log(req.body);
  //res.status(200).send("<h2>HELLO WORLD</h2>");
  res.status(200).send();
});

app.get('/test', (req, res)=>{
  console.log(req.method);
  res.sendFile(__dirname + "/index.html");
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