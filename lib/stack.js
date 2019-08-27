const Response = require("./response");

function stackHandler() {
  this.stack = createStack();
  this.addToStack = (route, callback, method) => {
    if (typeof route === "function" || method === undefined) {
      this.stack["*"].push(route);
    } else if (route instanceof RegExp) {
      // @todo
      // regexHandler
    } else {
      if (this.stack[method][route]) {
        this.stack[method][route].push(callback);
      } else {
        this.stack[method][route] = [callback];
      }
    }
  };
  this.handleRoute = handleRoute.bind(this);
}

module.exports = stackHandler;

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

function handleRegex() {}

function handleRoute(req, res) {
  res = new Response(res);
  if(req.url === "/favicon.ico") return res.status(204).send();
  let newStack = [];
  let index = -1;
  if (this.stack[req.method][req.url]) {
    newStack = [...this.stack["*"], ...this.stack[req.method][req.url]];
  } else {
    newStack = [...this.stack["*"]];
  }
  next();

  function next() {
    if (index === newStack.length - 1) return;
    index++;
    return newStack[index](req, res, next);
  }
}
