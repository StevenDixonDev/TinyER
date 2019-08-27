const Response = require("./response");

function stackHandler() {
  // create a new stack
  this.stack = createStack();
  // define function to add routes and methods to the stack
  this.addToStack = (route, callback, method) => {
    // if user provides middleware route will be a function
    if (typeof route === "function" || method === undefined) {
      // using * as a place holder for all routes
      this.stack["*"].push(route);
    } else if (route instanceof RegExp) {
      // @todo
      // regexHandler
    } else {
      // check if specified method has the route
      if (this.stack[method][route]) {
        // if so add the new function
        this.stack[method][route].push(callback);
      } else {
        // if not define a new route and add the function
        this.stack[method][route] = [callback];
      }
    }
  };
  // use the handle route function defined below, have to bind this to the function
  this.handleRoute = handleRoute.bind(this);
}

module.exports = stackHandler;

// creates and returns a new stack
function createStack(){
  return {
    "*": [
    (req, res, next) => {
      next();
    },
  ],
  "POST": [],
  "GET": [],
  "PUT": [],
  "DELETE": []
}
}

// @todo
function handleRegex() {}

function handleRoute(req, res, options) {
  // define new response object
  res = new Response(res, options);
  // check if request for favicon has come in
  if(req.url === "/favicon.ico") return res.status(204).send();
  // create a new stack to add functions to 
  let newStack = [];
  // set index to less than so zero can go first
  let index = -1;
  // check if method with route exists
  if (this.stack[req.method][req.url]) {
    // if it does the stack will have all of the middleware plus the specified functions
    newStack = [...this.stack["*"], ...this.stack[req.method][req.url]];
  } else {
    // if there are no defined routes only the middleware will be provided 
    newStack = [...this.stack["*"]];
  }
  // start the handler
  next();

  // recursive function loops through stack and applies middleware
  function next() {
    if (index === newStack.length - 1) return;
    index++;
    return newStack[index](req, res, next);
  }
}
