const tinyER = require('../lib');

// create application
const app = tinyER();

// set app to use middleware
app.use(testMiddleWare);

// set simple route, currently regex not working
app.get('/', (req, res)=>{
  console.log('test')
  res.status(200).send("<h2>HELLO WORLD</h2>");
});

app.get('/test', (req, res)=>{
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