const http = require("http");
const stack = require("./stack");

const Methods = ["get", "post", "put", "delete"];

// return the app that is normally seen in express
function tinyer() {
  // function to create an app
  function CreateApp() {
    // define use to make use of express style use
    this.stack = new stack();
    this.use = (path, callback) => {
      // if first item is a function append it to the route ''
      this.stack.addToStack(path, callback);
    };
    this.route = () => {
      // @todo
      throw 'Not implemented'
    };
    // create the http server
    this.listen = (port, callback) => {
      http.createServer(this.stack.handleRoute).listen(port);
      callback();
    };
  }
  
  // add method types to the apps prototype
  Methods.forEach(method => {
    CreateApp.prototype[method] = function(route, callback){
      this.stack.addToStack(route, callback, method.toUpperCase());
    };
  });

  // create a new app
  const app = new CreateApp();
  // return the app
  return app;
}

module.exports = tinyer;

// create a response object that handles mapping http to express style functions
