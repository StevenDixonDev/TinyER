const parseUrl = require("parse-url");
const Methods = require("./methods");
const Route = require("./route");
const Layer = require("./layer");

// The router object is the main building block of express
function Router() {
  // stack of layers
  this.stack = [];
  // handle the request from the server by moving through the stack and matching the route
  this.handle = (req, res, done) => {
    //bind this to self so it is not lost
    const self = this;
    // if done is not defined create a new function that will be called when the stack has been fully run through
    done =
      done ||
      function(err) {
        console.log("done");
        res.status(404);
        res.send();
      };
    // set the current location in the stack to the start
    let stack_location = 0;
    // save the stack in a variable so this is not lost.
    let stack = self.stack;
    // call next to start moving through the loop
    next();
    // define the next function
    function next() {
      // make sure we are not at the end of the stack
      if (stack_location >= stack.length) {
        return done();
      }
      // get the current path
      let path = parseUrl(req.url).pathname;
      // if there is an issue with the path exit from the stack
      if (path == null) {
        return done();
      }
      // if path is empty we should use /
      if (path.length === 0) {
        path = "/";
      }

      let layer;
      let match;
      let route;

      // loop through the stack
      while (match !== true && stack_location < stack.length) {
        // get current stack and update location after
        layer = stack[stack_location++];
        // use the current layer to match the path
        match = layer.match(path);
        // get the current layers route
        route = layer.route;
        // if not route we don't care about the rest of the while loop
        // because layers with no routes are either middleware or another router object
        if (!route) {
          // process non-route handlers normally
          continue;
        }
        // get the current method from the request
        const method = req.method;
        // check if the current layers method can handle the request
        // if it can't there is no reason to process it.
        const has_method = route._handles_method(method);
        if (!has_method) {
          // sets match to false and continues the while loop
          match = false;
          continue;
        }
      }

      if (match !== true) {
        // if there are no matches for the path we can exit
        return done();
      }

      // get the path the layer is associated with
      let layerPath = layer.path;
      // set the parameters of the req to the parameter matched on the layer
      req.params = layer.params;
      // assign the query parameter to the req.query 
      if(!req.query){
        req.query = {...parseUrl(req.url).query};
      }
      // handle the matching layer having a route
      if (route) {
        return layer.handle_req(req, res, next);
      }
      // if the layer does not have a route it is either a middleware or a router object that will need to be trimmed
      prefix_trim(layer, layerPath, path, req, res, next);
    }
  };
  // function for removing the beginning of a url path
  function prefix_trim(layer, layerPath, path, req, res, next) {
    // temporary variable to store the result of removing the layers path from the current path
    let p = path.replace(layerPath, "");
    // if the new path is empty add a /
    req.url = p ? p : "/";
    // use the matched layer to handle the path this will match routes inside of another router
    layer.handle_req(req, res, next);
  }
  // allows users to assign middle ware or routes
  this.use = (path, ...fn) => {
    // add layers to stack
    // if path is a function then set path as catch all
    if (typeof path === "function") {
      fn = [path];
      path = "*";
    }
    // loop through all provided fns
    fn.forEach(f => {
      // if f has handle it is a router or app object, if not handle it normally
      if (!f.handle) {
        const layer = new Layer(path, f, {
          strict: false,
          end: true
        });
        layer.route = undefined;
        // add the new layer to the stack
        return this.stack.push(layer);
      }
      // if f has a handle function we use that one to handle the requests
      const layer = new Layer(path, f.handle.bind(f),
      {
        strict: false,
        end: false
      });
      layer.route = undefined;
      // add the new layer to the stack
      return this.stack.push(layer);
    });
    return this;
  };
  // creates a new route and layer and adds them to the stack, this is used by app.use and the http methods
  this.route = path => {
    // if the path is not a string an issue will occur
    if (typeof path !== "string") {
      throw "please provide a path";
    }
    // create a new route with the supplied path
    const route = new Route(path);
    // creat a layer and bind the routes handle function as the layers new handle function
    const layer = new Layer(path, route.dispatch.bind(route), {
      strict: false,
      end: true
    });
    // assign the new route to the layer
    layer.route = route;
    // add the layer to the stack
    this.stack.push(layer);
    return route;
  };
}

Methods.forEach(function(method) {
  // assign methods to Router when router is defined outside of
  // this is not used unless defined with Router[methodname]
  Router.prototype[method] = function(path, ...fn) {
    var route = this.route(path);
    route[method].apply(route, fn);
    return this;
  };
});

// function to create the new router
function createRouter() {
  return new Router();
}

module.exports = createRouter;
