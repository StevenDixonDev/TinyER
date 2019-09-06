const http = require("http");
const Methods = require('./methods');
const Router = require('./router');
const Response = require('./response');

// return the app that is normally seen in express
function App() {
  // define use to make use of express style use
  this.options = {
    views: null,
    engine: null
  };
  // app is just a wrapper for the a router object
  this._router = new Router();
  // map this .use to the routers .use
  this.use = (path, ...fn) => {
    // map use to router.use
    this._router.use(path, ...fn);
    return this;
  };
  // allows user to assign engine and extension to use for the render engine
  this.engine = (extension, engine) => {
    this.options.engine = engine;
    this.options.extension = extension;
    return this;
  };
  // allows user to set options or create new options
  this.set = (key, value) => {
    this.options[key] = value;
    return this;
  };
  // create the http server and runs the specified callback 
  this.listen = (port, callback) => {
    http.createServer((req, res) =>
        this._router.handle(req, new Response(res, this.options))
      )
      .listen(port);
    callback();
  };
}

// add method types to the apps prototype
Methods.forEach(method => {
  App.prototype[method] = function(path, ...fn) {
    // create a new route.
    let route = this._router.route(path);
    // apply the functions passed here to the route method
    route[method].apply(route, fn);
    return this;
  };
});

function createApp() {
  // create a new app
  const app = new App();
  // return the app
  return app;
}

// the greatest oddity of all 
exports = module.exports = createApp;
exports.Router = Router;

