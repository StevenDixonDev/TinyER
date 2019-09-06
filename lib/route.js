const Methods = require("./methods");
const Layer = require('./layer');

// all http methods are saved as routes and assigned to a layer by the router
function Route(path) {
  this.path = path;
  // stack of layers created by http method requests
  this.stack = [];
  // object that keeps track of if the route supports a type of method
  this.methods = {}
  // function to check if this route handles a certain method
  this._handles_method = (method) => {
    return this.methods[method.toLowerCase()];
  }
  // dispatch is bound to the handle function of layer if a route is supplied to the layer
  this.dispatch = (req, res, done) => {
    // get the method from req
    let method = req.method.toLowerCase();
    // start a beggining of stack
    let stack_location = 0;
    // store stack in variable incase we lose this later
    let stack = this.stack;
    // if there are no layers in the stack exit
    if (stack.length === 0) {
      return done();
    }

    // call next function  
    next();

    // define next function
    function next(err) {
      // get the current layer
      let layer = stack[stack_location++];
      // if no layer the function is done
      if (!layer) {
        return done(err);
      }
      // each layer has a method that 
      if (layer.method !== method) {
        return done(err);
      }
      // tell layer to handle request
      layer.handle_req(req, res, next);
    }

  }
}

Methods.forEach(function (method) {
  // map http request verbs to prototype of Route
  Route.prototype[method] = function (...fns) {
    //loop through functions provided by router
    fns.forEach(f => { 
      // create a dummy layer with each function, route does not attempt to match the route
      const layer = new Layer('/', f, {});
      // set the layers method equal to the called method
      layer.method = method;
      // set the layers method object to show the request is supported.
      this.methods[method] = true;
      // add the new layer to the stack
      this.stack.push(layer);
    });
  }
})


module.exports = Route;